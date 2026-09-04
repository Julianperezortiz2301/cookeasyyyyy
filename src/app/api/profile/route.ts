import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();

    const existing = await prisma.user.findFirst({
      where: { email, id: { not: session.user.id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered to another account." },
        { status: 409 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        email,
        avatarUrl: parsed.data.avatarUrl || null,
      },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
