import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/ui/cn";

const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export type TextareaProps = Omit<
  ComponentPropsWithoutRef<"textarea">,
  "className"
> & {
  className?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      error,
      id: idProp,
      rows = 3,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const uid = useId();
    const errorId = error ? `${uid}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={idProp}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded border bg-surface px-2 py-1.5 text-sm text-text-on-light placeholder:text-muted-text/70",
            focusClass,
            error ? "border-destructive" : "border-subtle-border",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="mt-1 text-sm text-text-on-dark" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
