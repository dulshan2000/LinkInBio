"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { Save, User, AtSign, FileText, Palette, Globe } from "lucide-react";

const THEMES = [
  { id: "default", name: "Cosmic", from: "from-violet-600", to: "to-indigo-600", preview: "#7c3aed" },
  { id: "ocean", name: "Ocean", from: "from-cyan-500", to: "to-blue-600", preview: "#0891b2" },
  { id: "sunset", name: "Sunset", from: "from-orange-500", to: "to-pink-600", preview: "#f97316" },
  { id: "forest", name: "Forest", from: "from-green-500", to: "to-emerald-700", preview: "#22c55e" },
  { id: "midnight", name: "Midnight", from: "from-gray-700", to: "to-zinc-900", preview: "#374151" },
];

interface UserProfile {
  name: string;
  bio: string;
  username: string;
  image: string;
  theme: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({ name: "", bio: "", username: "", image: "", theme: "default" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        setProfile({
          name: data.name || "",
          bio: data.bio || "",
          username: data.username || "",
          image: data.image || "",
          theme: data.theme || "default",
        });
        setLoading(false);
      });
  }, []);

  function validate() {
    const e: Record<string, string> = {};
    if (profile.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[a-z0-9_-]{3,30}$/.test(profile.username)) e.username = "3-30 chars, lowercase letters, numbers, underscores, hyphens only";
    if (profile.bio.length > 160) e.bio = "Bio must be 160 characters or less";
    if (profile.image && !/^https?:\/\//.test(profile.image)) e.image = "Enter a valid URL";
    return e;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setErrors({});
    setSaving(true);

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast({ title: data.error || "Failed to save", variant: "destructive" });
    } else {
      toast({ title: "Profile saved", description: "Changes applied successfully", variant: "success" });
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="skeleton h-8 w-48 rounded" />
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your profile and page appearance</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6" id="settings-form">
        {/* Profile info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User size={16} className="text-violet-400" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="settings-name"
              label="Display name"
              placeholder="Jane Smith"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              error={errors.name}
              icon={<User size={14} />}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300" htmlFor="settings-bio">
                Bio <span className="text-zinc-600 font-normal">({profile.bio.length}/160)</span>
              </label>
              <textarea
                id="settings-bio"
                className={`w-full rounded-lg border px-3 py-2 text-sm bg-zinc-900 text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none transition-all ${errors.bio ? "border-red-500" : "border-border"}`}
                placeholder="A short bio shown on your public page..."
                rows={3}
                maxLength={160}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
              {errors.bio && <p className="text-xs text-red-400">{errors.bio}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Username & Avatar URL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AtSign size={16} className="text-violet-400" /> Page Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="settings-username"
              label="Username"
              placeholder="yourname"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase() })}
              error={errors.username}
              icon={<AtSign size={14} />}
            />
            {profile.username && (
              <p className="text-xs text-zinc-500">
                Your page: <span className="text-violet-400">linkinbio.app/{profile.username}</span>
              </p>
            )}

            <Input
              id="settings-avatar"
              label="Avatar URL"
              placeholder="https://example.com/avatar.jpg"
              value={profile.image}
              onChange={(e) => setProfile({ ...profile, image: e.target.value })}
              error={errors.image}
              icon={<Globe size={14} />}
            />
            {profile.image && !errors.image && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.image} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <p className="text-xs text-zinc-500">Avatar preview</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette size={16} className="text-violet-400" /> Page Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  id={`theme-${theme.id}`}
                  onClick={() => setProfile({ ...profile, theme: theme.id })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 ${
                    profile.theme === theme.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-border hover:border-zinc-600 bg-zinc-900"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.from} ${theme.to}`} />
                  <span className="text-xs text-zinc-400">{theme.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button id="save-settings-btn" type="submit" variant="glow" size="lg" loading={saving} className="w-full sm:w-auto">
          <Save size={16} /> Save Changes
        </Button>
      </form>
    </div>
  );
}
