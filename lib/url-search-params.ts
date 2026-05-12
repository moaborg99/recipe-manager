/**
 * Normalizes a single query value from Next.js `searchParams`.
 * Returns a trimmed string or empty string when absent (treat empty as "no filter").
 */
export function normalizeQueryParam(
  value: string | string[] | undefined,
): string {
  if (value === undefined) {
    return "";
  }
  const s = Array.isArray(value) ? value[0] : value;
  return typeof s === "string" ? s.trim() : "";
}
