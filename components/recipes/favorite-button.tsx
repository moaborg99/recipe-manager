"use client";

import { useCallback, useSyncExternalStore } from "react";

import { HeartToggleIcon } from "@/components/ui/heart-toggle-icon";
import { cn } from "@/components/ui/cn";
import {
  dispatchFavoritesChanged,
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  isFavoriteSlug,
  toggleFavoriteSlug,
} from "@/lib/favorites";

type FavoriteButtonProps = {
  slug: string;
  className?: string;
};

export function FavoriteButton({ slug, className }: FavoriteButtonProps) {
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
      onClick={(e) => {
        e.stopPropagation();
        toggleFavoriteSlug(slug);
        dispatchFavoritesChanged();
      }}
      aria-pressed={favorited}
      title={favorited ? "Remove from saved recipes" : "Save recipe"}
      className={cn(
        "inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full border px-2.5 text-sm font-medium shadow-sm transition-all duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        "focus-visible:z-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        favorited
          ? "border-destructive bg-destructive text-text-on-dark hover:bg-destructive/90"
          : "border-input-border bg-surface/95 text-text-on-light backdrop-blur-sm hover:bg-surface",
        className,
      )}
    >
      <HeartToggleIcon filled={favorited} size={18} />
      <span className="sr-only">
        {favorited ? "Saved recipe" : "Save recipe"}
      </span>
    </button>
  );
}
