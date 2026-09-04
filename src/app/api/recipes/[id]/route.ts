import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recipeSchema } from "@/lib/validations";
import { normalizeIngredient } from "@/lib/ingredients";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.recipe.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const recipe = await prisma.$transaction(async (tx) => {
      await tx.recipeIngredient.deleteMany({ where: { recipeId: params.id } });

      const ingredientRows = await Promise.all(
        ingredients.map(async (ing) => {
          const name = normalizeIngredient(ing.name);
          const ingredient = await tx.ingredient.upsert({
            where: { name },
            create: { name },
            update: {},
          });
          return { ingredientId: ingredient.id, quantity: ing.quantity };
        })
      );

      return tx.recipe.update({
        where: { id: params.id },
        data: {
          ...data,
          ingredients: { create: ingredientRows },
        },
      });
    });

    return NextResponse.json({ recipe });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.recipe.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }
    if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.recipe.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
