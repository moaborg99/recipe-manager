"use client";

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

export function CategorySelector({
  categories,
  selectedIds,
  onToggle,
  error,
}: CategorySelectorProps) {
  if (categories.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-zinc-600 m-0">
          No categories in the database yet. You can still save the recipe without
          categories.
        </p>
        {error ? (
          <p className="m-0 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <fieldset
      className={`space-y-2 rounded-lg border p-4 ${
        error ? "border-red-400 bg-red-50/40" : "border-zinc-200"
      }`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? "recipe-categories-error" : undefined}
    >
      <legend className="text-sm font-medium px-1">Categories</legend>
      {error ? (
        <p
          id="recipe-categories-error"
          className="m-0 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <p className="text-xs text-zinc-500 m-0">
        Optional — select any that apply.
      </p>
      <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
        {categories.map((c) => {
          const checked = selectedIds.includes(c.id);
          return (
            <li key={c.id}>
              <label
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${
                  checked
                    ? "border-zinc-800 bg-zinc-100"
                    : "border-zinc-300 bg-white"
                }`}
              >
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
    </fieldset>
  );
}
