import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { FavoriteButton } from "@/components/recipes/favorite-button";
import { getRecipeBySlug } from "@/lib/recipes";

export default async function RecipeDetailPage(
  props: PageProps<"/recipes/[slug]">,
) {
  const { slug } = await props.params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const categoryTitles = recipe.categories.map((rc) => rc.category.title);
  const publishedLabel = recipe.publishedAt
    ? recipe.publishedAt.toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <p>
        <Link href="/recipes" className="text-zinc-600 underline text-sm">
          All recipes
        </Link>
      </p>

      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold m-0">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <FavoriteButton slug={slug} />
            <Link
              href={`/recipes/${slug}/edit`}
              className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Edit
            </Link>
            <DeleteRecipeButton slug={slug} />
          </div>
        </div>
        {recipe.description ? (
          <p className="text-zinc-700">{recipe.description}</p>
        ) : null}
      </header>

      {recipe.imageUrl ? (
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full max-h-80 object-cover rounded-lg"
          width={800}
          height={480}
          unoptimized
        />
      ) : null}

      <dl className="grid gap-2 text-sm text-zinc-600">
        {recipe.cookingTime != null ? (
          <div>
            <dt className="inline font-medium text-zinc-800">Cooking time: </dt>
            <dd className="inline">{recipe.cookingTime} min</dd>
          </div>
        ) : null}
        <div>
          <dt className="inline font-medium text-zinc-800">Published: </dt>
          <dd className="inline">
            {publishedLabel ?? "Not published"}
          </dd>
        </div>
        {categoryTitles.length > 0 ? (
          <div>
            <dt className="inline font-medium text-zinc-800">Categories: </dt>
            <dd className="inline">{categoryTitles.join(", ")}</dd>
          </div>
        ) : null}
      </dl>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        <pre className="whitespace-pre-wrap rounded border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800">
          {recipe.ingredients}
        </pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Instructions</h2>
        <pre className="whitespace-pre-wrap rounded border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800">
          {recipe.instructions}
        </pre>
      </section>
    </main>
  );
}
