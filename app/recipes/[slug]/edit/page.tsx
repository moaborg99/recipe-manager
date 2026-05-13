import Link from "next/link";
import { notFound } from "next/navigation";

import { RecipeForm, type RecipeFormDefaultValues } from "@/components/recipes/recipe-form";
import { BackLink } from "@/components/ui/back-link";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { getCategories, getRecipeBySlug } from "@/lib/recipes";

const secondaryNavLinkClass = cn(
  "text-sm font-medium text-text-on-dark/80 underline-offset-2 transition-colors",
  "hover:text-text-on-dark hover:underline",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-sm px-1 py-0.5",
);

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
    <PageContainer
      as="main"
      maxWidthClass="max-w-3xl"
      className="space-y-6 sm:space-y-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
        <BackLink href={`/recipes/${slug}`}>Back to recipe</BackLink>
        <Link href="/recipes" className={secondaryNavLinkClass}>
          All recipes
        </Link>
      </div>

      <PageHeader
        size="lg"
        title="Edit Recipe"
        description="Update the details below"
      />

      <Card
        padding="md"
        className="rounded-xl border-0 shadow-md sm:p-8"
      >
        <RecipeForm
          key={recipe.id}
          mode="edit"
          initialSlug={slug}
          categories={categories}
          defaultValues={defaultValues}
        />
      </Card>
    </PageContainer>
  );
}
