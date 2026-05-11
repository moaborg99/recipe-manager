import { RecipeCard } from "@/components/recipes/recipe-card";
import { getRecipes } from "@/lib/recipes";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Recipes</h1>
      <ul className="space-y-4 list-none p-0 m-0">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard
              slug={recipe.slug}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              cookingTime={recipe.cookingTime}
              categoryTitles={recipe.categories.map((rc) => rc.category.title)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
