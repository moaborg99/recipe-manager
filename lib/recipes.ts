import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type RecipeFiltersInput = {
  search?: string | null;
  categorySlug?: string | null;
};

const recipeListInclude = {
  categories: {
    include: {
      category: true,
    },
  },
} satisfies Prisma.RecipeInclude;

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
    include: recipeListInclude,
  });
}

export type RecipeWithCategories = Awaited<ReturnType<typeof getRecipes>>[number];

export async function getRecipesBySlugs(slugs: string[]) {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter((s) => s.length > 0))];
  if (unique.length === 0) {
    return [];
  }

  const recipes = await prisma.recipe.findMany({
    where: { slug: { in: unique } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: recipeListInclude,
  });

  const order = new Map(unique.map((slug, index) => [slug, index]));
  return [...recipes].sort(
    (a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0),
  );
}

export async function getRecipeBySlug(slug: string) {
  return prisma.recipe.findUnique({
    where: { slug },
    include: recipeListInclude,
  });
}

export type RecipeDetail = NonNullable<Awaited<ReturnType<typeof getRecipeBySlug>>>;

export {
  getCategories,
  getCategoryBySlug,
  type CategoryOption,
} from "./categories";
