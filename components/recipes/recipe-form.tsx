"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createRecipe } from "@/actions/recipe-actions";

import { CategorySelector, type CategorySelectorItem } from "./category-selector";
import { IngredientFields } from "./ingredient-fields";
import { InstructionFields } from "./instruction-fields";

type RecipeFormProps = {
  categories: CategorySelectorItem[];
};

type FieldKey =
  | "title"
  | "cookingTime"
  | "ingredients"
  | "instructions"
  | "categories"
  | "general";

type FieldErrorsState = Partial<Record<FieldKey, string>>;

function trimNonEmptyLines(lines: string[]): string[] {
  return lines.map((l) => l.trim()).filter((l) => l.length > 0);
}

function validateClientFields(input: {
  title: string;
  ingredientLines: string[];
  instructionSteps: string[];
  cookingTimeRaw: string;
}): FieldErrorsState {
  const errors: FieldErrorsState = {};
  if (!input.title.trim()) {
    errors.title = "Title is required.";
  }
  if (trimNonEmptyLines(input.ingredientLines).length === 0) {
    errors.ingredients = "Add at least one ingredient line with text.";
  }
  if (trimNonEmptyLines(input.instructionSteps).length === 0) {
    errors.instructions = "Add at least one instruction step with text.";
  }
  const raw = input.cookingTimeRaw.trim();
  if (raw.length > 0) {
    const n = Number(raw);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
      errors.cookingTime =
        "Cooking time must be a whole number of minutes (0 or more), or leave blank.";
    }
  }
  return errors;
}

function mapServerErrorToFields(message: string): FieldErrorsState {
  const msg = message.trim();
  if (msg === "Title is required.") return { title: msg };
  if (msg === "Add at least one ingredient line with text.") {
    return { ingredients: msg };
  }
  if (msg === "Add at least one instruction step with text.") {
    return { instructions: msg };
  }
  if (msg.startsWith("Cooking time must")) {
    return { cookingTime: msg };
  }
  if (msg.includes("categories are invalid")) {
    return { categories: msg };
  }
  return { general: msg };
}

export function RecipeForm({ categories }: RecipeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [cookingTimeRaw, setCookingTimeRaw] = useState("");
  const [ingredientLines, setIngredientLines] = useState<string[]>([""]);
  const [instructionSteps, setInstructionSteps] = useState<string[]>([""]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorsState>({});

  function clearFieldError(...keys: FieldKey[]) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const k of keys) {
        delete next[k];
      }
      return next;
    });
  }

  function updateIngredient(index: number, value: string) {
    setIngredientLines((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    clearFieldError("ingredients", "general");
  }

  function addIngredient() {
    setIngredientLines((prev) => [...prev, ""]);
    clearFieldError("ingredients", "general");
  }

  function removeIngredient(index: number) {
    setIngredientLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
    clearFieldError("ingredients", "general");
  }

  function updateInstruction(index: number, value: string) {
    setInstructionSteps((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    clearFieldError("instructions", "general");
  }

  function addInstruction() {
    setInstructionSteps((prev) => [...prev, ""]);
    clearFieldError("instructions", "general");
  }

  function removeInstruction(index: number) {
    setInstructionSteps((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
    clearFieldError("instructions", "general");
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    clearFieldError("categories", "general");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const clientErrors = validateClientFields({
      title,
      ingredientLines,
      instructionSteps,
      cookingTimeRaw,
    });
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    const cookingTrim = cookingTimeRaw.trim();
    const cookingTime =
      cookingTrim.length === 0 ? null : Number.parseInt(cookingTrim, 10);

    startTransition(async () => {
      const result = await createRecipe({
        title,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        cookingTime,
        ingredientLines,
        instructionSteps,
        categoryIds: selectedCategoryIds,
      });

      if (!result.success) {
        setFieldErrors(mapServerErrorToFields(result.error));
        return;
      }

      router.push(`/recipes/${result.slug}`);
      router.refresh();
    });
  }

  const inputErrorClass = "border-red-400 ring-1 ring-red-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-1">
        <label htmlFor="recipe-title" className="text-sm font-medium">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="recipe-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            clearFieldError("title", "general");
          }}
          aria-invalid={fieldErrors.title ? true : undefined}
          aria-describedby={fieldErrors.title ? "recipe-title-error" : undefined}
          className={`w-full rounded border px-2 py-1.5 text-sm ${
            fieldErrors.title ? inputErrorClass : "border-zinc-300"
          }`}
          placeholder="Recipe name"
        />
        {fieldErrors.title ? (
          <p id="recipe-title-error" className="m-0 text-sm text-red-800" role="alert">
            {fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="recipe-description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="recipe-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
          placeholder="Short summary (optional)"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="recipe-image" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="recipe-image"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
          placeholder="https://…"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="recipe-time" className="text-sm font-medium">
          Cooking time (minutes)
        </label>
        <input
          id="recipe-time"
          type="number"
          min={0}
          step={1}
          value={cookingTimeRaw}
          onChange={(e) => {
            setCookingTimeRaw(e.target.value);
            clearFieldError("cookingTime", "general");
          }}
          aria-invalid={fieldErrors.cookingTime ? true : undefined}
          aria-describedby={
            fieldErrors.cookingTime ? "recipe-time-error" : undefined
          }
          className={`w-40 rounded border px-2 py-1.5 text-sm ${
            fieldErrors.cookingTime ? inputErrorClass : "border-zinc-300"
          }`}
          placeholder="Optional"
        />
        {fieldErrors.cookingTime ? (
          <p id="recipe-time-error" className="m-0 text-sm text-red-800" role="alert">
            {fieldErrors.cookingTime}
          </p>
        ) : null}
      </div>

      <IngredientFields
        lines={ingredientLines}
        onChange={updateIngredient}
        onAdd={addIngredient}
        onRemove={removeIngredient}
        error={fieldErrors.ingredients}
      />

      <InstructionFields
        steps={instructionSteps}
        onChange={updateInstruction}
        onAdd={addInstruction}
        onRemove={removeInstruction}
        error={fieldErrors.instructions}
      />

      <CategorySelector
        categories={categories}
        selectedIds={selectedCategoryIds}
        onToggle={toggleCategory}
        error={fieldErrors.categories}
      />

      {fieldErrors.general ? (
        <p
          className="m-0 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {fieldErrors.general}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Create recipe"}
        </button>
      </div>
    </form>
  );
}
