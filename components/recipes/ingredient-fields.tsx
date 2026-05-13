"use client";

import { Trash2 } from "@deemlol/next-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const rowControlClass =
  "min-h-11 rounded-lg border border-input-border px-3 py-2.5 text-base leading-snug text-text-on-light sm:text-sm";

const sectionLegendClass =
  "block px-0 text-sm font-medium leading-snug text-text-on-light";

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
      className="m-0 min-w-0 border-0 p-0"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? "recipe-ingredients-error" : undefined}
    >
      <legend className={sectionLegendClass}>
        Ingredients <span className="text-destructive">*</span>
      </legend>
      <div className="mt-1.5 space-y-1.5">
        {error ? (
          <p
            id="recipe-ingredients-error"
            className="m-0 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <ul className="m-0 list-none space-y-2 p-0">
          {lines.map((line, index) => (
            <li key={index} className="flex min-w-0 items-start gap-2">
              <label className="sr-only" htmlFor={`ingredient-${index}`}>
                Ingredient {index + 1}
              </label>
              <div className="min-w-0 flex-1">
                <Input
                  id={`ingredient-${index}`}
                  type="text"
                  value={line}
                  onChange={(e) => onChange(index, e.target.value)}
                  placeholder="e.g. Rolled oats: 80 g"
                  className={rowControlClass}
                />
              </div>
              {lines.length > 1 ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ingredient ${index + 1}`}
                  className="shrink-0 self-start min-h-10 min-w-10 p-0"
                >
                  <Trash2
                    aria-hidden
                    size={18}
                    strokeWidth={2}
                    className="shrink-0 text-current"
                  />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="accent"
          onClick={onAdd}
          className="mt-4 mb-6 inline-flex items-center gap-1.5 px-3 py-2 text-sm"
        >
          <span aria-hidden className="text-base font-semibold leading-none">
            +
          </span>
          Add ingredient
        </Button>
      </div>
    </fieldset>
  );
}
