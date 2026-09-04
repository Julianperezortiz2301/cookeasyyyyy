import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipeCount = await prisma.recipe.count({ where: { categoryId: params.id } });
    if (recipeCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete a category that still has recipes." },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
