"use client";

type IngredientFieldsProps = {
  lines: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  error?: string;
};

export function IngredientFields({
  lines,
  onChange,
  onAdd,
  onRemove,
  error,
}: IngredientFieldsProps) {
  return (
    <fieldset
      className={`space-y-2 rounded-lg border p-4 ${
        error ? "border-red-400 bg-red-50/40" : "border-zinc-200"
      }`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? "recipe-ingredients-error" : undefined}
    >
      <legend className="text-sm font-medium px-1">Ingredients</legend>
      {error ? (
        <p
          id="recipe-ingredients-error"
          className="m-0 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <ul className="space-y-2 list-none m-0 p-0">
        {lines.map((line, index) => (
          <li key={index} className="flex gap-2 items-start">
            <label className="sr-only" htmlFor={`ingredient-${index}`}>
              Ingredient {index + 1}
            </label>
            <input
              id={`ingredient-${index}`}
              type="text"
              value={line}
              onChange={(e) => onChange(index, e.target.value)}
              className="flex-1 rounded border border-zinc-300 px-2 py-1.5 text-sm"
              placeholder="e.g. Rolled oats: 80 g"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={lines.length <= 1}
              className="shrink-0 rounded border border-zinc-300 px-2 py-1 text-sm disabled:opacity-40"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onAdd}
        className="rounded border border-zinc-400 bg-zinc-50 px-3 py-1.5 text-sm"
      >
        Add ingredient line
      </button>
    </fieldset>
  );
}
