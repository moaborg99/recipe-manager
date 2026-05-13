"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Trash2 } from "@deemlol/next-icons";

import { deleteRecipe } from "@/actions/recipe-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

type DeleteRecipeButtonProps = {
  slug: string;
  /** Merged onto the outer wrapper (e.g. flex-1 for equal-width rows). */
  className?: string;
  /** Merged onto the destructive Button (e.g. w-full). */
  buttonClassName?: string;
};

export function DeleteRecipeButton({
  slug,
  className,
  buttonClassName,
}: DeleteRecipeButtonProps) {
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
    <div className={cn("space-y-1", className)}>
      <Button
        type="button"
        variant="destructive"
        className={cn("gap-2", buttonClassName)}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Deleting…" : "Delete recipe"}
        <Trash2
          aria-hidden
          size={18}
          strokeWidth={2}
          className="shrink-0 text-current"
        />
      </Button>
      {error ? (
        <p className="m-0 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
