"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  dispatchFavoritesChanged,
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  isFavoriteSlug,
  toggleFavoriteSlug,
} from "@/lib/favorites";

type FavoriteButtonProps = {
  slug: string;
};

export function FavoriteButton({ slug }: FavoriteButtonProps) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const onCustom = () => onStoreChange();
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY || e.key === null) {
        onStoreChange();
      }
    };
    window.addEventListener(FAVORITES_CHANGED_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const favorited = useSyncExternalStore(
    subscribe,
    () => isFavoriteSlug(slug),
    () => false,
  );

  return (
    <button
      type="button"
      onClick={() => {
        toggleFavoriteSlug(slug);
        dispatchFavoritesChanged();
      }}
      aria-pressed={favorited}
      title={favorited ? "Remove from saved recipes" : "Save recipe"}
      className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded border border-zinc-300 bg-white px-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 aria-pressed:border-amber-600 aria-pressed:bg-amber-50 aria-pressed:text-amber-900"
    >
      <span aria-hidden className="select-none">
        {favorited ? "★" : "☆"}
      </span>
      <span className="sr-only">
        {favorited ? "Saved recipe" : "Save recipe"}
      </span>
    </button>
  );
}
