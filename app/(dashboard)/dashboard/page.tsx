import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MousePointerClick, Link2, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardData(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalClicks,
    clicksToday,
    totalLinks,
    activeLinks,
    recentClicks,
    topLink,
  ] = await Promise.all([
    prisma.click.count({ where: { userId } }),
    prisma.click.count({ where: { userId, createdAt: { gte: today } } }),
    prisma.link.count({ where: { userId } }),
    prisma.link.count({ where: { userId, active: true } }),
    prisma.click.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { link: { select: { title: true } } },
    }),
    prisma.link.findFirst({
      where: { userId },
      orderBy: { clicks: { _count: "desc" } },
      include: { _count: { select: { clicks: true } } },
    }),
  ]);

  return { totalClicks, clicksToday, totalLinks, activeLinks, recentClicks, topLink };
}

const stats = [
  { label: "Total Clicks", key: "totalClicks", icon: MousePointerClick, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Clicks Today", key: "clicksToday", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Total Links", key: "totalLinks", icon: Link2, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Active Links", key: "activeLinks", icon: Eye, color: "text-orange-400", bg: "bg-orange-500/10" },
] as const;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getDashboardData(session.user.id);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
          <span className="gradient-text">{session.user.name?.split(" ")[0] || "there"}</span> 👋
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">Here&apos;s how your page is performing</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, key, icon: Icon, color, bg }) => (
          <Card key={key} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{label}</p>
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon size={16} className={color} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {data[key as keyof typeof data] as number}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performing link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Link</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topLink ? (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                <div className="p-3 rounded-lg bg-violet-500/10">
                  <TrendingUp size={20} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{data.topLink.title}</p>
                  <p className="text-xs text-zinc-500">{data.topLink._count.clicks} total clicks</p>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">No links yet. <a href="/links" className="text-violet-400 hover:underline">Add your first link →</a></p>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentClicks.length === 0 ? (
              <p className="text-zinc-500 text-sm">No clicks recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {data.recentClicks.map((click) => (
                  <div key={click.id} className="flex items-center gap-3 py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300 flex-1 truncate">{click.link.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {click.device && (
                        <span className="text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded capitalize">
                          {click.device}
                        </span>
                      )}
                      <span className="text-xs text-zinc-600">{formatDate(click.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
