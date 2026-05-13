import Link from "next/link";
import { Edit } from "@deemlol/next-icons";

import { CategoryForm } from "@/components/categories/category-form";
import { DeleteCategoryButton } from "@/components/categories/delete-category-button";
import { Card } from "@/components/ui/card";
import { composeButtonClassName } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { getCategories } from "@/lib/categories";

const cardHeadingClass =
  "m-0 text-lg font-semibold tracking-tight text-text-on-light sm:text-xl";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <PageContainer
      as="main"
      maxWidthClass="max-w-3xl"
      className="space-y-6 sm:space-y-8"
    >
      <PageHeader
        size="lg"
        title="Manage Categories"
        description="Create and organize recipe categories"
      />

      <Card
        padding="md"
        className="rounded-xl border-0 shadow-md sm:p-8"
      >
        <h2 className={cn(cardHeadingClass, "mb-6")}>Create New Category</h2>
        <CategoryForm mode="create" />
      </Card>

      <Card
        padding="md"
        className="rounded-xl border-0 shadow-md sm:p-8"
      >
        <h2 className={cn(cardHeadingClass, "mb-6")}>All Categories</h2>

        {categories.length === 0 ? (
          <p className="m-0 text-sm text-muted-text">
            No categories yet. Add one above to get started.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-input-border bg-surface px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="m-0 font-medium text-text-on-light">{c.title}</p>
                  <p className="m-0 text-xs text-muted-text">slug: {c.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/categories/${c.slug}/edit`}
                    className={cn(
                      composeButtonClassName("primary"),
                      "inline-flex min-h-10 items-center justify-center gap-2 px-3 py-2 text-sm no-underline",
                    )}
                  >
                    Edit
                    <Edit
                      aria-hidden
                      size={18}
                      strokeWidth={2}
                      className="shrink-0 text-current"
                    />
                  </Link>
                  <DeleteCategoryButton slug={c.slug} title={c.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </PageContainer>
  );
}
