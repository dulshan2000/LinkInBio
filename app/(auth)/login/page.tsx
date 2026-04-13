"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, UserCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleGuest() {
    setGuestLoading(true);
    const uuid = crypto.randomUUID().slice(0, 8);
    const guestForm = {
      name: "Guest User",
      email: `guest_${uuid}@guest.linkinbio.app`,
      password: crypto.randomUUID(),
    };

    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestForm),
      });
      const result = await signIn("credentials", {
        email: guestForm.email,
        password: guestForm.password,
        redirect: false,
      });

      if (!result?.error) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Guest login failed. Try again.");
        setGuestLoading(false);
      }
    } catch {
      setError("An error occurred");
      setGuestLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="text-zinc-400 mt-2">Sign in to manage your links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
        <Input
          id="login-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
        />

        <div className="space-y-1">
          <Input
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock size={16} />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button
          id="login-submit"
          type="submit"
          variant="glow"
          size="lg"
          className="w-full mt-2"
          loading={loading && !guestLoading}
          disabled={guestLoading}
        >
          Sign in <ArrowRight size={16} />
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-zinc-500 uppercase tracking-wider font-medium">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full border-zinc-800 hover:bg-zinc-900 border"
        onClick={handleGuest}
        loading={guestLoading}
        disabled={loading}
      >
        <UserCircle2 size={16} className="mr-2 text-zinc-400" /> Continue as Guest
      </Button>

      <p className="text-center text-sm text-zinc-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
}
