import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { recipeId: true },
    });

    return NextResponse.json({ recipeIds: favorites.map((f) => f.recipeId) });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const recipeId = body?.recipeId as string | undefined;
    if (!recipeId) {
      return NextResponse.json({ error: "recipeId is required." }, { status: 400 });
    }

    const favorite = await prisma.favorite.upsert({
      where: { userId_recipeId: { userId: session.user.id, recipeId } },
      create: { userId: session.user.id, recipeId },
      update: {},
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
