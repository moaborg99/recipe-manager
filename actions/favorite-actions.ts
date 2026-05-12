"use server";

import { getRecipesBySlugs } from "@/lib/recipes";

const MAX_SLUGS = 200;

export async function getFavoriteRecipesBySlugs(slugs: string[]) {
  const unique = [
    ...new Set(
      slugs
        .filter((s): s is string => typeof s === "string")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    ),
  ].slice(0, MAX_SLUGS);

  return getRecipesBySlugs(unique);
}
