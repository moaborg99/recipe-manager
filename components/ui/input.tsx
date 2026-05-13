import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/ui/cn";

const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export type InputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "className"
> & {
  className?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, id: idProp, "aria-describedby": ariaDescribedBy, ...props },
  ref,
) {
  const uid = useId();
  const errorId = error ? `${uid}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full">
      <input
        ref={ref}
        id={idProp}
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
        <p id={errorId} className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
