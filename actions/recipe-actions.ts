"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
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

function trimLines(lines: string[]): string[] {
  return lines.map((l) => l.trim()).filter((l) => l.length > 0);
}

async function resolveUniqueRecipeSlug(baseSlug: string): Promise<string> {
  let candidate = baseSlug;
  let n = 2;
  for (;;) {
    const taken = await prisma.recipe.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
    candidate = `${baseSlug}-${n}`;
    n += 1;
  }
}

export async function createRecipe(
  input: CreateRecipeInput,
): Promise<CreateRecipeResult> {
  const title = input.title.trim();
  if (!title) {
    return { success: false, error: "Title is required." };
  }

  const ingredientLines = trimLines(input.ingredientLines);
  if (ingredientLines.length === 0) {
    return {
      success: false,
      error: "Add at least one ingredient line with text.",
    };
  }

  const instructionSteps = trimLines(input.instructionSteps);
  if (instructionSteps.length === 0) {
    return {
      success: false,
      error: "Add at least one instruction step with text.",
    };
  }

  let cookingTime: number | null = null;
  if (input.cookingTime !== undefined && input.cookingTime !== null) {
    const t = Number(input.cookingTime);
    if (!Number.isFinite(t) || !Number.isInteger(t) || t < 0) {
      return {
        success: false,
        error: "Cooking time must be a whole number of minutes (0 or more).",
      };
    }
    cookingTime = t;
  }

  const categoryIds = [...new Set(input.categoryIds)];
  if (categoryIds.length > 0) {
    const found = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });
    if (found.length !== categoryIds.length) {
      return {
        success: false,
        error: "One or more selected categories are invalid.",
      };
    }
  }

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
