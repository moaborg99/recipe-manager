"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { validateTitle } from "@/lib/recipe-validation";
import { slugify } from "@/lib/slugify";

export type CreateCategoryResult =
  | { success: true; slug: string }
  | { success: false; error: string };

export type UpdateCategoryResult = CreateCategoryResult;

export type DeleteCategoryResult =
  | { success: true }
  | { success: false; error: string };

async function slugTakenByOtherCategory(
  slug: string,
  excludeCategoryId?: string,
): Promise<boolean> {
  const row = await prisma.category.findFirst({
    where: {
      slug,
      ...(excludeCategoryId ? { NOT: { id: excludeCategoryId } } : {}),
    },
    select: { id: true },
  });
  return row !== null;
}

async function resolveUniqueCategorySlug(
  baseSlug: string,
  excludeCategoryId?: string,
): Promise<string> {
  let candidate = baseSlug;
  let n = 2;
  for (;;) {
    const taken = await slugTakenByOtherCategory(candidate, excludeCategoryId);
    if (!taken) return candidate;
    candidate = `${baseSlug}-${n}`;
    n += 1;
  }
}

async function revalidateCategoryListAndRecipeUIs() {
  revalidatePath("/categories");
  revalidatePath("/recipes");
  revalidatePath("/recipes/new");
}

async function revalidateRecipesUsingCategoryId(categoryId: string) {
  const recipes = await prisma.recipe.findMany({
    where: {
      categories: { some: { categoryId } },
    },
    select: { slug: true },
  });
  for (const r of recipes) {
    revalidatePath(`/recipes/${r.slug}`);
  }
}

export async function createCategory(input: {
  title: string;
}): Promise<CreateCategoryResult> {
  const titleErr = validateTitle(input.title);
  if (titleErr) return { success: false, error: titleErr };

  const title = input.title.trim();
  const baseSlug = slugify(title);
  const slug = await resolveUniqueCategorySlug(baseSlug);

  await prisma.category.create({
    data: { title, slug },
  });

  await revalidateCategoryListAndRecipeUIs();

  return { success: true, slug };
}

export async function updateCategory(input: {
  initialSlug: string;
  title: string;
}): Promise<UpdateCategoryResult> {
  const existing = await prisma.category.findUnique({
    where: { slug: input.initialSlug },
    select: { id: true, slug: true },
  });
  if (!existing) {
    return { success: false, error: "Category not found." };
  }

  const titleErr = validateTitle(input.title);
  if (titleErr) return { success: false, error: titleErr };

  const title = input.title.trim();
  const baseFromTitle = slugify(title);
  const newSlug =
    baseFromTitle === existing.slug
      ? existing.slug
      : await resolveUniqueCategorySlug(baseFromTitle, existing.id);

  await prisma.category.update({
    where: { id: existing.id },
    data: { title, slug: newSlug },
  });

  await revalidateRecipesUsingCategoryId(existing.id);
  await revalidateCategoryListAndRecipeUIs();
  if (newSlug !== input.initialSlug) {
    revalidatePath(`/categories/${input.initialSlug}/edit`);
  }

  return { success: true, slug: newSlug };
}

export async function deleteCategory(slug: string): Promise<DeleteCategoryResult> {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!category) {
    return { success: false, error: "Category not found." };
  }

  const recipeSlugs = await prisma.recipe.findMany({
    where: {
      categories: { some: { categoryId: category.id } },
    },
    select: { slug: true },
  });

  await prisma.category.delete({ where: { id: category.id } });

  for (const r of recipeSlugs) {
    revalidatePath(`/recipes/${r.slug}`);
  }
  await revalidateCategoryListAndRecipeUIs();

  return { success: true };
}
