"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { getFavoriteRecipesBySlugs } from "@/actions/favorite-actions";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeGrid, RecipeGridItem } from "@/components/recipes/recipe-grid";
import { cn } from "@/components/ui/cn";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import {
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  getFavoriteSlugs,
} from "@/lib/favorites";
import type { RecipeWithCategories } from "@/lib/recipes";

const browseRecipesLinkClass = cn(
  "inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "border border-subtle-border bg-surface text-text-on-light hover:bg-accent/15",
);

function savedCountDescription(count: number): string {
  if (count === 1) return "1 recipe saved";
  return `${count} recipes saved`;
}

export function FavoritesClient() {
  const [recipes, setRecipes] = useState<RecipeWithCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [missingFromCatalog, setMissingFromCatalog] = useState(false);

  const load = useCallback(async () => {
    const slugs = getFavoriteSlugs();
    if (slugs.length === 0) {
      setRecipes([]);
      setMissingFromCatalog(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getFavoriteRecipesBySlugs(slugs);
      setRecipes(data);
      setMissingFromCatalog(slugs.length > 0 && data.length === 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      void load();
    });
    return () => window.cancelAnimationFrame(id);
  }, [load]);

  useEffect(() => {
    const onCustom = () => void load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY || e.key === null) {
        void load();
      }
    };
    window.addEventListener(FAVORITES_CHANGED_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [load]);

  const countDescription = loading
    ? "Loading saved recipes…"
    : savedCountDescription(recipes.length);

  return (
    <div className="space-y-8">
      <PageHeader size="lg" title="Favorites" description={countDescription} />

      {loading ? (
        <div
          className="h-28 w-full animate-pulse rounded-lg bg-white/15 sm:h-32"
          aria-busy="true"
          aria-label="Loading saved recipes"
        />
      ) : recipes.length === 0 ? (
        missingFromCatalog ? (
          <EmptyState
            title="Saved recipes not found"
            description={
              <span>
                Nothing in the database matched your saved slugs. The recipes may
                have been removed.{" "}
                <Link href="/recipes" className={browseRecipesLinkClass}>
                  Browse recipes
                </Link>
                .
              </span>
            }
          />
        ) : (
          <EmptyState
            title="No saved recipes yet"
            description={
              <span>
                Browse{" "}
                <Link href="/recipes" className={browseRecipesLinkClass}>
                  all recipes
                </Link>{" "}
                and tap the heart to save them here.
              </span>
            }
          />
        )
      ) : (
        <RecipeGrid>
          {recipes.map((recipe) => (
            <RecipeGridItem key={recipe.id}>
              <RecipeCard
                slug={recipe.slug}
                title={recipe.title}
                description={recipe.description}
                imageUrl={recipe.imageUrl}
                cookingTime={recipe.cookingTime}
                categoryTitles={recipe.categories.map((rc) => rc.category.title)}
              />
            </RecipeGridItem>
          ))}
        </RecipeGrid>
      )}
    </div>
  );
}
