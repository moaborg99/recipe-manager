"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createCategory,
  updateCategory,
} from "@/actions/category-actions";

export type CategoryFormDefaultValues = {
  title: string;
};

type CategoryFormProps = {
  mode: "create" | "edit";
  initialSlug?: string;
  defaultValues?: CategoryFormDefaultValues;
};

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

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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

  const inputErrorClass = "border-red-400 ring-1 ring-red-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {generalError ? (
        <p
          className="m-0 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {generalError}
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="category-title" className="text-sm font-medium">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="category-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(null);
            setGeneralError(null);
          }}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? "category-title-error" : undefined}
          className={`w-full rounded border px-2 py-1.5 text-sm ${
            titleError ? inputErrorClass : "border-zinc-300"
          }`}
          placeholder="Category name"
        />
        {titleError ? (
          <p id="category-title-error" className="m-0 text-sm text-red-800" role="alert">
            {titleError}
          </p>
        ) : null}
        <p className="m-0 text-xs text-zinc-500">
          URL slug is generated from the title on the server.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Saving…" : mode === "create" ? "Create category" : "Save changes"}
      </button>
    </form>
  );
}
