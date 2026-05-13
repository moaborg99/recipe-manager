import type { Metadata } from "next";

import { FavoritesClient } from "@/components/recipes/favorites-client";
import { PageContainer } from "@/components/ui/page-container";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
  return (
    <PageContainer as="main" maxWidthClass="max-w-6xl" className="space-y-8">
      <FavoritesClient />
    </PageContainer>
  );
}
