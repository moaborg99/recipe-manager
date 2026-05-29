"use client";

import { useEffect } from "react";

import { getFavoriteRecipesBySlugs } from "@/actions/favorite-actions";
import {
  dispatchFavoritesChanged,
  getFavoriteSlugs,
  pruneFavoriteSlugsToCatalog,
} from "@/lib/favorites";

/** On load, remove favorite slugs that no longer exist in the catalog (e.g. after a DB reset). */
export function FavoritesCatalogSync() {
  useEffect(() => {
    const slugs = getFavoriteSlugs();
    if (slugs.length === 0) {
      return;
    }

    void (async () => {
      const data = await getFavoriteRecipesBySlugs(slugs);
      if (pruneFavoriteSlugsToCatalog(data.map((recipe) => recipe.slug))) {
        dispatchFavoritesChanged();
      }
    })();
  }, []);

  return null;
}
