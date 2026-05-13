import { Clock, Edit } from "@deemlol/next-icons";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { FavoriteButton } from "@/components/recipes/favorite-button";
import { RecipeDetailTabs } from "@/components/recipes/recipe-detail-tabs";
import { Badge } from "@/components/ui/badge";
import { BackLink } from "@/components/ui/back-link";
import { composeButtonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { PageContainer } from "@/components/ui/page-container";
import { getRecipeBySlug } from "@/lib/recipes";

export default async function RecipeDetailPage(
  props: PageProps<"/recipes/[slug]">,
) {
  const { slug } = await props.params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const categoryTitles = recipe.categories.map((rc) => rc.category.title);

  return (
    <PageContainer
      as="main"
      maxWidthClass="max-w-6xl"
      className="space-y-6 sm:space-y-8"
    >
      <BackLink href="/recipes">Back to recipes</BackLink>

      <div className="grid gap-6 md:grid-cols-2 md:items-stretch md:gap-8 lg:gap-10">
        <Card
          padding="none"
          className="flex min-h-0 flex-col overflow-hidden rounded-xl border-0 shadow-md md:h-full"
        >
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-xl bg-accent/10">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                loading="eager"
                decoding="async"
                className="absolute inset-0 block h-full w-full object-cover"
              />
            ) : null}
            <div className="pointer-events-auto absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
              <FavoriteButton slug={slug} className="shadow-md" />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
            <h1 className="m-0 text-2xl font-bold leading-tight tracking-tight text-text-on-light sm:text-3xl">
              {recipe.title}
            </h1>

            {recipe.description ? (
              <p className="m-0 text-base leading-relaxed text-muted-text sm:text-lg">
                {recipe.description}
              </p>
            ) : null}

            {recipe.cookingTime != null ? (
              <dl className="m-0 text-sm sm:text-base">
                <div className="flex shrink-0 items-center gap-1.5 text-text-on-light">
                  <dt className="sr-only">Cooking time</dt>
                  <Clock
                    aria-hidden
                    size={20}
                    className="shrink-0 text-muted-text"
                  />
                  <dd className="m-0 text-muted-text">
                    {recipe.cookingTime} min
                  </dd>
                </div>
              </dl>
            ) : null}

            {categoryTitles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categoryTitles.map((title) => (
                  <Badge
                    key={title}
                    variant="default"
                    className="px-3.5 py-1.5 text-sm sm:px-4 sm:py-2"
                  >
                    {title}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="flex w-full gap-2 sm:gap-3">
              <Link
                href={`/recipes/${slug}/edit`}
                className={cn(
                  composeButtonClassName("primary"),
                  "min-w-0 flex-1 justify-center gap-2 text-center no-underline",
                )}
              >
                Edit recipe
                <Edit
                  aria-hidden
                  size={18}
                  strokeWidth={2}
                  className="shrink-0 text-current"
                />
              </Link>
              <DeleteRecipeButton
                slug={slug}
                className="min-w-0 flex-1"
                buttonClassName="w-full"
              />
            </div>
          </div>
        </Card>

        <div className="min-w-0 md:flex md:h-full md:min-h-0 md:flex-col">
          <RecipeDetailTabs
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
          />
        </div>
      </div>
    </PageContainer>
  );
}
