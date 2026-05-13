"use client";

import { useId, useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";

type TabId = "ingredients" | "instructions";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function normalizeLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

type RecipeDetailTabsProps = {
  ingredients: string;
  instructions: string;
};

export function RecipeDetailTabs({
  ingredients,
  instructions,
}: RecipeDetailTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState<TabId>("ingredients");
  const ingredientsTabRef = useRef<HTMLButtonElement>(null);
  const instructionsTabRef = useRef<HTMLButtonElement>(null);

  const ingId = `${baseId}-ingredients-panel`;
  const insId = `${baseId}-instructions-panel`;
  const ingTabId = `${baseId}-ingredients-tab`;
  const insTabId = `${baseId}-instructions-tab`;

  const ingredientLines = normalizeLines(ingredients);
  const instructionLines = normalizeLines(instructions);

  function tabClass(selected: boolean) {
    return cn(
      "flex-1 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 sm:text-base",
      focusRing,
      selected
        ? "bg-accent text-header shadow-sm"
        : "text-muted-text hover:bg-surface hover:text-text-on-light",
    );
  }

  return (
    <Card
      padding="md"
      className={cn(
        "rounded-xl border-0 shadow-sm",
        "md:min-h-0 md:flex-1 md:flex md:flex-col",
      )}
    >
      <div
        role="tablist"
        aria-label="Recipe content"
        className="mb-4 flex shrink-0 gap-1 rounded-lg bg-accent/20 p-1 sm:gap-2"
      >
        <button
          ref={ingredientsTabRef}
          id={ingTabId}
          type="button"
          role="tab"
          aria-selected={active === "ingredients"}
          aria-controls={ingId}
          tabIndex={active === "ingredients" ? 0 : -1}
          className={tabClass(active === "ingredients")}
          onClick={() => setActive("ingredients")}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              setActive("instructions");
              queueMicrotask(() => instructionsTabRef.current?.focus());
            }
          }}
        >
          Ingredients
        </button>
        <button
          ref={instructionsTabRef}
          id={insTabId}
          type="button"
          role="tab"
          aria-selected={active === "instructions"}
          aria-controls={insId}
          tabIndex={active === "instructions" ? 0 : -1}
          className={tabClass(active === "instructions")}
          onClick={() => setActive("instructions")}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              setActive("ingredients");
              queueMicrotask(() => ingredientsTabRef.current?.focus());
            }
          }}
        >
          Instructions
        </button>
      </div>

      <h2 className="m-0 mb-5 mt-1 shrink-0 text-xl font-bold leading-tight tracking-tight text-text-on-light sm:mb-7 sm:mt-2 sm:text-2xl md:text-3xl">
        {active === "ingredients" ? "Ingredients" : "Instructions"}
      </h2>

      <div
        id={ingId}
        role="tabpanel"
        aria-labelledby={ingTabId}
        hidden={active !== "ingredients"}
        className="min-h-[8rem] md:min-h-0 md:flex-1"
      >
        {ingredientLines.length > 0 ? (
          <ul className="m-0 list-disc space-y-3.5 pl-5 text-base leading-relaxed text-text-on-light sm:space-y-4 sm:pl-6 sm:text-lg">
            {ingredientLines.map((line, i) => (
              <li key={i} className="pl-1 sm:pl-1.5">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-base text-muted-text sm:text-lg">
            No ingredients listed.
          </p>
        )}
      </div>

      <div
        id={insId}
        role="tabpanel"
        aria-labelledby={insTabId}
        hidden={active !== "instructions"}
        className="min-h-[8rem] md:min-h-0 md:flex-1"
      >
        {instructionLines.length > 0 ? (
          <ol className="m-0 list-decimal space-y-4 pl-5 text-base leading-relaxed text-text-on-light sm:space-y-5 sm:pl-7 sm:text-lg">
            {instructionLines.map((line, i) => (
              <li key={i} className="pl-1">
                {line}
              </li>
            ))}
          </ol>
        ) : (
          <p className="m-0 text-base text-muted-text sm:text-lg">
            No instructions listed.
          </p>
        )}
      </div>
    </Card>
  );
}
