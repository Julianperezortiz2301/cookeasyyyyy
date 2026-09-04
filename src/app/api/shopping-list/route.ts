import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeIngredient } from "@/lib/ingredients";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const rawName = typeof body?.name === "string" ? body.name : "";
    if (!rawName.trim()) {
      return NextResponse.json({ error: "Please provide a food name." }, { status: 400 });
    }
    const note = typeof body?.note === "string" && body.note.trim() ? body.note.trim() : null;

    const name = normalizeIngredient(rawName);
    const ingredient = await prisma.ingredient.upsert({
      where: { name },
      create: { name },
      update: {},
    });

    const item = await prisma.shoppingListItem.upsert({
      where: { userId_ingredientId: { userId: session.user.id, ingredientId: ingredient.id } },
      create: { userId: session.user.id, ingredientId: ingredient.id, note },
      update: { checked: false, ...(note ? { note } : {}) },
      include: { ingredient: true },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
