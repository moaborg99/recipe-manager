import { twMerge } from "tailwind-merge";

export function cn(
  ...classes: Array<string | undefined | false | null>
): string {
  const list = classes.filter(Boolean) as string[];
  return list.length > 0 ? twMerge(...list) : "";
}
