import "dotenv/config";

import { prisma } from "../lib/prisma";

type CategorySeed = { title: string; slug: string };

type RecipeSeed = {
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  ingredients: string;
  instructions: string;
  cookingTime: number | null;
  publishedAt: Date | null;
  categorySlugs: string[];
};

const categories: CategorySeed[] = [
  { title: "Breakfast", slug: "breakfast" },
  { title: "Dinner", slug: "dinner" },
  { title: "Dessert", slug: "dessert" },
];

const recipes: RecipeSeed[] = [
  {
    title: "Overnight oats with berries",
    slug: "overnight-oats-berries",
    description: "No-cook oats soaked in milk and yogurt, topped with fresh berries.",
    imageUrl: null,
    ingredients: `Rolled oats: 80 g
Milk: 200 ml
Greek yogurt: 100 g
Honey: 1 tbsp
Mixed berries: 100 g`,
    instructions: `Stir oats, milk, yogurt, and honey in a jar. Seal and refrigerate overnight.
In the morning, stir and top with berries before serving.`,
    cookingTime: 5,
    publishedAt: new Date("2026-05-01T08:00:00.000Z"),
    categorySlugs: ["breakfast"],
  },
  {
    title: "Simple vegetable omelette",
    slug: "simple-vegetable-omelette",
    description: "A quick three-egg omelette with peppers and spinach.",
    imageUrl: null,
    ingredients: `Eggs: 3
Bell pepper: 1/2, diced
Spinach: handful
Butter: 1 tsp
Salt and pepper: to taste`,
    instructions: `Whisk eggs with salt and pepper. Sauté pepper in butter until softened, add spinach until wilted.
Pour in eggs, cook over medium heat, fold when set. Serve warm.`,
    cookingTime: 15,
    publishedAt: new Date("2026-05-03T07:30:00.000Z"),
    categorySlugs: ["breakfast"],
  },
  {
    title: "One-pan lemon chicken with potatoes",
    slug: "lemon-chicken-potatoes",
    description: "Roasted chicken thighs with lemon, garlic, and baby potatoes.",
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    ingredients: `Chicken thighs (bone-in): 4
Baby potatoes: 500 g
Lemon: 1, sliced
Garlic cloves: 4, smashed
Olive oil: 3 tbsp
Fresh thyme: few sprigs
Salt and pepper: to taste`,
    instructions: `Heat oven to 200°C. Toss potatoes with half the oil, salt, and pepper in a roasting pan.
Nestle chicken among potatoes. Add lemon, garlic, thyme, remaining oil. Roast 40–45 minutes until chicken is golden and cooked through.`,
    cookingTime: 55,
    publishedAt: new Date("2026-05-05T18:00:00.000Z"),
    categorySlugs: ["dinner"],
  },
  {
    title: "Classic chocolate mousse",
    slug: "classic-chocolate-mousse",
    description: "Rich dark chocolate mousse with whipped cream folded in.",
    imageUrl: null,
    ingredients: `Dark chocolate (70%): 150 g, chopped
Butter: 30 g
Eggs: 3, separated
Sugar: 40 g
Heavy cream: 150 ml`,
    instructions: `Melt chocolate with butter over a bain-marie; cool slightly. Beat egg yolks with half the sugar until pale.
Fold yolks into chocolate. Whip cream to soft peaks; fold in. Beat egg whites with remaining sugar to stiff peaks; fold gently into mousse. Chill at least 2 hours.`,
    cookingTime: 25,
    publishedAt: new Date("2026-05-08T19:00:00.000Z"),
    categorySlugs: ["dessert"],
  },
  {
    title: "Weeknight tomato pasta",
    slug: "weeknight-tomato-pasta",
    description: "Fast spaghetti in a garlic tomato sauce—comfort food in under thirty minutes.",
    imageUrl: null,
    ingredients: `Spaghetti: 400 g
Canned crushed tomatoes: 400 g
Garlic: 3 cloves, minced
Olive oil: 2 tbsp
Dried oregano: 1 tsp
Parmesan: to serve`,
    instructions: `Cook pasta in salted water until al dente. Meanwhile, sauté garlic in oil, add tomatoes and oregano, simmer 10 minutes.
Drain pasta, toss with sauce, finish with parmesan.`,
    cookingTime: 28,
    publishedAt: null,
    categorySlugs: ["dinner"],
  },
];

function categoryCreates(slugs: string[]) {
  return slugs.map((slug) => ({
    category: { connect: { slug } },
  }));
}

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: { title: c.title, slug: c.slug },
      update: { title: c.title },
    });
  }

  for (const r of recipes) {
    await prisma.recipe.upsert({
      where: { slug: r.slug },
      create: {
        title: r.title,
        slug: r.slug,
        description: r.description,
        imageUrl: r.imageUrl,
        ingredients: r.ingredients,
        instructions: r.instructions,
        cookingTime: r.cookingTime,
        publishedAt: r.publishedAt,
        categories: {
          create: categoryCreates(r.categorySlugs),
        },
      },
      update: {
        title: r.title,
        description: r.description,
        imageUrl: r.imageUrl,
        ingredients: r.ingredients,
        instructions: r.instructions,
        cookingTime: r.cookingTime,
        publishedAt: r.publishedAt,
        categories: {
          deleteMany: {},
          create: categoryCreates(r.categorySlugs),
        },
      },
    });
  }

  const recipeCount = await prisma.recipe.count();
  const categoryCount = await prisma.category.count();
  const linkCount = await prisma.recipeCategory.count();
  console.log(
    `Seed complete: ${recipeCount} recipes, ${categoryCount} categories, ${linkCount} recipe–category links.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
