"use client";

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
      className={`space-y-2 rounded-lg border p-4 ${
        error ? "border-red-400 bg-red-50/40" : "border-zinc-200"
      }`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? "recipe-instructions-error" : undefined}
    >
      <legend className="text-sm font-medium px-1">Instructions</legend>
      {error ? (
        <p
          id="recipe-instructions-error"
          className="m-0 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <ol className="space-y-2 m-0 p-0 list-decimal list-inside">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-2 items-start list-none">
            <span className="text-sm text-zinc-500 w-6 shrink-0 pt-1.5">
              {index + 1}.
            </span>
            <div className="flex-1 flex gap-2">
              <label className="sr-only" htmlFor={`instruction-${index}`}>
                Step {index + 1}
              </label>
              <textarea
                id={`instruction-${index}`}
                value={step}
                onChange={(e) => onChange(index, e.target.value)}
                rows={2}
                className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
                placeholder="Describe this step…"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={steps.length <= 1}
                className="shrink-0 self-start rounded border border-zinc-300 px-2 py-1 text-sm disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onAdd}
        className="rounded border border-zinc-400 bg-zinc-50 px-3 py-1.5 text-sm"
      >
        Add step
      </button>
    </fieldset>
  );
}
