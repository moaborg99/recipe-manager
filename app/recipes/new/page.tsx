import Link from "next/link";

import { RecipeForm } from "@/components/recipes/recipe-form";
import { getCategories } from "@/lib/recipes";

export default async function NewRecipePage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <p>
        <Link href="/recipes" className="text-zinc-600 underline text-sm">
          All recipes
        </Link>
      </p>
      <h1 className="text-2xl font-bold">New recipe</h1>
      <RecipeForm categories={categories} />
    </main>
  );
}
