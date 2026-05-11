import { prisma } from "@/lib/prisma";

export async function getRecipes() {
  return prisma.recipe.findMany({
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
