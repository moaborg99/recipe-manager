import { Heart } from "@deemlol/next-icons";

import { cn } from "@/components/ui/cn";

type HeartToggleIconProps = {
  filled: boolean;
  size?: number;
  className?: string;
};

/** Same `Heart` from `@deemlol/next-icons` for recipe cards and header: outline when not filled, solid when filled. */
export function HeartToggleIcon({
  filled,
  size = 22,
  className,
}: HeartToggleIconProps) {
  return (
    <Heart
      aria-hidden
      size={size}
      className={cn("shrink-0", className)}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    />
  );
}
