import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/ui/cn";

export type CardProps = ComponentPropsWithoutRef<"div">;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-subtle-border bg-surface p-4 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
