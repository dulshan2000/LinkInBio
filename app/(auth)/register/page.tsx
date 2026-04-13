"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, ArrowRight, CheckCircle, UserCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
        setErrors({ general: "Guest login failed. Try again." });
        setGuestLoading(false);
      }
    } catch {
      setErrors({ general: "An error occurred" });
      setGuestLoading(false);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ general: data.error || "Something went wrong" });
      setLoading(false);
      return;
    }

    // Auto sign in after registration
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  }

  const passwordStrength = form.password.length >= 10 ? "strong" : form.password.length >= 6 ? "good" : form.password.length > 0 ? "weak" : "";

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create your page</h1>
        <p className="text-zinc-400 mt-2">Free forever. No credit card required.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
        <Input
          id="register-name"
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          icon={<User size={16} />}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
          autoComplete="name"
        />

        <Input
          id="register-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          required
          autoComplete="email"
        />

        <div className="space-y-1">
          <Input
            id="register-password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            icon={<Lock size={16} />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            required
            autoComplete="new-password"
          />
          {passwordStrength && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength === "strong" ? "w-full bg-green-500" :
                    passwordStrength === "good" ? "w-2/3 bg-yellow-500" : "w-1/3 bg-red-500"
                  }`}
                />
              </div>
              <span className={`text-xs ${
                passwordStrength === "strong" ? "text-green-400" :
                passwordStrength === "good" ? "text-yellow-400" : "text-red-400"
              }`}>
                {passwordStrength}
              </span>
            </div>
          )}
        </div>

        {errors.general && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {errors.general}
          </div>
        )}

        <Button
          id="register-submit"
          type="submit"
          variant="glow"
          size="lg"
          className="w-full mt-2"
          loading={loading && !guestLoading}
          disabled={guestLoading}
        >
          Create free account <ArrowRight size={16} />
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

      {/* Perks */}
      <div className="mt-6 space-y-2">
        {["Free custom link page", "Unlimited links", "Click analytics"].map((perk) => (
          <div key={perk} className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle size={12} className="text-violet-500" />
            {perk}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-zinc-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
