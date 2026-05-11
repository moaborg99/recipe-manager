import Image from "next/image";
import Link from "next/link";

type RecipeCardProps = {
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  cookingTime: number | null;
  categoryTitles: string[];
};

export function RecipeCard({
  slug,
  title,
  description,
  imageUrl,
  cookingTime,
  categoryTitles,
}: RecipeCardProps) {
  return (
    <Link href={`/recipes/${slug}`} className="block">
      <article className="border border-zinc-200 rounded-lg p-4 space-y-2 hover:border-zinc-400 transition-colors">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? <p className="text-zinc-700">{description}</p> : null}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          className="max-h-40 w-full object-cover rounded"
          width={800}
          height={320}
          unoptimized
        />
      ) : null}
      {cookingTime != null ? (
        <p className="text-sm text-zinc-600">Cooking time: {cookingTime} min</p>
      ) : null}
      {categoryTitles.length > 0 ? (
        <p className="text-sm text-zinc-600">
          Categories: {categoryTitles.join(", ")}
        </p>
      ) : null}
    </article>
    </Link>
  );
}
