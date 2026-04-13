"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MousePointerClick, Smartphone, Monitor, Globe, TrendingUp } from "lucide-react";

const DEVICE_COLORS = ["#a78bfa", "#818cf8", "#38bdf8"];
const RANGES = [
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
];

interface AnalyticsData {
  timelineData: { date: string; clicks: number }[];
  linkData: { name: string; clicks: number }[];
  deviceData: { name: string; value: number }[];
  countryData: { country: string; clicks: number }[];
  stats: { totalClicks: number; totalLinks: number; activeLinks: number; clicksToday: number };
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("30");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/analytics?range=${range}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">Understand how your audience interacts with your links</p>
        </div>
        <div className="flex bg-zinc-900 border border-border rounded-lg p-1 gap-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              id={`range-${r.value}`}
              onClick={() => setRange(r.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${range === r.value ? "bg-violet-500 text-white" : "text-zinc-400 hover:text-foreground"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : data ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total Clicks", value: data.stats.totalClicks, icon: MousePointerClick, color: "text-violet-400" },
              { label: "Today", value: data.stats.clicksToday, icon: TrendingUp, color: "text-green-400" },
              { label: "Active Links", value: data.stats.activeLinks, icon: Globe, color: "text-blue-400" },
              { label: "Total Links", value: data.stats.totalLinks, icon: Globe, color: "text-orange-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <Icon size={24} className={color} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-zinc-500">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Line chart — clicks over time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-400" /> Clicks Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", color: "#fafafa" }} />
                  <Line type="monotone" dataKey="clicks" stroke="#a78bfa" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#a78bfa" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart — clicks per link */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clicks Per Link</CardTitle>
              </CardHeader>
              <CardContent>
                {data.linkData.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-8 text-center">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.linkData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "#71717a", fontSize: 11 }} tickLine={false} axisLine={false} width={90}
                        tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + "…" : v} />
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", color: "#fafafa" }} />
                      <Bar dataKey="clicks" fill="#818cf8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Pie chart — device breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone size={16} className="text-violet-400" /> Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                {data.deviceData.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-8 text-center w-full">No data yet</p>
                ) : (
                  <div className="flex items-center gap-6 w-full">
                    <ResponsiveContainer width="60%" height={180}>
                      <PieChart>
                        <Pie data={data.deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                          {data.deviceData.map((_, i) => (
                            <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", color: "#fafafa" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {data.deviceData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                          <span className="text-zinc-400 capitalize">{d.name}</span>
                          <span className="text-foreground font-semibold ml-auto">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Country table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe size={16} className="text-violet-400" /> Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.countryData.length === 0 ? (
                <p className="text-zinc-500 text-sm">No country data available (requires deployment on Vercel)</p>
              ) : (
                <div className="space-y-2">
                  {data.countryData.map((c, i) => (
                    <div key={c.country} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                      <span className="text-zinc-600 text-sm w-5 text-right">{i + 1}</span>
                      <span className="text-sm text-foreground flex-1">{c.country}</span>
                      <span className="text-sm text-zinc-400">{c.clicks} clicks</span>
                      <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(c.clicks / data.countryData[0].clicks) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
