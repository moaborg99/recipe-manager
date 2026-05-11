/** Shared validation for recipe create/update (client + server). */

export function trimRecipeLines(lines: string[]): string[] {
  return lines.map((l) => l.trim()).filter((l) => l.length > 0);
}

export function validateTitle(title: string): string | null {
  if (!title.trim()) {
    return "Title is required.";
  }
  return null;
}

export function validateIngredientLines(lines: string[]): string | null {
  if (trimRecipeLines(lines).length === 0) {
    return "Add at least one ingredient line with text.";
  }
  return null;
}

export function validateInstructionSteps(steps: string[]): string | null {
  if (trimRecipeLines(steps).length === 0) {
    return "Add at least one instruction step with text.";
  }
  return null;
}

export const COOKING_TIME_ERROR =
  "Cooking time must be a whole number of minutes (0 or more).";

export function validateCookingTimeNumber(
  cookingTime: number | null | undefined,
): { ok: true; value: number | null } | { ok: false; error: string } {
  if (cookingTime === undefined || cookingTime === null) {
    return { ok: true, value: null };
  }
  const t = Number(cookingTime);
  if (!Number.isFinite(t) || !Number.isInteger(t) || t < 0) {
    return { ok: false, error: COOKING_TIME_ERROR };
  }
  return { ok: true, value: t };
}

export const COOKING_TIME_RAW_ERROR =
  "Cooking time must be a whole number of minutes (0 or more), or leave blank.";

export function validateCookingTimeRaw(raw: string): string | null {
  const s = raw.trim();
  if (s.length === 0) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
    return COOKING_TIME_RAW_ERROR;
  }
  return null;
}
