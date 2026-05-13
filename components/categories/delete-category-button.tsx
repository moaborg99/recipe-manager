"use client";

import { Trash2 } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

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
      <Button
        type="button"
        variant="destructive"
        onClick={handleClick}
        disabled={isPending}
        aria-label={`Delete category ${title}`}
        className={cn(
          "min-h-10 min-w-10 shrink-0 gap-0 px-0 py-0 sm:min-w-[2.75rem]",
          "inline-flex items-center justify-center",
        )}
      >
        {isPending ? (
          <span className="text-sm">…</span>
        ) : (
          <Trash2
            aria-hidden
            size={18}
            strokeWidth={2}
            className="shrink-0 text-current"
          />
        )}
      </Button>
      {error ? (
        <p className="m-0 max-w-[12rem] text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
