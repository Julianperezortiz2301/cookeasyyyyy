export interface RecipeCardData {
  id: string;
  title: string;
  imageUrl: string;
  cookingTime: number;
  difficulty: string;
  category?: { name: string; slug: string } | null;
  matchPercent?: number;
  avgRating?: number;
  ratingCount?: number;
}
