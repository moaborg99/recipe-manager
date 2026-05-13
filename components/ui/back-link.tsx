import type { ComponentPropsWithoutRef } from "react";

import { ArrowLeft } from "@deemlol/next-icons";
import Link from "next/link";

import { cn } from "@/components/ui/cn";

/** Matches header nav link treatment on the green canvas (`site-header` `navLinkClass` + focus ring). */
const backLinkClass =
  "inline-flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-text-on-dark/80 transition-colors hover:text-text-on-dark sm:px-2.5 sm:text-[0.9375rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export type BackLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
  className?: string;
};

export function BackLink({ className, children, ...props }: BackLinkProps) {
  return (
    <Link className={cn(backLinkClass, className)} {...props}>
      <ArrowLeft
        aria-hidden
        size={18}
        strokeWidth={2}
        className="shrink-0 text-current"
      />
      {children}
    </Link>
  );
}
