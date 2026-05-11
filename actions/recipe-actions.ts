"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  trimRecipeLines,
  validateCookingTimeNumber,
  validateIngredientLines,
  validateInstructionSteps,
  validateTitle,
} from "@/lib/recipe-validation";
import { slugify } from "@/lib/slugify";

export type CreateRecipeInput = {
  title: string;
  description?: string;
  imageUrl?: string;
  cookingTime?: number | null;
  ingredientLines: string[];
  instructionSteps: string[];
  categoryIds: string[];
};

export type CreateRecipeResult =
  | { success: true; slug: string }
  | { success: false; error: string };

export type UpdateRecipeInput = CreateRecipeInput & {
  initialSlug: string;
};

export type UpdateRecipeResult = CreateRecipeResult;

export type DeleteRecipeResult =
  | { success: true }
  | { success: false; error: string };

async function slugTakenByOtherRecipe(
  slug: string,
  excludeRecipeId?: string,
): Promise<boolean> {
  const row = await prisma.recipe.findFirst({
    where: {
      slug,
      ...(excludeRecipeId ? { NOT: { id: excludeRecipeId } } : {}),
    },
    select: { id: true },
  });
  return row !== null;
}

async function resolveUniqueRecipeSlug(
  baseSlug: string,
  excludeRecipeId?: string,
): Promise<string> {
  let candidate = baseSlug;
  let n = 2;
  for (;;) {
    const taken = await slugTakenByOtherRecipe(candidate, excludeRecipeId);
    if (!taken) return candidate;
    candidate = `${baseSlug}-${n}`;
    n += 1;
  }
}

async function validateCategoryIds(categoryIds: string[]): Promise<string | null> {
  const unique = [...new Set(categoryIds)];
  if (unique.length === 0) return null;
  const found = await prisma.category.findMany({
    where: { id: { in: unique } },
    select: { id: true },
  });
  if (found.length !== unique.length) {
    return "One or more selected categories are invalid.";
  }
  return null;
}

function parseAndValidateRecipeInput(input: {
  title: string;
  ingredientLines: string[];
  instructionSteps: string[];
  cookingTime: number | null | undefined;
}):
  | {
      ok: true;
      title: string;
      ingredientLines: string[];
      instructionSteps: string[];
      cookingTime: number | null;
    }
  | { ok: false; error: string } {
  const tErr = validateTitle(input.title);
  if (tErr) return { ok: false, error: tErr };

  const ingErr = validateIngredientLines(input.ingredientLines);
  if (ingErr) return { ok: false, error: ingErr };

  const insErr = validateInstructionSteps(input.instructionSteps);
  if (insErr) return { ok: false, error: insErr };

  const ct = validateCookingTimeNumber(input.cookingTime);
  if (!ct.ok) return { ok: false, error: ct.error };

  return {
    ok: true,
    title: input.title.trim(),
    ingredientLines: trimRecipeLines(input.ingredientLines),
    instructionSteps: trimRecipeLines(input.instructionSteps),
    cookingTime: ct.value,
  };
}

export async function createRecipe(
  input: CreateRecipeInput,
): Promise<CreateRecipeResult> {
  const parsed = parseAndValidateRecipeInput({
    title: input.title,
    ingredientLines: input.ingredientLines,
    instructionSteps: input.instructionSteps,
    cookingTime: input.cookingTime,
  });
  if (!parsed.ok) return { success: false, error: parsed.error };

  const { title, ingredientLines, instructionSteps, cookingTime } = parsed;

  const catErr = await validateCategoryIds(input.categoryIds);
  if (catErr) return { success: false, error: catErr };

  const categoryIds = [...new Set(input.categoryIds)];
  const description = input.description?.trim() || null;
  const imageUrl = input.imageUrl?.trim() || null;

  const baseSlug = slugify(title);
  const slug = await resolveUniqueRecipeSlug(baseSlug);

  const ingredients = ingredientLines.join("\n");
  const instructions = instructionSteps.join("\n");

  await prisma.recipe.create({
    data: {
      title,
      slug,
      description,
      imageUrl,
      ingredients,
      instructions,
      cookingTime,
      publishedAt: null,
      ...(categoryIds.length > 0
        ? {
            categories: {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          }
        : {}),
    },
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${slug}`);

  return { success: true, slug };
}

export async function updateRecipe(
  input: UpdateRecipeInput,
): Promise<UpdateRecipeResult> {
  const existing = await prisma.recipe.findUnique({
    where: { slug: input.initialSlug },
    select: { id: true, slug: true },
  });
  if (!existing) {
    return { success: false, error: "Recipe not found." };
  }

  const parsed = parseAndValidateRecipeInput({
    title: input.title,
    ingredientLines: input.ingredientLines,
    instructionSteps: input.instructionSteps,
    cookingTime: input.cookingTime,
  });
  if (!parsed.ok) return { success: false, error: parsed.error };

  const { title, ingredientLines, instructionSteps, cookingTime } = parsed;

  const catErr = await validateCategoryIds(input.categoryIds);
  if (catErr) return { success: false, error: catErr };

  const categoryIds = [...new Set(input.categoryIds)];
  const description = input.description?.trim() || null;
  const imageUrl = input.imageUrl?.trim() || null;

  const baseFromTitle = slugify(title);
  const newSlug =
    baseFromTitle === existing.slug
      ? existing.slug
      : await resolveUniqueRecipeSlug(baseFromTitle, existing.id);

  const ingredients = ingredientLines.join("\n");
  const instructions = instructionSteps.join("\n");

  await prisma.recipe.update({
    where: { id: existing.id },
    data: {
      title,
      slug: newSlug,
      description,
      imageUrl,
      ingredients,
      instructions,
      cookingTime,
      categories: {
        deleteMany: {},
        ...(categoryIds.length > 0
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : {}),
      },
    },
  });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${newSlug}`);
  if (newSlug !== input.initialSlug) {
    revalidatePath(`/recipes/${input.initialSlug}`);
  }

  return { success: true, slug: newSlug };
}

export async function deleteRecipe(slug: string): Promise<DeleteRecipeResult> {
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!recipe) {
    return { success: false, error: "Recipe not found." };
  }

  await prisma.recipe.delete({ where: { id: recipe.id } });

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${slug}`);

  return { success: true };
}
