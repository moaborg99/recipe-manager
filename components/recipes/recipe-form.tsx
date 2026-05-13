"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { createRecipe, updateRecipe } from "@/actions/recipe-actions";
import {
  validateCookingTimeRaw,
  validateIngredientLines,
  validateInstructionSteps,
  validateTitle,
} from "@/lib/recipe-validation";
import { Button, composeButtonClassName } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/cn";

import { CategorySelector, type CategorySelectorItem } from "./category-selector";
import { IngredientFields } from "./ingredient-fields";
import { InstructionFields } from "./instruction-fields";

export type RecipeFormDefaultValues = {
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number | null;
  ingredientLines: string[];
  instructionSteps: string[];
  categoryIds: string[];
};

type RecipeFormProps = {
  categories: CategorySelectorItem[];
  mode?: "create" | "edit";
  initialSlug?: string;
  defaultValues?: RecipeFormDefaultValues;
};

type FieldKey =
  | "title"
  | "cookingTime"
  | "ingredients"
  | "instructions"
  | "categories"
  | "general";

type FieldErrorsState = Partial<Record<FieldKey, string>>;

function validateClientFields(input: {
  title: string;
  ingredientLines: string[];
  instructionSteps: string[];
  cookingTimeRaw: string;
}): FieldErrorsState {
  const errors: FieldErrorsState = {};
  const titleErr = validateTitle(input.title);
  if (titleErr) errors.title = titleErr;
  const ingErr = validateIngredientLines(input.ingredientLines);
  if (ingErr) errors.ingredients = ingErr;
  const insErr = validateInstructionSteps(input.instructionSteps);
  if (insErr) errors.instructions = insErr;
  const ctErr = validateCookingTimeRaw(input.cookingTimeRaw);
  if (ctErr) errors.cookingTime = ctErr;
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
  if (msg === "Recipe not found.") {
    return { general: msg };
  }
  return { general: msg };
}

function linesOrPlaceholder(lines: string[] | undefined): string[] {
  if (lines && lines.length > 0) return lines;
  return [""];
}

const labelClass =
  "block text-sm font-medium text-text-on-light leading-snug";

export function RecipeForm({
  categories,
  mode = "create",
  initialSlug,
  defaultValues,
}: RecipeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(
    () => defaultValues?.title ?? "",
  );
  const [description, setDescription] = useState(
    () => defaultValues?.description ?? "",
  );
  const [imageUrl, setImageUrl] = useState(() => defaultValues?.imageUrl ?? "");
  const [cookingTimeRaw, setCookingTimeRaw] = useState(() =>
    defaultValues?.cookingTime != null
      ? String(defaultValues.cookingTime)
      : "",
  );
  const [ingredientLines, setIngredientLines] = useState(() =>
    linesOrPlaceholder(defaultValues?.ingredientLines),
  );
  const [instructionSteps, setInstructionSteps] = useState(() =>
    linesOrPlaceholder(defaultValues?.instructionSteps),
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    () => defaultValues?.categoryIds ?? [],
  );
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

    const payload = {
      title,
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      cookingTime,
      ingredientLines,
      instructionSteps,
      categoryIds: selectedCategoryIds,
    };

    startTransition(async () => {
      if (isEdit) {
        if (!initialSlug) {
          setFieldErrors({
            general: "Missing recipe slug. Reload the page and try again.",
          });
          return;
        }
        const result = await updateRecipe({
          initialSlug,
          ...payload,
        });
        if (!result.success) {
          setFieldErrors(mapServerErrorToFields(result.error));
          return;
        }
        router.push(`/recipes/${result.slug}`);
        router.refresh();
        return;
      }

      const result = await createRecipe(payload);
      if (!result.success) {
        setFieldErrors(mapServerErrorToFields(result.error));
        return;
      }

      router.push(`/recipes/${result.slug}`);
      router.refresh();
    });
  }

  const controlClass =
    "min-h-11 rounded-lg border border-input-border px-3 py-2.5 text-base leading-snug text-text-on-light sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <div className="min-w-0 space-y-1.5">
          <label htmlFor="recipe-title" className={labelClass}>
            Recipe title <span className="text-destructive">*</span>
          </label>
          <Input
            id="recipe-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearFieldError("title", "general");
            }}
            error={fieldErrors.title}
            placeholder="Recipe name"
            className={controlClass}
          />
        </div>

        <div className="min-w-0 space-y-1.5">
          <label htmlFor="recipe-time" className={labelClass}>
            Cooking time (minutes)
          </label>
          <Input
            id="recipe-time"
            type="number"
            min={0}
            step={1}
            value={cookingTimeRaw}
            onChange={(e) => {
              setCookingTimeRaw(e.target.value);
              clearFieldError("cookingTime", "general");
            }}
            error={fieldErrors.cookingTime}
            placeholder="Optional"
            className={controlClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="recipe-description" className={labelClass}>
          Description
        </label>
        <Textarea
          id="recipe-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Short summary (optional)"
          className={controlClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="recipe-image" className={labelClass}>
          Image URL
        </label>
        <Input
          id="recipe-image"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
          className={controlClass}
        />
      </div>

      <CategorySelector
        categories={categories}
        selectedIds={selectedCategoryIds}
        onToggle={toggleCategory}
        error={fieldErrors.categories}
      />

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

      {fieldErrors.general ? (
        <p
          className="m-0 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-text-on-light"
          role="alert"
        >
          {fieldErrors.general}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {!isEdit ? (
          <Link
            href="/recipes"
            className={cn(
              composeButtonClassName("destructive"),
              "min-h-10 px-4 py-2 text-center no-underline",
            )}
          >
            Cancel
          </Link>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          className="min-h-10 px-4 py-2"
        >
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Create Recipe"}
        </Button>
      </div>
    </form>
  );
}
