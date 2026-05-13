import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/ui/cn";

const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const disabledClass =
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[color-mix(in_srgb,var(--background)_50%,transparent)] disabled:text-text-on-dark disabled:hover:opacity-100";

const variantClass: Record<"primary" | "accent" | "destructive", string> = {
  primary:
    "border border-text-on-dark/15 bg-primary text-text-on-dark hover:opacity-90",
  accent:
    "border border-subtle-border bg-accent text-header hover:opacity-90",
  destructive:
    "border border-destructive bg-destructive text-text-on-dark hover:opacity-90",
};

const buttonLayoutClass =
  "inline-flex cursor-pointer items-center justify-center rounded px-3 py-1.5 text-sm font-medium transition-colors";

export type ButtonVariant = keyof typeof variantClass;

/**
 * Same surface styles as `Button` for use on `Link` or other non-button elements.
 * Omits `disabled:*` utilities (not meaningful on anchors).
 */
export function composeButtonClassName(
  variant: ButtonVariant,
  className?: string,
) {
  return cn(
    buttonLayoutClass,
    focusClass,
    variantClass[variant],
    className,
  );
}

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "primary", type = "button", ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          composeButtonClassName(variant),
          disabledClass,
          className,
        )}
        {...props}
      />
    );
  },
);
