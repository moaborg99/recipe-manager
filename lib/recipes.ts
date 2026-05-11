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
