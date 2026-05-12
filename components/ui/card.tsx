import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/ui/cn";

const paddingClass = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
} as const;

export type CardPadding = keyof typeof paddingClass;

export type CardProps = ComponentPropsWithoutRef<"div"> & {
  padding?: CardPadding;
};

export function Card({
  className,
  padding = "sm",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-subtle-border bg-surface shadow-sm",
        paddingClass[padding],
        className,
      )}
      {...props}
    />
  );
}
