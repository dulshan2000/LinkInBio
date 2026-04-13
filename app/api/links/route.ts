import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isValidUrl } from "@/lib/utils";

const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  url: z.string().refine(isValidUrl, "Please enter a valid URL"),
  icon: z.string().optional(),
  active: z.boolean().optional(),
  order: z.number().optional(),
});

type LinkErrors = { issues?: Array<{ message: string }>; errors?: Array<{ message: string }> };

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const count = await prisma.link.count({ where: { userId: session.user.id } });

  const link = await prisma.link.create({
    data: {
      ...parsed.data,
      order: parsed.data.order ?? count,
      userId: session.user.id,
    },
  });
  return NextResponse.json(link, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "Link ID required" }, { status: 400 });

  // Verify ownership
  const link = await prisma.link.findFirst({ where: { id, userId: session.user.id } });
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  const updated = await prisma.link.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Link ID required" }, { status: 400 });

  const link = await prisma.link.findFirst({ where: { id, userId: session.user.id } });
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  await prisma.link.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
