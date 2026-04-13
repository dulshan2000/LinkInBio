"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import {
  Plus, GripVertical, Pencil, Trash2, Eye, EyeOff,
  Link2, ExternalLink, X, Check, Loader2,
} from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
  active: boolean;
  order: number;
}

const ICONS = ["🔗", "🎵", "📸", "🎮", "💼", "✉️", "🌐", "📺", "🐦", "💬", "📱", "🛒", "📝", "❤️", "⭐"];

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", url: "", icon: "🔗" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim()) { setFormError("Title is required"); return; }
    if (!form.url.trim()) { setFormError("URL is required"); return; }

    let url = form.url;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    setSaving("new");
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, url }),
    });

    if (res.ok) {
      const newLink = await res.json();
      setLinks((prev) => [...prev, newLink]);
      setForm({ title: "", url: "", icon: "🔗" });
      setShowForm(false);
      toast({ title: "Link added", variant: "success" });
    } else {
      const d = await res.json();
      setFormError(d.error || "Failed to add link");
    }
    setSaving(null);
  }

  async function handleToggle(link: Link) {
    setSaving(link.id);
    const res = await fetch("/api/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, active: !link.active }),
    });
    if (res.ok) {
      setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, active: !l.active } : l));
    }
    setSaving(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this link?")) return;
    setSaving(id);
    const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Link deleted", variant: "destructive" });
    }
    setSaving(null);
  }

  async function handleSaveEdit(link: Link) {
    setSaving(link.id);
    const res = await fetch("/api/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id, title: link.title, url: link.url, icon: link.icon }),
    });
    if (res.ok) {
      toast({ title: "Link updated", variant: "success" });
    }
    setEditingId(null);
    setSaving(null);
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(links);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const withOrder = reordered.map((l, i) => ({ ...l, order: i }));
    setLinks(withOrder);

    // Save new order
    await Promise.all(
      withOrder.map((l) =>
        fetch("/api/links", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: l.id, order: l.order }),
        })
      )
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Links</h1>
          <p className="text-zinc-400 text-sm mt-1">{links.length} links · {links.filter((l) => l.active).length} active</p>
        </div>
        <Button id="add-link-btn" onClick={() => { setShowForm(true); setEditingId(null); }} variant="glow" className="gap-2">
          <Plus size={16} /> Add Link
        </Button>
      </div>

      {/* Add link form */}
      {showForm && (
        <Card className="border-violet-500/30 animate-fade-in">
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-foreground">New Link</h3>
                <button type="button" onClick={() => setShowForm(false)} className="ml-auto text-zinc-500 hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              {/* Icon picker */}
              <div>
                <p className="text-xs text-zinc-400 mb-2">Icon</p>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((ic) => (
                    <button
                      key={ic} type="button"
                      onClick={() => setForm({ ...form, icon: ic })}
                      className={`w-9 h-9 rounded-lg text-lg transition-all ${form.icon === ic ? "bg-violet-500/20 border border-violet-500" : "bg-zinc-800 border border-transparent hover:border-zinc-600"}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="new-link-title"
                  label="Title"
                  placeholder="My Portfolio"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  error={formError && !form.title ? formError : undefined}
                />
                <Input
                  id="new-link-url"
                  label="URL"
                  placeholder="https://yoursite.com"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  error={formError && form.title ? formError : undefined}
                />
              </div>

              {formError && <p className="text-xs text-red-400">{formError}</p>}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button id="save-link-btn" type="submit" size="sm" loading={saving === "new"}>
                  <Check size={14} /> Save Link
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Link list */}
      {links.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <Link2 size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No links yet</p>
          <p className="text-sm mt-1">Add your first link to get started</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`rounded-xl border transition-all duration-150 ${
                          snapshot.isDragging
                            ? "border-violet-500/50 bg-zinc-800 shadow-xl shadow-violet-500/10 scale-[1.01]"
                            : "border-border bg-zinc-900 hover:border-zinc-700"
                        } ${!link.active ? "opacity-50" : ""}`}
                      >
                        {editingId === link.id ? (
                          <div className="p-4 space-y-3">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {ICONS.map((ic) => (
                                <button
                                  key={ic} type="button"
                                  onClick={() => setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, icon: ic } : l))}
                                  className={`w-8 h-8 rounded-lg text-base transition-all ${link.icon === ic ? "bg-violet-500/20 border border-violet-500" : "bg-zinc-800 border border-transparent hover:border-zinc-600"}`}
                                >
                                  {ic}
                                </button>
                              ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                className="h-9 rounded-lg border border-border bg-zinc-800 px-3 text-sm focus:outline-none focus:border-violet-500"
                                value={link.title}
                                onChange={(e) => setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, title: e.target.value } : l))}
                              />
                              <input
                                className="h-9 rounded-lg border border-border bg-zinc-800 px-3 text-sm focus:outline-none focus:border-violet-500"
                                value={link.url}
                                onChange={(e) => setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, url: e.target.value } : l))}
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                              <Button size="sm" loading={saving === link.id} onClick={() => handleSaveEdit(link)}>
                                <Check size={14} /> Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-4">
                            <div {...provided.dragHandleProps} className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing transition-colors">
                              <GripVertical size={18} />
                            </div>
                            <span className="text-xl shrink-0">{link.icon || "🔗"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                              <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <a href={link.url} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                                <ExternalLink size={15} />
                              </a>
                              <button id={`edit-${link.id}`} onClick={() => setEditingId(link.id)}
                                className="p-1.5 rounded-lg text-zinc-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors">
                                <Pencil size={15} />
                              </button>
                              <button id={`toggle-${link.id}`} onClick={() => handleToggle(link)} disabled={saving === link.id}
                                className={`p-1.5 rounded-lg transition-colors ${link.active ? "text-green-400 hover:text-zinc-400 hover:bg-zinc-800" : "text-zinc-600 hover:text-green-400 hover:bg-green-500/10"}`}>
                                {saving === link.id ? <Loader2 size={15} className="animate-spin" /> : link.active ? <Eye size={15} /> : <EyeOff size={15} />}
                              </button>
                              <button id={`delete-${link.id}`} onClick={() => handleDelete(link.id)} disabled={saving === link.id}
                                className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
