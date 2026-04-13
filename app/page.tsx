import Link from "next/link";
import { ArrowRight, BarChart3, Palette, Link2, MousePointerClick, Zap, Shield, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkInBio — Your link in bio, elevated",
  description: "Create your personalized link page in 30 seconds. Share all your important links with one beautiful, trackable page.",
};

const FEATURES = [
  { icon: Link2, title: "Unlimited Links", desc: "Add as many links as you want. No caps, no paywalls.", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: BarChart3, title: "Click Analytics", desc: "See who clicks your links, which device they use, and where they're from.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Palette, title: "5 Beautiful Themes", desc: "Cosmic, Ocean, Sunset, Forest, Midnight — pick the vibe that's yours.", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: MousePointerClick, title: "Drag & Drop", desc: "Rearrange your links instantly with intuitive drag-and-drop.", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Zap, title: "Instant Setup", desc: "Go from zero to live page in under 30 seconds. No technical skills needed.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Shield, title: "Secure & Private", desc: "Your data is yours. Password-protected accounts with full control.", color: "text-orange-400", bg: "bg-orange-500/10" },
];

const STEPS = [
  { n: "01", title: "Create your account", desc: "Sign up free in seconds — just name, email and password." },
  { n: "02", title: "Add your links", desc: "Paste your URLs, pick an icon, and drag to reorder." },
  { n: "03", title: "Share your page", desc: "Copy your unique link and add it to every bio everywhere." },
];

const THEMES_PREVIEW = [
  { name: "Cosmic", from: "#7c3aed", to: "#4338ca" },
  { name: "Ocean", from: "#0891b2", to: "#1d4ed8" },
  { name: "Sunset", from: "#f97316", to: "#db2777" },
  { name: "Forest", from: "#22c55e", to: "#0d9488" },
  { name: "Midnight", from: "#374151", to: "#111827" },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Everything you need to get started",
    features: ["Unlimited links", "5 themes", "Basic analytics", "Custom username"],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/ month",
    desc: "For creators who want more power",
    features: ["Everything in Free", "Advanced analytics", "Custom domain", "Priority support", "Remove branding"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$15",
    period: "/ month",
    desc: "For teams and agencies",
    features: ["Everything in Pro", "Team collaboration", "API access", "White label", "Dedicated support"],
    cta: "Contact sales",
    highlighted: false,
  },
];

// Mock profile card — static demo
function MockProfileCard() {
  const mockLinks = [
    { icon: "💼", label: "My Portfolio" },
    { icon: "📺", label: "YouTube Channel" },
    { icon: "🐦", label: "Twitter / X" },
    { icon: "📸", label: "Instagram" },
    { icon: "✉️", label: "Newsletter" },
  ];

  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 bg-violet-500/20 rounded-3xl blur-3xl scale-110" />

      <div className="relative glass rounded-3xl p-6 w-72 animate-float">
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 mb-4 px-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <div className="flex-1 mx-2 h-5 rounded-md bg-zinc-800/80 flex items-center px-2">
            <span className="text-[9px] text-zinc-500">linkinbio.app/yourname</span>
          </div>
        </div>

        {/* Profile */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 mx-auto mb-2 flex items-center justify-center text-xl font-bold text-white">
            Y
          </div>
          <p className="text-sm font-semibold text-foreground">@yourname</p>
          <p className="text-xs text-zinc-500 mt-0.5">Creator & Designer ✨</p>
        </div>

        {/* Links */}
        <div className="space-y-2">
          {mockLinks.map((l, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-violet-500/8 border border-violet-500/15 px-3 py-2.5 text-xs text-zinc-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span>{l.icon}</span>
              <span className="font-medium">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Click counter badge */}
        <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
          +124 clicks today
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="gradient-text text-xl font-bold flex items-center gap-2">
            <Zap size={20} className="text-violet-400" />
            LinkInBio
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-foreground transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-violet-500 hover:bg-violet-400 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-violet-500/25"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(167,139,250,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.15) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-300 font-medium mb-6">
              <Zap size={12} className="text-violet-400" />
              Free forever — no credit card required
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              Your links,
              <br />
              <span className="gradient-text">one page.</span>
            </h1>

            <p className="text-lg text-zinc-400 mt-6 max-w-lg leading-relaxed">
              Create your personalized link page in 30 seconds. Share all your social profiles, content, and more with a single beautiful, trackable link.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-10">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/30 btn-glow"
              >
                Create your page free <ArrowRight size={20} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-foreground text-sm font-medium transition-colors"
              >
                View demo page →
              </Link>
            </div>

            <p className="text-xs text-zinc-600 mt-4">
              Join 10,000+ creators who share their links with LinkInBio
            </p>
          </div>

          {/* Mock profile */}
          <div className="flex-shrink-0 flex justify-center">
            <MockProfileCard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">Everything you need</h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Powerful features packed into a dead-simple tool. No bloat, no complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="glass rounded-2xl p-6 border border-border hover:border-zinc-700 transition-all duration-200 hover:-translate-y-1 card-hover">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">Up and running in 3 steps</h2>
          </div>

          <div className="space-y-8">
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="flex items-start gap-6">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
                  <span className="text-violet-400 text-sm font-bold">{n}</span>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="absolute ml-7 mt-14 w-px h-8 bg-gradient-to-b from-violet-500/40 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">Beautiful themes</h2>
            <p className="text-zinc-400 mt-4">Pick a colour palette that matches your brand</p>
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            {THEMES_PREVIEW.map((t) => (
              <div key={t.name} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div
                  className="w-20 h-20 rounded-2xl border-2 border-white/10 group-hover:border-white/30 group-hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                />
                <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">Simple, honest pricing</h2>
            <p className="text-zinc-400 mt-4">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map(({ name, price, period, desc, features, cta, highlighted }) => (
              <div
                key={name}
                className={`rounded-2xl border p-7 flex flex-col ${
                  highlighted
                    ? "bg-gradient-to-b from-violet-500/10 to-transparent border-violet-500/40 relative"
                    : "bg-zinc-900 border-border"
                }`}
              >
                {highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">{name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-foreground">{price}</span>
                    <span className="text-zinc-500 text-sm">{period}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-2">{desc}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check size={15} className="text-violet-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`text-center text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 ${
                    highlighted
                      ? "bg-violet-500 hover:bg-violet-400 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-px"
                      : "bg-zinc-800 hover:bg-zinc-700 text-foreground border border-border"
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative glass rounded-3xl p-12 border border-violet-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black gradient-text mb-4">Ready to start?</h2>
              <p className="text-zinc-400 mb-8">Create your free page in under 30 seconds. No credit card needed.</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/30"
              >
                Create your page free <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="gradient-text font-bold flex items-center gap-2">
            <Zap size={16} className="text-violet-400" />
            LinkInBio
          </Link>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} LinkInBio. Built with Next.js & ❤️
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
