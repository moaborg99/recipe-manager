import { createElement, type ReactNode } from "react";

import { cn } from "@/components/ui/cn";

const headings = {
  1: "h1",
  2: "h2",
  3: "h3",
} as const;

export type PageHeaderSize = "sm" | "md" | "lg";

const sizeStyles: Record<
  PageHeaderSize,
  { title: string; description: string; stack: string }
> = {
  sm: {
    title:
      "m-0 font-semibold tracking-tight text-text-on-dark text-xl leading-snug sm:text-2xl sm:font-bold sm:leading-tight",
    description:
      "m-0 text-xs leading-normal text-text-on-dark/80 sm:text-sm",
    stack: "space-y-1.5",
  },
  md: {
    title:
      "m-0 font-bold tracking-tight text-text-on-dark text-2xl leading-snug sm:text-3xl sm:leading-tight md:text-4xl md:leading-[1.1]",
    description:
      "m-0 text-sm leading-normal text-text-on-dark/80 md:text-base",
    stack: "space-y-2 md:space-y-2",
  },
  lg: {
    title:
      "m-0 font-bold tracking-tight text-text-on-dark text-3xl leading-tight sm:text-4xl sm:leading-[1.1] md:text-5xl md:leading-tight",
    description:
      "m-0 max-w-2xl text-sm leading-relaxed text-text-on-dark/80 sm:text-base md:text-lg",
    stack: "space-y-2.5 md:space-y-3",
  },
};

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: keyof typeof headings;
  /** `lg` list/landing, `md` forms/detail, `sm` compact sections. */
  size?: PageHeaderSize;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  headingLevel = 1,
  size = "md",
  className,
}: PageHeaderProps) {
  const tag = headings[headingLevel];
  const styles = sizeStyles[size];

  return (
    <header
      className={cn(
        "flex w-full flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6 lg:gap-8",
        className,
      )}
    >
      <div className={cn("min-w-0 flex-1", styles.stack)}>
        {createElement(tag, { className: styles.title }, title)}
        {description != null ? (
          typeof description === "string" ? (
            <p className={styles.description}>{description}</p>
          ) : (
            <div className={styles.description}>{description}</div>
          )
        ) : null}
      </div>
      {actions != null ? (
        <div
          className={cn(
            "flex shrink-0 flex-wrap items-center gap-2",
            "self-start md:ml-auto md:justify-end",
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
