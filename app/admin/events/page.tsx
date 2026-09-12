"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Loader2,
  Sparkles,
  Search,
  ExternalLink
} from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  status: "upcoming" | "monthly" | "completed";
  category?: string;
  coverImage?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (e) {
      console.error("Failed to load events:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert(data.error || "Failed to delete event.");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting event.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="text-xs font-mono text-[#0066FF] dark:text-[#00B8F0] uppercase font-bold tracking-wider">
            COMMUNITY CMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Events &amp; Summit Management
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            Create, update, and manage upcoming AI events, summits, and meetups.
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Event</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin text-[#0066FF]" />
          <span>Loading events database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-400">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                      evt.status === "upcoming"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : evt.status === "monthly"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {evt.status}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    Slug: /{evt.slug}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono line-clamp-2">
                  {evt.description}
                </p>

                <div className="space-y-1 font-mono text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[#0066FF]" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-rose-500" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 font-mono text-xs">
                <Link
                  href={`/community/events/${evt.slug}`}
                  target="_blank"
                  className="text-slate-500 hover:text-[#0066FF] flex items-center gap-1"
                >
                  <ExternalLink size={13} /> View Page
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/events/${evt.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1"
                  >
                    <Edit3 size={13} /> Edit
                  </Link>

                  <button
                    disabled={deletingId === evt.id}
                    onClick={() => handleDelete(evt.id)}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
