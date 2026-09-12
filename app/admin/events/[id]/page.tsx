"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Tag,
  FileText
} from "lucide-react";

export default function AdminEventEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: isNew ? "" : id,
    title: "",
    slug: "",
    description: "",
    date: "",
    location: "",
    status: "upcoming",
    category: "Conference",
    coverImage: "",
  });

  useEffect(() => {
    if (!isNew) {
      async function fetchEvent() {
        try {
          const res = await fetch("/api/admin/events");
          const data = await res.json();
          if (data.success && Array.isArray(data.events)) {
            const found = data.events.find((e: any) => e.id === id || e.slug === id);
            if (found) {
              setForm({
                id: found.id,
                title: found.title || "",
                slug: found.slug || "",
                description: found.description || "",
                date: found.date || "",
                location: found.location || "",
                status: found.status || "upcoming",
                category: found.category || "Conference",
                coverImage: found.coverImage || "",
              });
            }
          }
        } catch (err) {
          console.error("Failed to load event:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchEvent();
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      alert("Title and slug are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("Event saved successfully!");
        router.push("/admin/events");
      } else {
        alert(data.error || "Failed to save event.");
      }
    } catch (err: any) {
      alert(err.message || "Error saving event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
        <Loader2 size={18} className="animate-spin text-[#0066FF]" />
        <span>Loading event details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-[#0066FF]"
      >
        <ArrowLeft size={14} /> Back to Events Management
      </Link>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div>
          <div className="text-xs font-mono text-[#0066FF] dark:text-[#00B8F0] uppercase font-bold tracking-wider">
            {isNew ? "CREATE EVENT" : "EDIT EVENT"}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isNew ? "Add New Community Event" : `Edit Event: ${form.title}`}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI Frontier 2026 Summit"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                const slug = title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)+/g, "");
                setForm({ ...form, title, slug: form.slug || slug });
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                placeholder="ai-frontier-2026"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Category
              </label>
              <input
                type="text"
                placeholder="Conference, Workshop, Meetup"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Date &amp; Time
              </label>
              <input
                type="text"
                placeholder="e.g. August 23, 2026"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="upcoming">Upcoming</option>
                <option value="monthly">Monthly Series</option>
                <option value="completed">Completed / Past</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Location / Venue
            </label>
            <input
              type="text"
              placeholder="e.g. Indore, India & Virtual Stream"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the event, agenda, speakers..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Event...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Event Document</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
