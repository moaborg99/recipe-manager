"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import {
  createCategory,
  updateCategory,
} from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CategoryFormDefaultValues = {
  title: string;
};

type CategoryFormProps = {
  mode: "create" | "edit";
  initialSlug?: string;
  defaultValues?: CategoryFormDefaultValues;
};

const labelClass =
  "block text-sm font-medium leading-snug text-text-on-light";

const controlClass =
  "min-h-11 rounded-lg border border-input-border px-3 py-2.5 text-base leading-snug text-text-on-light sm:text-sm";

function mapServerError(message: string): { title?: string; general?: string } {
  const msg = message.trim();
  if (msg === "Title is required.") return { title: msg };
  if (msg === "Category not found.") return { general: msg };
  return { general: msg };
}

export function CategoryForm({
  mode,
  initialSlug,
  defaultValues,
}: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(() => defaultValues?.title ?? "");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTitleError(null);
    setGeneralError(null);

    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError("Title is required.");
      return;
    }

    startTransition(async () => {
      if (mode === "create") {
        const result = await createCategory({ title });
        if (!result.success) {
          const mapped = mapServerError(result.error);
          setTitleError(mapped.title ?? null);
          setGeneralError(mapped.general ?? null);
          return;
        }
        router.push("/categories");
        router.refresh();
        return;
      }

      if (!initialSlug) {
        setGeneralError("Missing category slug. Reload and try again.");
        return;
      }

      const result = await updateCategory({ initialSlug, title });
      if (!result.success) {
        const mapped = mapServerError(result.error);
        setTitleError(mapped.title ?? null);
        setGeneralError(mapped.general ?? null);
        return;
      }
      router.push("/categories");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError ? (
        <p
          className="m-0 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-text-on-light"
          role="alert"
        >
          {generalError}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="category-title" className={labelClass}>
          Category name <span className="text-destructive">*</span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Input
              id="category-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(null);
                setGeneralError(null);
              }}
              error={titleError ?? undefined}
              placeholder="e.g., Asian Cuisine"
              className={controlClass}
            />
            <p className="m-0 text-xs text-muted-text">
              URL slug is generated from the title on the server.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="shrink-0 min-h-10 px-4 py-2 sm:self-start"
          >
            {isPending ? (
              "Saving…"
            ) : mode === "create" ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="text-base font-semibold leading-none">
                  +
                </span>
                Create category
              </span>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
