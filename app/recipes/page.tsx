import Link from "next/link";
import { Suspense } from "react";

import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeFilters } from "@/components/recipes/recipe-filters";
import { getCategories, getRecipes } from "@/lib/recipes";
import { normalizeQueryParam } from "@/lib/url-search-params";

function FiltersFallback() {
  return (
    <div
      className="h-24 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100"
      aria-hidden
    />
  );
}

export default async function RecipesPage(props: PageProps<"/recipes">) {
  const sp = await props.searchParams;
  const search = normalizeQueryParam(sp["search"]);
  const category = normalizeQueryParam(sp["category"]);

  const [recipes, categories] = await Promise.all([
    getRecipes({ search: search || null, categorySlug: category || null }),
    getCategories(),
  ]);

  const filterKey = `${search}|${category}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link
          href="/recipes/new"
          className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          Add recipe
        </Link>
      </div>

      <Suspense fallback={<FiltersFallback />}>
        <RecipeFilters
          key={filterKey}
          categories={categories}
          defaultSearch={search}
        />
      </Suspense>

      {recipes.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-700">
          <p className="m-0 font-medium text-zinc-900">No recipes found</p>
          <p className="mt-1 mb-0">
            No recipes match the selected filters. Try changing the search or
            category, or{" "}
            <Link href="/recipes" className="underline">
              clear filters
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="space-y-4 list-none p-0 m-0">
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
      )}
    </main>
  );
}
