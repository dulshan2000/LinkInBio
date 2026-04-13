import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const THEME_STYLES: Record<string, { bg: string; button: string; text: string; subtext: string }> = {
  default: {
    bg: "bg-gradient-to-br from-violet-950 via-zinc-950 to-indigo-950",
    button: "bg-violet-500/10 border border-violet-500/20 text-violet-100 hover:bg-violet-500/20",
    text: "text-white",
    subtext: "text-violet-200",
  },
  ocean: {
    bg: "bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950",
    button: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 hover:bg-cyan-500/20",
    text: "text-white",
    subtext: "text-cyan-200",
  },
  sunset: {
    bg: "bg-gradient-to-br from-orange-950 via-rose-950 to-pink-950",
    button: "bg-orange-500/10 border border-orange-500/20 text-orange-100 hover:bg-orange-500/20",
    text: "text-white",
    subtext: "text-orange-200",
  },
  forest: {
    bg: "bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950",
    button: "bg-green-500/10 border border-green-500/20 text-green-100 hover:bg-green-500/20",
    text: "text-white",
    subtext: "text-green-200",
  },
  midnight: {
    bg: "bg-gradient-to-br from-gray-950 via-zinc-950 to-slate-900",
    button: "bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10",
    text: "text-white",
    subtext: "text-gray-300",
  },
};

type LinkItem = { id: string; icon: string | null; title: string };

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return { title: "Not found" };
  return {
    title: `${user.name || user.username} | LinkInBio`,
    description: user.bio || `Check out ${user.name ?? user.username}'s links on LinkInBio`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!user) notFound();

  const theme = THEME_STYLES[user!.theme] || THEME_STYLES.default;

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col items-center px-4 py-16`}>
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        {/* Avatar & info */}
        <div className="text-center space-y-3">
          {user!.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user!.image}
              alt={user!.name || user!.username}
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-white/20 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 mx-auto flex items-center justify-center text-2xl font-bold text-white shadow-xl">
              {(user!.name || user!.username)[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className={`text-xl font-bold ${theme.text}`}>{user!.name || user!.username}</h1>
            <p className={`text-sm ${theme.subtext} opacity-80`}>@{user!.username}</p>
          </div>
          {user!.bio && (
            <p className={`text-sm ${theme.subtext} opacity-70 max-w-xs mx-auto leading-relaxed`}>{user!.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {user!.links.length === 0 ? (
            <p className="text-white/40 text-center text-sm">No links yet</p>
          ) : (
            user!.links.map((link: LinkItem) => (
              <a
                key={link.id}
                href={`/api/track/${link.id}`}
                rel="noopener noreferrer"
                className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl backdrop-blur-sm transition-all duration-200 ${theme.button} scale-100 hover:scale-[1.02] hover:shadow-lg group`}
              >
                <span className="text-xl shrink-0">{link.icon || "🔗"}</span>
                <span className="flex-1 font-medium text-sm">{link.title}</span>
                <ExternalLink size={14} className="opacity-40 group-hover:opacity-70 transition-opacity" />
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Powered by <span className="font-semibold">LinkInBio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
