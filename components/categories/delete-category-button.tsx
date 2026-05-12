"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteCategory } from "@/actions/category-actions";

type DeleteCategoryButtonProps = {
  slug: string;
  title: string;
};

export function DeleteCategoryButton({ slug, title }: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    if (
      !window.confirm(
        `Delete category "${title}"? Recipes linked to it will lose this tag. This cannot be undone.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategory(slug);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded border border-red-700 bg-white px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-50 disabled:opacity-50"
      >
        {isPending ? "…" : "Delete"}
      </button>
      {error ? (
        <p className="m-0 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
