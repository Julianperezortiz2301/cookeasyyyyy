import { PrismaClient, Difficulty, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Quick & Easy", slug: "quick-easy", icon: "Zap", color: "yellow" },
  { name: "Main Dishes", slug: "main-dishes", icon: "UtensilsCrossed", color: "orange" },
  { name: "Vegetarian", slug: "vegetarian", icon: "Leaf", color: "green" },
  { name: "Soups", slug: "soups", icon: "Soup", color: "blue" },
  { name: "Salads", slug: "salads", icon: "Salad", color: "pink" },
  { name: "Desserts", slug: "desserts", icon: "Cookie", color: "purple" },
];

interface SeedRecipe {
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  difficulty: Difficulty;
  instructions: string[];
  categorySlug: string;
  ingredients: { name: string; quantity: string }[];
}

const RECIPES: SeedRecipe[] = [
  {
    title: "Garlic Butter Chicken",
    description: "Juicy pan-seared chicken breast in a rich garlic butter sauce.",
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop",
    cookingTime: 25,
    difficulty: Difficulty.EASY,
    categorySlug: "main-dishes",
    instructions: [
      "Season the chicken breasts with salt and pepper on both sides.",
      "Heat oil in a skillet over medium-high heat and sear the chicken for 6 minutes per side.",
      "Remove the chicken and lower the heat, then melt butter and add minced garlic.",
      "Cook the garlic for 30 seconds until fragrant, then return the chicken to the pan.",
      "Spoon the garlic butter over the chicken for 2 minutes and serve hot.",
    ],
    ingredients: [
      { name: "chicken", quantity: "2 breasts" },
      { name: "garlic", quantity: "4 cloves" },
      { name: "butter", quantity: "2 tbsp" },
      { name: "onion", quantity: "1" },
    ],
  },
  {
    title: "Classic Egg Fried Rice",
    description: "A fast one-pan dinner using leftover rice, eggs, and whatever veggies you have.",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop",
    cookingTime: 15,
    difficulty: Difficulty.VERY_EASY,
    categorySlug: "quick-easy",
    instructions: [
      "Heat oil in a wok over high heat.",
      "Scramble the eggs in the wok and set aside.",
      "Add the rice and stir-fry for 3 minutes, breaking up any clumps.",
      "Add the eggs back in along with soy sauce and chopped onion.",
      "Stir everything together for 2 more minutes and serve.",
    ],
    ingredients: [
      { name: "rice", quantity: "2 cups" },
      { name: "egg", quantity: "2" },
      { name: "onion", quantity: "1" },
      { name: "soy sauce", quantity: "2 tbsp" },
    ],
  },
  {
    title: "Creamy Tomato Pasta",
    description: "A comforting pasta tossed in a creamy tomato and garlic sauce.",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
    cookingTime: 20,
    difficulty: Difficulty.EASY,
    categorySlug: "main-dishes",
    instructions: [
      "Cook the pasta in salted boiling water until al dente.",
      "In a pan, sauté garlic in olive oil until fragrant.",
      "Add chopped tomatoes and simmer for 8 minutes.",
      "Stir in cream and season with salt and pepper.",
      "Toss the drained pasta into the sauce and serve with grated cheese.",
    ],
    ingredients: [
      { name: "pasta", quantity: "300 g" },
      { name: "tomato", quantity: "4" },
      { name: "garlic", quantity: "3 cloves" },
      { name: "cheese", quantity: "50 g" },
    ],
  },
  {
    title: "Loaded Baked Potatoes",
    description: "Fluffy baked potatoes topped with cheese and green onion.",
    imageUrl: "https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?q=80&w=800&auto=format&fit=crop",
    cookingTime: 50,
    difficulty: Difficulty.EASY,
    categorySlug: "main-dishes",
    instructions: [
      "Preheat the oven to 220°C (425°F).",
      "Pierce the potatoes with a fork and rub with oil and salt.",
      "Bake for 40-45 minutes until the skin is crisp and the inside is soft.",
      "Cut open and fluff the inside with a fork.",
      "Top with cheese, butter, and chopped onion before serving.",
    ],
    ingredients: [
      { name: "potato", quantity: "4 large" },
      { name: "cheese", quantity: "100 g" },
      { name: "butter", quantity: "2 tbsp" },
      { name: "onion", quantity: "1" },
    ],
  },
  {
    title: "Spinach & Cheese Omelette",
    description: "A quick, protein-packed breakfast omelette with fresh spinach.",
    imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop",
    cookingTime: 10,
    difficulty: Difficulty.VERY_EASY,
    categorySlug: "quick-easy",
    instructions: [
      "Whisk the eggs with a pinch of salt and pepper.",
      "Heat butter in a nonstick pan over medium heat.",
      "Pour in the eggs and let them set for 1 minute.",
      "Add spinach and cheese to one half, then fold the omelette over.",
      "Cook for another minute and slide onto a plate.",
    ],
    ingredients: [
      { name: "egg", quantity: "3" },
      { name: "spinach", quantity: "1 cup" },
      { name: "cheese", quantity: "30 g" },
      { name: "butter", quantity: "1 tbsp" },
    ],
  },
  {
    title: "Roasted Vegetable Medley",
    description: "A colorful mix of oven-roasted seasonal vegetables.",
    imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=800&auto=format&fit=crop",
    cookingTime: 35,
    difficulty: Difficulty.EASY,
    categorySlug: "vegetarian",
    instructions: [
      "Preheat the oven to 200°C (400°F).",
      "Chop the potatoes, onion, and tomato into even chunks.",
      "Toss the vegetables with olive oil, garlic, salt, and pepper.",
      "Spread on a baking sheet and roast for 25-30 minutes, stirring halfway.",
      "Serve warm as a side or over rice.",
    ],
    ingredients: [
      { name: "potato", quantity: "2" },
      { name: "tomato", quantity: "2" },
      { name: "onion", quantity: "1" },
      { name: "garlic", quantity: "2 cloves" },
    ],
  },
  {
    title: "Hearty Chicken Soup",
    description: "A warm, comforting soup loaded with chicken and vegetables.",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
    cookingTime: 45,
    difficulty: Difficulty.MEDIUM,
    categorySlug: "soups",
    instructions: [
      "Sauté onion and garlic in a large pot until soft.",
      "Add chicken pieces and cook until lightly browned.",
      "Pour in water or broth and bring to a boil.",
      "Add chopped potato and carrot, then simmer for 25 minutes.",
      "Season with salt and pepper and serve hot.",
    ],
    ingredients: [
      { name: "chicken", quantity: "2 thighs" },
      { name: "onion", quantity: "1" },
      { name: "garlic", quantity: "2 cloves" },
      { name: "potato", quantity: "2" },
      { name: "carrot", quantity: "2" },
    ],
  },
  {
    title: "Tomato & Basil Soup",
    description: "A silky smooth tomato soup with fresh basil.",
    imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=800&auto=format&fit=crop",
    cookingTime: 30,
    difficulty: Difficulty.EASY,
    categorySlug: "soups",
    instructions: [
      "Sauté onion and garlic in a pot until translucent.",
      "Add chopped tomatoes and cook for 10 minutes.",
      "Pour in water or broth and simmer for 15 minutes.",
      "Blend until smooth using an immersion blender.",
      "Stir in fresh basil and season to taste before serving.",
    ],
    ingredients: [
      { name: "tomato", quantity: "6" },
      { name: "onion", quantity: "1" },
      { name: "garlic", quantity: "2 cloves" },
      { name: "basil", quantity: "handful" },
    ],
  },
  {
    title: "Fresh Garden Salad",
    description: "A crisp, refreshing salad that comes together in minutes.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    cookingTime: 10,
    difficulty: Difficulty.VERY_EASY,
    categorySlug: "salads",
    instructions: [
      "Wash and chop the spinach and tomato.",
      "Thinly slice the onion.",
      "Combine all vegetables in a large bowl.",
      "Drizzle with olive oil and a pinch of salt.",
      "Toss well and serve immediately.",
    ],
    ingredients: [
      { name: "spinach", quantity: "2 cups" },
      { name: "tomato", quantity: "2" },
      { name: "onion", quantity: "half" },
      { name: "cheese", quantity: "30 g" },
    ],
  },
  {
    title: "Chickpea & Potato Salad",
    description: "A filling vegetarian salad with a tangy dressing.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
    cookingTime: 25,
    difficulty: Difficulty.EASY,
    categorySlug: "salads",
    instructions: [
      "Boil the potatoes until fork-tender, then cool and cube them.",
      "Rinse the chickpeas and add them to a large bowl with the potatoes.",
      "Add chopped tomato and onion.",
      "Dress with olive oil, salt, and pepper.",
      "Toss gently and chill before serving.",
    ],
    ingredients: [
      { name: "potato", quantity: "3" },
      { name: "chickpeas", quantity: "1 can" },
      { name: "tomato", quantity: "1" },
      { name: "onion", quantity: "half" },
    ],
  },
  {
    title: "Vegetarian Spinach Pasta",
    description: "A quick vegetarian pasta with wilted spinach and garlic.",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop",
    cookingTime: 20,
    difficulty: Difficulty.EASY,
    categorySlug: "vegetarian",
    instructions: [
      "Cook the pasta according to package instructions.",
      "Sauté garlic in olive oil until fragrant.",
      "Add spinach and cook until wilted.",
      "Toss the drained pasta with the spinach and garlic.",
      "Top with grated cheese and serve.",
    ],
    ingredients: [
      { name: "pasta", quantity: "250 g" },
      { name: "spinach", quantity: "2 cups" },
      { name: "garlic", quantity: "3 cloves" },
      { name: "cheese", quantity: "40 g" },
    ],
  },
  {
    title: "Simple Chocolate Mug Cake",
    description: "A rich chocolate cake ready in 5 minutes, no oven needed.",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
    cookingTime: 5,
    difficulty: Difficulty.VERY_EASY,
    categorySlug: "desserts",
    instructions: [
      "Mix flour, sugar, and cocoa powder in a mug.",
      "Add egg, milk, and melted butter, then stir well.",
      "Microwave on high for 90 seconds.",
      "Let it cool for a minute before digging in.",
    ],
    ingredients: [
      { name: "egg", quantity: "1" },
      { name: "butter", quantity: "1 tbsp" },
      { name: "flour", quantity: "4 tbsp" },
      { name: "sugar", quantity: "4 tbsp" },
    ],
  },
  {
    title: "Baked Cinnamon Apples",
    description: "A cozy dessert of tender baked apples with cinnamon and butter.",
    imageUrl: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=800&auto=format&fit=crop",
    cookingTime: 30,
    difficulty: Difficulty.EASY,
    categorySlug: "desserts",
    instructions: [
      "Preheat the oven to 190°C (375°F).",
      "Core the apples and place them in a baking dish.",
      "Fill the centers with butter, sugar, and cinnamon.",
      "Bake for 25 minutes until soft.",
      "Serve warm on their own or with cream.",
    ],
    ingredients: [
      { name: "apple", quantity: "4" },
      { name: "butter", quantity: "2 tbsp" },
      { name: "sugar", quantity: "3 tbsp" },
      { name: "cinnamon", quantity: "1 tsp" },
    ],
  },
  {
    title: "Cheesy Potato Gratin",
    description: "Layers of thinly sliced potato baked in a creamy cheese sauce.",
    imageUrl: "https://images.unsplash.com/photo-1568161386417-fc12c0a2dc3f?q=80&w=800&auto=format&fit=crop",
    cookingTime: 60,
    difficulty: Difficulty.HARD,
    categorySlug: "main-dishes",
    instructions: [
      "Preheat the oven to 180°C (350°F).",
      "Thinly slice the potatoes and onion.",
      "Layer them in a baking dish, seasoning between layers.",
      "Pour cream over the top and sprinkle with cheese.",
      "Bake covered for 40 minutes, then uncovered for 15 more until golden.",
    ],
    ingredients: [
      { name: "potato", quantity: "5" },
      { name: "onion", quantity: "1" },
      { name: "cheese", quantity: "150 g" },
      { name: "garlic", quantity: "2 cloves" },
    ],
  },
];

async function main() {
  console.log("Seeding categories...");
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
    categoryMap.set(cat.slug, category.id);
  }

  console.log("Seeding recipes...");
  for (const recipe of RECIPES) {
    const categoryId = categoryMap.get(recipe.categorySlug);
    if (!categoryId) continue;

    const existing = await prisma.recipe.findFirst({ where: { title: recipe.title } });
    if (existing) continue;

    await prisma.recipe.create({
      data: {
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        instructions: recipe.instructions.join("\n"),
        categoryId,
        ingredients: {
          create: await Promise.all(
            recipe.ingredients.map(async (ing) => {
              const ingredient = await prisma.ingredient.upsert({
                where: { name: ing.name },
                create: { name: ing.name },
                update: {},
              });
              return { ingredientId: ingredient.id, quantity: ing.quantity };
            })
          ),
        },
      },
    });
  }

  console.log("Seeding demo user...");
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "demo@cookeasy.com" },
    create: {
      name: "Demo User",
      email: "demo@cookeasy.com",
      passwordHash,
      role: Role.USER,
    },
    update: {},
  });

  console.log("Seeding admin user...");
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@cookeasy.com" },
    create: {
      name: "Admin",
      email: "admin@cookeasy.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
    update: { role: Role.ADMIN },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
