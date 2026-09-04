import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { normalizeIngredient } from "@/lib/ingredients";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const rawName = typeof body?.name === "string" ? body.name : "";
    if (!rawName.trim()) {
      return NextResponse.json({ error: "Please provide a food name." }, { status: 400 });
    }

    const name = normalizeIngredient(rawName);

    const ingredient = await prisma.ingredient.upsert({
      where: { name },
      create: { name },
      update: {},
    });

    return NextResponse.json({ ingredient }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
