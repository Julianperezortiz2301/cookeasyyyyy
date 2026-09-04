import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recipeSchema } from "@/lib/validations";
import { normalizeIngredient } from "@/lib/ingredients";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = recipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data." },
        { status: 400 }
      );
    }

    const { ingredients, ...data } = parsed.data;

    const recipe = await prisma.recipe.create({
      data: {
        ...data,
        authorId: session.user.id,
        ingredients: {
          create: await Promise.all(
            ingredients.map(async (ing) => {
              const name = normalizeIngredient(ing.name);
              const ingredient = await prisma.ingredient.upsert({
                where: { name },
                create: { name },
                update: {},
              });
              return { ingredientId: ingredient.id, quantity: ing.quantity };
            })
          ),
        },
      },
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
