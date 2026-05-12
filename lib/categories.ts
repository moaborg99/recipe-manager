import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, slug: true },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: { id: true, title: true, slug: true },
  });
}

export type CategoryOption = Awaited<ReturnType<typeof getCategories>>[number];
