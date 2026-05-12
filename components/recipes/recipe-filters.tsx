"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type RecipeFiltersCategory = {
  slug: string;
  title: string;
};

type RecipeFiltersProps = {
  categories: RecipeFiltersCategory[];
  /** Matches `search` query param from the server after navigation. */
  defaultSearch: string;
};

const SEARCH_DEBOUNCE_MS = 400;

function buildUrl(pathname: string, params: URLSearchParams): string {
  const q = params.toString();
  return q ? `${pathname}?${q}` : pathname;
}

export function RecipeFilters({
  categories,
  defaultSearch,
}: RecipeFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryFromUrl = searchParams.get("category") ?? "";

  const [searchDraft, setSearchDraft] = useState(defaultSearch);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = searchDraft.trim();
      const current = (searchParams.get("search") ?? "").trim();
      if (trimmed === current) {
        return;
      }
      const next = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        next.set("search", trimmed);
      } else {
        next.delete("search");
      }
      router.replace(buildUrl(pathname, next), { scroll: false });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchDraft, pathname, router, searchParams]);

  function applyCategory(slug: string) {
    const next = new URLSearchParams(searchParams.toString());
    const trimmed = searchDraft.trim();
    if (trimmed) {
      next.set("search", trimmed);
    } else {
      next.delete("search");
    }
    if (slug) {
      next.set("category", slug);
    } else {
      next.delete("category");
    }
    router.replace(buildUrl(pathname, next), { scroll: false });
  }

  function clearFilters() {
    setSearchDraft("");
    router.replace(pathname, { scroll: false });
  }

  const hasFilters =
    searchDraft.trim().length > 0 || categoryFromUrl.length > 0;

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[12rem] flex-1 space-y-1">
          <label htmlFor="recipe-search" className="text-sm font-medium">
            Search
          </label>
          <input
            id="recipe-search"
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Title or description…"
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="recipe-category-filter" className="text-sm font-medium">
            Category
          </label>
          <select
            id="recipe-category-filter"
            value={categoryFromUrl}
            onChange={(e) => applyCategory(e.target.value)}
            className="min-w-[10rem] rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      {hasFilters ? (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
