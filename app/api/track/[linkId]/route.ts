import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDeviceType } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params;

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { user: { select: { id: true } } },
  });

  if (!link || !link.active) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // Parse device from User-Agent
  const userAgent = req.headers.get("user-agent") || "";
  const device = getDeviceType(userAgent);

  // Get country from Vercel geo headers (works in production on Vercel)
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;

  // Record click asynchronously (don't block redirect)
  prisma.click
    .create({
      data: {
        linkId: link.id,
        userId: link.user.id,
        device,
        country,
      },
    })
    .catch((err: unknown) => console.error("[TRACK_CLICK]", err));

  return NextResponse.redirect(link.url);
}
