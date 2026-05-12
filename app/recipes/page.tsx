import Link from "next/link";
import { Suspense } from "react";

import { RecipeCard } from "@/components/recipes/recipe-card";
import { RecipeFilters } from "@/components/recipes/recipe-filters";
import { cn } from "@/components/ui/cn";
import { EmptyState } from "@/components/ui/empty-state";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { getCategories, getRecipes } from "@/lib/recipes";
import { normalizeQueryParam } from "@/lib/url-search-params";

function FiltersFallback() {
  return (
    <div
      className="h-28 w-full animate-pulse rounded-lg bg-white/15 sm:h-32"
      aria-hidden
    />
  );
}

const createRecipeCtaClass = cn(
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "border border-subtle-border bg-accent text-header hover:opacity-90",
);

const clearFiltersActionClass = cn(
  "inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "border border-subtle-border bg-surface text-text-on-light hover:bg-accent/15",
);

export default async function RecipesPage(props: PageProps<"/recipes">) {
  const sp = await props.searchParams;
  const search = normalizeQueryParam(sp["search"]);
  const category = normalizeQueryParam(sp["category"]);

  const [recipes, categories] = await Promise.all([
    getRecipes({ search: search || null, categorySlug: category || null }),
    getCategories(),
  ]);

  const filterKey = `${search}|${category}`;
  const subtitle =
    recipes.length === 1 ? "1 recipe" : `${recipes.length} recipes`;

  return (
    <PageContainer as="main" maxWidthClass="max-w-6xl" className="space-y-8">
      <PageHeader
        size="lg"
        title="Discover Recipes"
        description={subtitle}
        actions={
          <Link href="/recipes/new" className={createRecipeCtaClass}>
            Create recipe +
          </Link>
        }
      />

      <Suspense fallback={<FiltersFallback />}>
        <RecipeFilters
          key={filterKey}
          categories={categories}
          defaultSearch={search}
        />
      </Suspense>

      {recipes.length === 0 ? (
        <EmptyState
          title="No recipes found"
          description="No recipes match the selected filters. Try changing the search or category."
          action={
            <Link href="/recipes" className={clearFiltersActionClass}>
              Clear filters
            </Link>
          }
        />
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="h-full min-w-0">
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
    </PageContainer>
  );
}
