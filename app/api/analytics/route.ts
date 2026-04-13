import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30";
  const days = parseInt(range, 10);

  const since = new Date();
  since.setDate(since.getDate() - days);

  const userId = session.user.id;

  // Clicks over time (grouped by day)
  const clicksOverTime = await prisma.click.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by date string
  const clicksByDay: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    clicksByDay[d.toISOString().split("T")[0]] = 0;
  }
  clicksOverTime.forEach((c) => {
    const day = c.createdAt.toISOString().split("T")[0];
    if (clicksByDay[day] !== undefined) clicksByDay[day]++;
  });

  const timelineData = Object.entries(clicksByDay).map(([date, clicks]) => ({
    date,
    clicks,
  }));

  // Clicks per link
  const links = await prisma.link.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      _count: { select: { clicks: { where: { createdAt: { gte: since } } } } },
    },
    orderBy: { order: "asc" },
  });

  const linkData = links.map((l) => ({
    name: l.title,
    clicks: l._count.clicks,
  }));

  // Device breakdown
  const deviceClicks = await prisma.click.groupBy({
    by: ["device"],
    where: { userId, createdAt: { gte: since } },
    _count: { device: true },
  });

  const deviceData = deviceClicks.map((d) => ({
    name: d.device || "unknown",
    value: d._count.device,
  }));

  // Top countries
  const countryClicks = await prisma.click.groupBy({
    by: ["country"],
    where: { userId, createdAt: { gte: since }, country: { not: null } },
    _count: { country: true },
    orderBy: { _count: { country: "desc" } },
    take: 10,
  });

  const countryData = countryClicks.map((c) => ({
    country: c.country || "Unknown",
    clicks: c._count.country,
  }));

  // Summary stats
  const totalClicks = await prisma.click.count({ where: { userId, createdAt: { gte: since } } });
  const totalLinks = await prisma.link.count({ where: { userId } });
  const activeLinks = await prisma.link.count({ where: { userId, active: true } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const clicksToday = await prisma.click.count({ where: { userId, createdAt: { gte: today } } });

  return NextResponse.json({
    timelineData,
    linkData,
    deviceData,
    countryData,
    stats: { totalClicks, totalLinks, activeLinks, clicksToday },
  });
}
