import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid image URL."),
  cookingTime: z.coerce.number().int().min(1, "Cooking time must be at least 1 minute."),
  difficulty: z.enum(["VERY_EASY", "EASY", "MEDIUM", "HARD"]),
  instructions: z.string().min(10, "Instructions must be at least 10 characters long."),
  categoryId: z.string().min(1, "Please choose a category."),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.string().optional(),
      })
    )
    .min(1, "Add at least one ingredient."),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters long."),
  });

export const CATEGORY_ICONS = ["Zap", "UtensilsCrossed", "Leaf", "Soup", "Salad", "Cookie"] as const;
export const CATEGORY_COLORS = ["yellow", "orange", "green", "blue", "pink", "purple"] as const;

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  icon: z.enum(CATEGORY_ICONS),
  color: z.enum(CATEGORY_COLORS),
});
