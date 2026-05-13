"use client";

import { cn } from "@/components/ui/cn";

export type CategorySelectorItem = {
  id: string;
  title: string;
  slug: string;
};

type CategorySelectorProps = {
  categories: CategorySelectorItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  error?: string;
};

const sectionLegendClass =
  "block px-0 text-sm font-medium leading-snug text-text-on-light";

function categoryPillClass(checked: boolean) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent sm:px-4 sm:text-sm",
    checked
      ? "border-input-border bg-accent text-header hover:opacity-90"
      : "border-input-border bg-surface text-text-on-light hover:bg-accent/15",
  );
}

export function CategorySelector({
  categories,
  selectedIds,
  onToggle,
  error,
}: CategorySelectorProps) {
  if (categories.length === 0) {
    return (
      <div className="space-y-1.5">
        <p className="m-0 text-sm text-muted-text">
          No categories in the database yet. You can still save the recipe without
          categories.
        </p>
        {error ? (
          <p className="m-0 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <fieldset
      className={cn(
        "m-0 min-w-0 border-0 p-0",
        error && "rounded-lg border border-destructive/35 bg-destructive/5 p-3",
      )}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? "recipe-categories-error" : undefined}
    >
      <legend className={sectionLegendClass}>Categories</legend>
      <div className="mt-1.5 space-y-1.5 pb-4">
        {error ? (
          <p
            id="recipe-categories-error"
            className="m-0 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <p className="m-0 pb-2 text-xs text-muted-text">
          Optional — select any that apply.
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {categories.map((c) => {
            const checked = selectedIds.includes(c.id);
            return (
              <li key={c.id}>
                <label className={categoryPillClass(checked)}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(c.id)}
                    className="sr-only"
                  />
                  <span>{c.title}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </fieldset>
  );
}
