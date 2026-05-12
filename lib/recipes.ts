import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type RecipeFiltersInput = {
  search?: string | null;
  categorySlug?: string | null;
};

export async function getRecipes(filters?: RecipeFiltersInput | null) {
  const search = filters?.search?.trim() ?? "";
  const categorySlug = filters?.categorySlug?.trim() ?? "";

  const and: Prisma.RecipeWhereInput[] = [];

  if (search.length > 0) {
    and.push({
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
      ],
    });
  }

  if (categorySlug.length > 0) {
    and.push({
      categories: {
        some: { category: { slug: categorySlug } },
      },
    });
  }

  return prisma.recipe.findMany({
    where: and.length > 0 ? { AND: and } : undefined,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
}

export type RecipeWithCategories = Awaited<ReturnType<typeof getRecipes>>[number];

export async function getRecipeBySlug(slug: string) {
  return prisma.recipe.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
}

export type RecipeDetail = NonNullable<Awaited<ReturnType<typeof getRecipeBySlug>>>;

export {
  getCategories,
  getCategoryBySlug,
  type CategoryOption,
} from "./categories";
