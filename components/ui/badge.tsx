import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/ui/cn";

const variantClass = {
  default: "border border-subtle-border bg-surface text-text-on-light",
  selected: "border border-accent bg-accent text-text-on-light",
} as const;

export type BadgeVariant = keyof typeof variantClass;

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
