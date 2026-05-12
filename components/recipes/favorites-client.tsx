"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { getFavoriteRecipesBySlugs } from "@/actions/favorite-actions";
import { RecipeCard } from "@/components/recipes/recipe-card";
import {
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  getFavoriteSlugs,
} from "@/lib/favorites";
import type { RecipeWithCategories } from "@/lib/recipes";

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

  if (loading) {
    return (
      <div
        className="h-32 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100"
        aria-busy
        aria-label="Loading saved recipes"
      />
    );
  }

  if (recipes.length === 0) {
    if (missingFromCatalog) {
      return (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-700">
          <p className="m-0 font-medium text-zinc-900">
            Saved recipes not found
          </p>
          <p className="mt-2 mb-0">
            Nothing in the database matched your saved slugs. The recipes may
            have been removed.{" "}
            <Link href="/recipes" className="underline">
              Browse recipes
            </Link>
            .
          </p>
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-700">
        <p className="m-0 font-medium text-zinc-900">No saved recipes yet.</p>
        <p className="mt-2 mb-0">
          Browse{" "}
          <Link href="/recipes" className="underline">
            all recipes
          </Link>{" "}
          and tap the star to save them here.
        </p>
      </div>
    );
  }

  return (
    <ul className="m-0 list-none space-y-4 p-0">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <RecipeCard
            slug={recipe.slug}
            title={recipe.title}
            description={recipe.description}
            imageUrl={recipe.imageUrl}
            cookingTime={recipe.cookingTime}
            categoryTitles={recipe.categories.map((rc) => rc.category.title)}
          />
        </li>
      ))}
    </ul>
  );
}
