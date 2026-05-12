import type { ReactNode } from "react";

import { cn } from "@/components/ui/cn";

export type PageContainerProps = {
  as?: "div" | "main";
  maxWidthClass?: string;
  className?: string;
  children: ReactNode;
};

export function PageContainer({
  as: Component = "main",
  maxWidthClass = "max-w-2xl",
  className,
  children,
}: PageContainerProps) {
  return (
    <Component
      className={cn("mx-auto px-4 py-8", maxWidthClass, className)}
    >
      {children}
    </Component>
  );
}
