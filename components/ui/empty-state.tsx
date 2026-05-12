import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "text-center px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-5">
        <p className="m-0 text-lg font-semibold leading-snug text-text-on-light sm:text-xl">
          {title}
        </p>
        {description != null ? (
          <div className="w-full max-w-md text-sm leading-relaxed text-muted-text sm:text-base">
            {description}
          </div>
        ) : null}
        {action != null ? (
          <div className="flex justify-center">{action}</div>
        ) : null}
      </div>
    </Card>
  );
}
