export const FAVORITES_STORAGE_KEY = "recipe-manager:favorite-recipe-slugs";

/** Dispatched on the window after favorites mutate (same tab). */
export const FAVORITES_CHANGED_EVENT = "favorites-changed";

function readRawSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is string => typeof x === "string" && x.length > 0,
    );
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]): void {
  if (typeof window === "undefined") {
    return;
  }
  const unique = [...new Set(slugs)];
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(unique));
}

export function getFavoriteSlugs(): string[] {
  return [...new Set(readRawSlugs())];
}

export function isFavoriteSlug(slug: string): boolean {
  if (!slug || typeof window === "undefined") {
    return false;
  }
  return readRawSlugs().includes(slug);
}

export function addFavoriteSlug(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  const next = new Set(readRawSlugs());
  next.add(slug);
  writeSlugs([...next]);
}

export function removeFavoriteSlug(slug: string): void {
  if (typeof window === "undefined" || !slug) return;
  writeSlugs(readRawSlugs().filter((s) => s !== slug));
}

/** Returns true if the slug is favorited after the operation. */
export function toggleFavoriteSlug(slug: string): boolean {
  if (typeof window === "undefined" || !slug) {
    return false;
  }
  if (isFavoriteSlug(slug)) {
    removeFavoriteSlug(slug);
    return false;
  }
  addFavoriteSlug(slug);
  return true;
}

export function dispatchFavoritesChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}

/** Drops slugs that are not in the catalog. Returns true if localStorage was updated. */
export function pruneFavoriteSlugsToCatalog(validSlugs: string[]): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const valid = new Set(validSlugs);
  const current = getFavoriteSlugs();
  const next = current.filter((slug) => valid.has(slug));
  if (next.length === current.length) {
    return false;
  }
  writeSlugs(next);
  return true;
}
