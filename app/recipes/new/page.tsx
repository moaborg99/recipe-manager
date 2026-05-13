import { RecipeForm } from "@/components/recipes/recipe-form";
import { BackLink } from "@/components/ui/back-link";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { getCategories } from "@/lib/recipes";

export default async function NewRecipePage() {
  const categories = await getCategories();

  return (
    <PageContainer
      as="main"
      maxWidthClass="max-w-3xl"
      className="space-y-6 sm:space-y-8"
    >
      <BackLink href="/recipes">Back to recipes</BackLink>

      <PageHeader
        size="lg"
        title="Create New Recipe"
        description="Fill in the details below"
      />

      <Card
        padding="md"
        className="rounded-xl border-0 shadow-md sm:p-8"
      >
        <RecipeForm categories={categories} />
      </Card>
    </PageContainer>
  );
}
