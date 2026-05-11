import Link from "next/link";
import { notFound } from "next/navigation";

import { RecipeForm, type RecipeFormDefaultValues } from "@/components/recipes/recipe-form";
import { getCategories, getRecipeBySlug } from "@/lib/recipes";

export default async function EditRecipePage(
  props: PageProps<"/recipes/[slug]/edit">,
) {
  const { slug } = await props.params;
  const [recipe, categories] = await Promise.all([
    getRecipeBySlug(slug),
    getCategories(),
  ]);

  if (!recipe) {
    notFound();
  }

  const defaultValues: RecipeFormDefaultValues = {
    title: recipe.title,
    description: recipe.description ?? "",
    imageUrl: recipe.imageUrl ?? "",
    cookingTime: recipe.cookingTime,
    ingredientLines:
      recipe.ingredients.length > 0 ? recipe.ingredients.split("\n") : [""],
    instructionSteps:
      recipe.instructions.length > 0 ? recipe.instructions.split("\n") : [""],
    categoryIds: recipe.categories.map((rc) => rc.category.id),
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <p className="flex flex-wrap gap-4 text-sm">
        <Link href="/recipes" className="text-zinc-600 underline">
          All recipes
        </Link>
        <Link href={`/recipes/${slug}`} className="text-zinc-600 underline">
          View recipe
        </Link>
      </p>
      <h1 className="text-2xl font-bold">Edit recipe</h1>
      <RecipeForm
        key={recipe.id}
        mode="edit"
        initialSlug={slug}
        categories={categories}
        defaultValues={defaultValues}
      />
    </main>
  );
}
