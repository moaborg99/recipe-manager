import Link from "next/link";

import { FavoriteButton } from "@/components/recipes/favorite-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";

type RecipeCardProps = {
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  cookingTime: number | null;
  categoryTitles: string[];
};

const visibleCategories = 2;

export function RecipeCard({
  slug,
  title,
  description,
  imageUrl,
  cookingTime,
  categoryTitles,
}: RecipeCardProps) {
  const badges = categoryTitles.slice(0, visibleCategories);

  return (
    <Card
      padding="none"
      className={cn(
        "group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-xl border-0 bg-surface",
        "shadow-sm transition-shadow duration-300 ease-out hover:shadow-md",
      )}
    >
      <div className="relative z-0 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-xl bg-surface">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 block h-full w-full object-cover transition-transform duration-300 ease-out [transform-origin:center] group-hover:scale-[1.04]"
          />
        ) : null}
      </div>

      <div className="relative z-0 flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <h2
          id={`recipe-card-title-${slug}`}
          className="truncate text-lg font-bold leading-tight tracking-tight text-text-on-light"
        >
          {title}
        </h2>

        {description ? (
          <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-muted-text">
            {description}
          </p>
        ) : (
          <div className="mt-2 min-h-[2.75rem]" aria-hidden />
        )}

        {(cookingTime != null || badges.length > 0) ? (
          <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-3 sm:gap-y-2">
            <div className="min-w-0 sm:flex-1">
              {cookingTime != null ? (
                <p className="m-0 flex min-w-0 items-center gap-1.5 text-sm text-muted-text">
                  <span aria-hidden className="shrink-0 text-muted-text">
                    ◷
                  </span>
                  <span className="truncate">{cookingTime} min</span>
                </p>
              ) : null}
            </div>
            {badges.length > 0 ? (
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:flex-none sm:justify-end">
                {badges.map((t, i) => (
                  <Badge key={`${slug}-${i}-${t}`} variant="default">
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <Link
        href={`/recipes/${slug}`}
        className="absolute inset-0 z-10 rounded-[inherit] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        aria-label={`View recipe: ${title}`}
      />
      <div className="pointer-events-auto absolute right-2.5 top-2.5 z-20 sm:right-3 sm:top-3">
        <FavoriteButton slug={slug} />
      </div>
    </Card>
  );
}
