"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
  Pin,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  MessageCircle,
  Tag,
  ShieldAlert,
  Send,
  X
} from "lucide-react";

export default function AdminDiscussionsPage() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All");

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newChannel, setNewChannel] = useState("announcements");
  const [newTags, setNewTags] = useState("Official, Cohort-1, Important");
  const [newIsPinned, setNewIsPinned] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [msg, setMsg] = useState("");

  // Comments view modal
  const [viewingCommentsPost, setViewingCommentsPost] = useState<any | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const loadDiscussions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/discussions");
      const data = await res.json();
      if (data.success) {
        setDiscussions(data.discussions || []);
      }
    } catch (e) {
      console.error("Error loading discussions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscussions();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsPublishing(true);
    setMsg("");

    try {
      const tagsArray = newTags.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/admin/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          channel: newChannel,
          tags: tagsArray,
          isPinned: newIsPinned,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg("Discussion published successfully!");
        setShowCreateModal(false);
        setNewTitle("");
        setNewContent("");
        loadDiscussions();
      } else {
        setMsg(data.error || "Failed to publish.");
      }
    } catch (err: any) {
      setMsg(err.message || "Failed to publish.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this discussion thread?")) return;

    try {
      const res = await fetch(`/api/admin/discussions?discussionId=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDiscussions((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      console.error("Delete discussion error:", e);
    }
  };

  const handleDeleteComment = async (discussionId: string, commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`/api/admin/discussions?discussionId=${discussionId}&commentId=${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        // Update local viewing comments
        if (viewingCommentsPost && viewingCommentsPost.id === discussionId) {
          const updated = (viewingCommentsPost.commentsList || []).filter((c: any) => c.id !== commentId);
          setViewingCommentsPost({ ...viewingCommentsPost, commentsList: updated, replies: updated.length });
        }
        loadDiscussions();
      }
    } catch (e) {
      console.error("Delete comment error:", e);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    try {
      await fetch("/api/admin/discussions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionId: id,
          isPinned: !currentPin,
        }),
      });
      loadDiscussions();
    } catch (e) {
      console.error("Toggle pin error:", e);
    }
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesChannel = selectedChannel === "All" || d.channel === selectedChannel;
    const matchesSearch =
      searchQuery === "" ||
      (d.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.author?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-8 font-mono text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-[#0066FF] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
            <MessageSquare size={14} /> COMMUNITY FORUM MODERATION &amp; ANNOUNCEMENTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
            Discussions &amp; Comment Moderation
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Create official architectural discussions, pin guidelines, and remove spam or abusive comments across threads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} /> Create Official Thread
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-[#0066FF] font-bold">
          {msg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search discussion title, author, text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Channels</option>
            <option value="announcements">Announcements</option>
            <option value="general">General</option>
            <option value="ai-agents">AI &amp; Agents</option>
            <option value="backend">Backend &amp; Systems</option>
            <option value="architecture">System Design</option>
            <option value="showcase">Showcase Demos</option>
          </select>
        </div>
      </div>

      {/* Discussions Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#0066FF]" />
            Loading discussion threads...
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No discussion threads found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4">Title &amp; Channel</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Comments</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDiscussions.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 font-sans line-clamp-1">{d.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] text-[10px] font-bold">
                          #{d.channel || "general"}
                        </span>
                        {d.isPinned && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1">
                            <Pin size={10} /> PINNED
                          </span>
                        )}
                        {d.isOfficial && (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                            OFFICIAL
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-sans">{d.author?.name || "Builder"}</div>
                      <div className="text-[10px] text-slate-500">{d.author?.handle || "@member"}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setViewingCommentsPost(d)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle size={12} />
                        <span>{d.commentsList?.length || d.replies || 0} Replies</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN") : "Recent"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePin(d.id, Boolean(d.isPinned))}
                          title={d.isPinned ? "Unpin thread" : "Pin thread to top"}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            d.isPinned ? "bg-amber-50 text-amber-700 border-amber-300" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <Pin size={13} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(d.id)}
                          title="Delete thread"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Official Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-sans">Create Official Discussion Thread</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Thread Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cohort 1 Sprint 2 Milestones & Latency SLA Target"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="announcements">#announcements</option>
                    <option value="general">#general</option>
                    <option value="ai-agents">#ai-agents</option>
                    <option value="backend">#backend</option>
                    <option value="architecture">#architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Official, PRD, Weekly"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Content / Body *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Write the complete discussion content, prompt, or architectural breakdown..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={newIsPinned}
                  onChange={(e) => setNewIsPinned(e.target.checked)}
                  className="rounded text-[#0066FF]"
                />
                <span className="font-bold">Pin this announcement to top of Discussions</span>
              </label>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPublishing ? <Loader2 size={15} className="animate-spin" /> : <span>Publish Official Thread</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Moderation & Comments List Modal */}
      {viewingCommentsPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">Moderate Comments</h3>
                <p className="text-slate-500 text-[11px] line-clamp-1">{viewingCommentsPost.title}</p>
              </div>
              <button onClick={() => setViewingCommentsPost(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {(!viewingCommentsPost.commentsList || viewingCommentsPost.commentsList.length === 0) ? (
                <div className="py-8 text-center text-slate-400">
                  No replies or comments on this thread yet.
                </div>
              ) : (
                viewingCommentsPost.commentsList.map((c: any) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 font-sans">{c.author}</span>
                        <span className="text-[10px] text-slate-400">{c.handle}</span>
                        <span className="text-[10px] text-slate-400">&bull; {c.timeAgo || "recent"}</span>
                      </div>
                      <p className="text-slate-700 text-xs font-sans leading-relaxed">{c.text}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(viewingCommentsPost.id, c.id)}
                      disabled={deletingCommentId === c.id}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 shrink-0 cursor-pointer transition-all"
                      title="Delete inappropriate comment"
                    >
                      {deletingCommentId === c.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
