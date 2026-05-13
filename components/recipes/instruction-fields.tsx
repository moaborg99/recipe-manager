"use client";

import { Trash2 } from "@deemlol/next-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { Textarea } from "@/components/ui/textarea";

const rowControlClass =
  "min-h-11 rounded-lg border border-input-border px-3 py-2.5 text-base leading-snug text-text-on-light sm:text-sm";

const sectionLegendClass =
  "block px-0 text-sm font-medium leading-snug text-text-on-light";

type InstructionFieldsProps = {
  steps: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  error?: string;
};

export function InstructionFields({
  steps,
  onChange,
  onAdd,
  onRemove,
  error,
}: InstructionFieldsProps) {
  return (
    <fieldset
      className="m-0 min-w-0 border-0 p-0"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? "recipe-instructions-error" : undefined}
    >
      <legend className={sectionLegendClass}>
        Instructions <span className="text-destructive">*</span>
      </legend>
      <div className="mt-1.5 space-y-1.5">
        {error ? (
          <p
            id="recipe-instructions-error"
            className="m-0 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <ol className="m-0 list-none space-y-2 p-0">
          {steps.map((step, index) => (
            <li key={index} className="flex min-w-0 items-start gap-3">
              <span
                className="w-8 shrink-0 pt-2.5 text-right text-sm font-semibold tabular-nums text-text-on-light"
                aria-hidden
              >
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <label className="sr-only" htmlFor={`instruction-${index}`}>
                  Step {index + 1}
                </label>
                <div className="min-w-0 flex-1">
                  <Textarea
                    id={`instruction-${index}`}
                    value={step}
                    onChange={(e) => onChange(index, e.target.value)}
                    rows={3}
                    placeholder="Describe this step…"
                    className={cn(rowControlClass, "resize-y")}
                  />
                </div>
                {steps.length > 1 ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => onRemove(index)}
                    aria-label={`Remove step ${index + 1}`}
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
              </div>
            </li>
          ))}
        </ol>
        <Button
          type="button"
          variant="accent"
          onClick={onAdd}
          className="mt-4 mb-8 inline-flex items-center gap-1.5 px-3 py-2 text-sm"
        >
          <span aria-hidden className="text-base font-semibold leading-none">
            +
          </span>
          Add step
        </Button>
      </div>
    </fieldset>
  );
}
