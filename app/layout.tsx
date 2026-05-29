import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { FavoritesCatalogSync } from "@/components/layout/favorites-catalog-sync";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Manager",
  description: "Discover, organize, and save your recipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <FavoritesCatalogSync />
        <SiteHeader />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}