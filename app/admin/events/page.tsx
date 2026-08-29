"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Trash2, MapPin, Users, Ticket, CheckCircle2, RefreshCw } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "AI Frontier 2026 Summit",
    slug: "ai-frontier-2026",
    type: "Conference",
    date: "Sunday, August 23, 2026",
    location: "Indore, India / Hybrid",
    capacity: 250,
    entryFee: 499,
    status: "upcoming"
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Mock / Firestore sync
      setEvents([
        {
          id: "ai-frontier-2026",
          title: "AI Frontier 2026: The Production AI Summit",
          slug: "ai-frontier-2026",
          type: "Annual Summit",
          date: "August 23, 2026",
          location: "Indore, India / Hybrid",
          capacity: 250,
          registered: 120,
          status: "upcoming"
        },
        {
          id: "rag-agent-meetup-01",
          title: "Enterprise RAG & LangGraph Hands-on",
          slug: "rag-agent-meetup-01",
          type: "Developer Meetup",
          date: "September 15, 2026",
          location: "Virtual / Google Meet",
          capacity: 500,
          registered: 215,
          status: "upcoming"
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-[#00B8F0] uppercase font-bold">EVENT MANAGEMENT</div>
          <h1 className="text-2xl font-bold text-white">Conferences, Summits &amp; Meetups</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={15} /> Create Event
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-[#0B1524] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070E1B] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
            <tr>
              <th className="p-4">Event Title</th>
              <th className="p-4">Date &amp; Venue</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="font-bold text-white text-sm">{e.title}</div>
                  <div className="text-slate-400 font-mono text-[11px]">/{e.slug}</div>
                </td>
                <td className="p-4 text-slate-300 font-mono">
                  <div>{e.date}</div>
                  <div className="text-slate-500 text-[11px]">{e.location}</div>
                </td>
                <td className="p-4 font-mono">
                  <span className="text-[#00B8F0] font-bold">{e.registered}</span> / {e.capacity}
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                    {e.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Edit size={15} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1524] border border-white/15 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Create New Event</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Venue / Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
