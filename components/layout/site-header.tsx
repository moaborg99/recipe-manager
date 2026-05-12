"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";

import { HeartToggleIcon } from "@/components/ui/heart-toggle-icon";
import { cn } from "@/components/ui/cn";
import {
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  getFavoriteSlugs,
} from "@/lib/favorites";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const navLinkClass =
  "rounded-sm px-2 py-1.5 text-sm font-medium text-text-on-dark/80 transition-colors  hover:text-text-on-dark sm:px-2.5 sm:text-[0.9375rem]";

function useFavoriteCount() {
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

  return useSyncExternalStore(
    subscribe,
    () => getFavoriteSlugs().length,
    () => 0,
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const savedCount = useFavoriteCount();

  const recipesActive =
    pathname === "/recipes" || pathname.startsWith("/recipes/");
  const categoriesActive =
    pathname === "/categories" || pathname.startsWith("/categories/");
  const favoritesActive =
    pathname === "/favorites" || pathname.startsWith("/favorites/");

  const hasSaved = savedCount > 0;

  return (
    <header className="shrink-0 border-b border-white/10 bg-header">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4">
        <Link
          href="/recipes"
          className={cn(
            "shrink-0 text-base font-semibold leading-none tracking-tight text-text-on-dark transition-opacity hover:opacity-90 sm:text-lg",
            focusRing,
          )}
        >
          Recipes
        </Link>

        <nav
          className="flex min-w-0 flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Main"
        >
          <Link
            href="/recipes"
            className={cn(navLinkClass, focusRing)}
            aria-current={recipesActive ? "page" : undefined}
          >
            Recipes
          </Link>
          <Link
            href="/categories"
            className={cn(navLinkClass, focusRing)}
            aria-current={categoriesActive ? "page" : undefined}
          >
            Categories
          </Link>
          <Link
            href="/favorites"
            aria-label={
              hasSaved
                ? `Favorites, ${savedCount} saved recipe${savedCount === 1 ? "" : "s"}`
                : "Favorites"
            }
            className={cn(
              navLinkClass,
              focusRing,
              "inline-flex min-h-10 items-center justify-center gap-2 px-2 py-2 sm:min-h-11 sm:px-2.5",
            )}
            aria-current={favoritesActive ? "page" : undefined}
          >
            <HeartToggleIcon filled={hasSaved} size={22} className="text-text-on-dark" />
            {hasSaved ? (
              <span
                className="min-w-[1.25rem] px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums text-text-on-dark"
                aria-hidden
              >
                {savedCount}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
