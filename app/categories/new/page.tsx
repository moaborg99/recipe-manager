import Link from "next/link";

import { CategoryForm } from "@/components/categories/category-form";

export default function NewCategoryPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <p>
        <Link href="/categories" className="text-zinc-600 underline text-sm">
          All categories
        </Link>
      </p>
      <h1 className="text-2xl font-bold">New category</h1>
      <CategoryForm mode="create" />
    </main>
  );
}
