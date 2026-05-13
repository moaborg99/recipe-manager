"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/cn";

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

function categoryPillClass(active: boolean) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center rounded-full border px-3.5 py-2 text-xs font-medium transition-[color,box-shadow,filter] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-4 sm:text-sm",
    active
      ? "border-subtle-border bg-accent text-header hover:brightness-[1.04]"
      : "border-subtle-border bg-surface text-text-on-light hover:shadow-md hover:shadow-black/[0.08] hover:ring-2 hover:ring-white/90",
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-muted-text", className)}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
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
    <div className="space-y-6">
      <div className="relative w-full min-w-0">
        <span
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted-text"
          aria-hidden
        >
          <SearchIcon className="block" />
        </span>
        <Input
          id="recipe-search"
          type="search"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Search recipes..."
          aria-label="Search recipes"
          className="min-h-12 rounded-lg border-subtle-border py-3.5 pl-11 pr-4 text-base leading-snug shadow-sm"
          autoComplete="off"
        />
      </div>

      {categories.length > 0 ? (
        <div className="space-y-5">
          <p className="m-0 mb-2 text-sm font-medium text-text-on-dark sm:text-base">
            Filter by category
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <button
              type="button"
              className={categoryPillClass(categoryFromUrl === "")}
              onClick={() => applyCategory("")}
            >
              All
            </button>
            {categories.map((c) => {
              const active = categoryFromUrl === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  className={categoryPillClass(active)}
                  onClick={() => applyCategory(c.slug)}
                >
                  {c.title}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {hasFilters ? (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-text-on-dark underline underline-offset-2 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
