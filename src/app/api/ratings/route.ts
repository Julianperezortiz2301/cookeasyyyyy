import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const recipeId = typeof body?.recipeId === "string" ? body.recipeId : "";
    const value = Number(body?.value);
    const comment = typeof body?.comment === "string" && body.comment.trim() ? body.comment.trim() : null;

    if (!recipeId) {
      return NextResponse.json({ error: "Missing recipe." }, { status: 400 });
    }
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    const rating = await prisma.rating.upsert({
      where: { userId_recipeId: { userId: session.user.id, recipeId } },
      create: { userId: session.user.id, recipeId, value, comment },
      update: { value, comment },
    });

    return NextResponse.json({ rating }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
