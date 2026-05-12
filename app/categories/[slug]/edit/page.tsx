import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/categories/category-form";
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
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <p className="flex flex-wrap gap-4 text-sm">
        <Link href="/categories" className="text-zinc-600 underline">
          All categories
        </Link>
      </p>
      <h1 className="text-2xl font-bold">Edit category</h1>
      <CategoryForm
        key={category.id}
        mode="edit"
        initialSlug={slug}
        defaultValues={{ title: category.title }}
      />
    </main>
  );
}
