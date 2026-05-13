import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/categories/category-form";
import { BackLink } from "@/components/ui/back-link";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { getCategoryBySlug } from "@/lib/categories";

export default async function EditCategoryPage(
  props: PageProps<"/categories/[slug]/edit">,
) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <PageContainer
      as="main"
      maxWidthClass="max-w-3xl"
      className="space-y-6 sm:space-y-8"
    >
      <BackLink href="/categories">Back to categories</BackLink>

      <PageHeader
        size="lg"
        title="Edit Category"
        description="Update the name below"
      />

      <Card
        padding="md"
        className="rounded-xl border-0 shadow-md sm:p-8"
      >
        <CategoryForm
          key={category.id}
          mode="edit"
          initialSlug={slug}
          defaultValues={{ title: category.title }}
        />
      </Card>
    </PageContainer>
  );
}
