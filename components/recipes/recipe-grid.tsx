import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/ui/cn";

const recipeGridClass =
  "m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3";

export function RecipeGrid({
  className,
  ...props
}: ComponentPropsWithoutRef<"ul">) {
  return <ul className={cn(recipeGridClass, className)} {...props} />;
}

export function RecipeGridItem({
  className,
  ...props
}: ComponentPropsWithoutRef<"li">) {
  return <li className={cn("h-full min-w-0", className)} {...props} />;
}
