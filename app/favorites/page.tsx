import type { Metadata } from "next";

import { FavoritesClient } from "@/components/recipes/favorites-client";

export const metadata: Metadata = {
  title: "Saved recipes",
};

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Saved recipes</h1>
      <p className="text-sm text-zinc-600 m-0">
        Favorites are stored in this browser only.
      </p>
      <FavoritesClient />
    </main>
  );
}
