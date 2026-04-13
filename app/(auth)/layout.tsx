import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your LinkInBio account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 items-center justify-center p-12">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(167,139,250,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-6">
          {/* Mock profile card */}
          <div className="glass rounded-2xl p-6 max-w-xs mx-auto animate-float">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 mx-auto mb-4" />
            <p className="font-semibold text-foreground">@yourname</p>
            <p className="text-xs text-zinc-400 mb-4">Designer & Creator</p>
            {["My Portfolio", "YouTube Channel", "Twitter", "Newsletter"].map(
              (label, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 mb-2 text-sm text-zinc-300 hover:bg-white/10 transition-colors"
                >
                  {label}
                </div>
              )
            )}
          </div>

          <div>
            <Link href="/" className="gradient-text text-2xl font-bold">
              LinkInBio
            </Link>
            <p className="text-zinc-400 text-sm mt-2">
              Your link in bio, elevated.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="gradient-text text-2xl font-bold">
              LinkInBio
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
