import Link from "next/link";

import { DeleteCategoryButton } from "@/components/categories/delete-category-button";
import { getCategories } from "@/lib/categories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold m-0">Categories</h1>
        <Link
          href="/categories/new"
          className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          New category
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-zinc-600 text-sm">No categories yet. Create one to get started.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 list-none m-0 p-0">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium text-zinc-900 m-0">{c.title}</p>
                <p className="text-xs text-zinc-500 m-0">slug: {c.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/categories/${c.slug}/edit`}
                  className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  Edit
                </Link>
                <DeleteCategoryButton slug={c.slug} title={c.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
