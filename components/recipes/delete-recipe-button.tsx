"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteRecipe } from "@/actions/recipe-actions";

type DeleteRecipeButtonProps = {
  slug: string;
};

export function DeleteRecipeButton({ slug }: DeleteRecipeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    if (
      !window.confirm(
        "Delete this recipe? This cannot be undone.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteRecipe(slug);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/recipes");
      router.refresh();
    });
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded border border-red-700 bg-white px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-50 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete recipe"}
      </button>
      {error ? (
        <p className="m-0 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
