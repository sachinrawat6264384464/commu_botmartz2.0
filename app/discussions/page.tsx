"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthGate from "@/app/_components/AuthGate";

interface Comment {
  id: string;
  author: string;
  handle: string;
  text: string;
  timeAgo: string;
}

interface DiscussionPost {
  id: string;
  title: string;
  author: {
    name: string;
    handle: string;
    role: string;
    avatarBg: string;
    github?: string;
    discord?: string;
  };
  channel: string;
  tags: string[];
  content: string;
  upvotes: number;
  replies: number;
  commentsList?: Comment[];
  timeAgo: string;
  isHot?: boolean;
}

interface UserProfile {
  name: string;
  handle: string;
  role: string;
  bio: string;
  github: string;
  linkedin: string;
  discord: string;
  whatsapp: string;
}

const CHANNELS = [
  { id: "all", label: "All Channels" },
  { id: "show-your-build", label: "Showcase Thursdays" },
  { id: "resume-review", label: "Wednesday Resume Reviews" },
  { id: "ama-questions", label: "Saturday AMA Questions" },
  { id: "ai-agents", label: "AI Agents & Systems" },
  { id: "enterprise-rag", label: "Enterprise RAG & Search" },
  { id: "events-and-meetups", label: "Events & Hackathons" },
];

function DiscussionsContent() {
  const { user, studentProfile } = useAuth();
  const searchParams = useSearchParams();
  const initialChannel = searchParams.get("channel") || "all";

  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(initialChannel);
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  // Active Thread for Comments
  const [activeThread, setActiveThread] = useState<DiscussionPost | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [rewardBanner, setRewardBanner] = useState<string | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.displayName || "Soham Sharma",
    handle: studentProfile?.username ? `@${studentProfile.username}` : "@builder",
    role: studentProfile?.personaType === "STUDENT" ? "AI Engineering Fellow" : "Founder & AI Architect",
    bio: studentProfile?.bio || "Building enterprise RAG, deterministic agents, and applied AI systems.",
    github: studentProfile?.githubUrl || "https://github.com/soham2710",
    linkedin: studentProfile?.linkedinUrl || "https://linkedin.com/in/soham-sharma",
    discord: studentProfile?.discordHandle || "builder#0001",
    whatsapp: studentProfile?.whatsappNumber || "+91 98765 43210"
  });

  useEffect(() => {
    if (user || studentProfile) {
      setProfile({
        name: user?.displayName || studentProfile?.displayName || "Community Builder",
        handle: studentProfile?.username ? `@${studentProfile.username}` : (user?.email ? `@${user.email.split("@")[0]}` : "@builder"),
        role: studentProfile?.personaType === "STUDENT" ? "AI Engineering Fellow" : (studentProfile?.currentRole || "AI Builder"),
        bio: studentProfile?.bio || "Building enterprise RAG and production AI systems.",
        github: studentProfile?.githubUrl || "https://github.com",
        linkedin: studentProfile?.linkedinUrl || "https://linkedin.com",
        discord: studentProfile?.discordHandle || "builder#0001",
        whatsapp: studentProfile?.whatsappNumber || ""
      });
    }
  }, [user, studentProfile]);

  // Modal state for new discussion
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newChannel, setNewChannel] = useState("ai-agents");
  const [newTags, setNewTags] = useState("LangGraph, Production");
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    if (searchParams.get("channel")) {
      setSelectedChannel(searchParams.get("channel")!);
    }
  }, [searchParams]);

  // Fetch live discussions from Firestore
  useEffect(() => {
    setLoadingPosts(true);
    fetch("/api/discussions")
      .then(res => res.json())
      .then(data => {
        if (data?.discussions && Array.isArray(data.discussions)) {
          const sanitized: DiscussionPost[] = data.discussions.map((d: any) => ({
            id: d.id || `disc-${Math.random()}`,
            title: d.title || "Untitled Discussion",
            content: d.content || "",
            channel: d.channel || "all",
            tags: Array.isArray(d.tags) ? d.tags : typeof d.tags === "string" ? d.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : ["General"],
            author: {
              name: d.author?.name || "Community Builder",
              handle: d.author?.handle || "@builder",
              role: d.author?.role || "AI Builder",
              avatarBg: d.author?.avatarBg || "from-[#162774] to-blue-700",
              github: d.author?.github || "",
              discord: d.author?.discord || ""
            },
            upvotes: typeof d.upvotes === "number" ? d.upvotes : 0,
            replies: typeof d.replies === "number" ? d.replies : (Array.isArray(d.commentsList) ? d.commentsList.length : 0),
            commentsList: Array.isArray(d.commentsList) ? d.commentsList : [],
            timeAgo: d.timeAgo || "Recently",
            isHot: Boolean(d.isHot)
          }));

          setPosts(sanitized);
        }
      })
      .catch(() => null)
      .finally(() => setLoadingPosts(false));
  }, []);

  const toggleUpvote = async (id: string) => {
    const isUp = upvotedIds[id];
    setUpvotedIds(prev => ({ ...prev, [id]: !isUp }));
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, upvotes: isUp ? p.upvotes - 1 : p.upvotes + 1 };
      }
      return p;
    }));

    if (!isUp) {
      setRewardBanner("Upvoted! +1 Karma Coin awarded to author.");
      setTimeout(() => setRewardBanner(null), 3000);
      try {
        await fetch("/api/discussions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "UPVOTE", postId: id })
        });
      } catch (err) {}
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeThread) return;

    setSubmittingComment(true);
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: profile.name,
      handle: profile.handle,
      text: newCommentText.trim(),
      timeAgo: "Just now"
    };

    setPosts(prev => prev.map(p => {
      if (p.id === activeThread.id) {
        const updatedComments = [...(p.commentsList || []), newComment];
        const updatedPost = { ...p, replies: p.replies + 1, commentsList: updatedComments };
        setActiveThread(updatedPost);
        return updatedPost;
      }
      return p;
    }));

    setNewCommentText("");
    setRewardBanner("🎉 Comment posted! +3 Karma Coins awarded to your wallet.");
    setTimeout(() => setRewardBanner(null), 4000);

    try {
      await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REPLY",
          postId: activeThread.id,
          comment: {
            content: newComment.text,
            author: {
              name: profile.name,
              handle: profile.handle,
              email: user?.email || ""
            }
          }
        })
      });
    } catch (err) {} finally {
      setSubmittingComment(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || creatingPost) return;

    setCreatingPost(true);
    const title = newTitle.trim();
    const content = newContent.trim();
    const tags = newTags.split(",").map(t => t.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE",
          title,
          content,
          channel: newChannel,
          tags,
          author: {
            name: profile.name,
            handle: profile.handle,
            role: profile.role,
            email: user?.email || ""
          }
        })
      });
      const data = await res.json();
      if (data?.success && data?.id) {
        const createdPost: DiscussionPost = {
          id: data.id,
          title,
          author: {
            name: profile.name,
            handle: profile.handle,
            role: profile.role,
            avatarBg: "from-[#162774] to-blue-700",
            github: profile.github,
            discord: profile.discord
          },
          channel: newChannel,
          tags,
          content,
          upvotes: 1,
          replies: 0,
          commentsList: [],
          timeAgo: "Just now"
        };
        setPosts(prev => [createdPost, ...prev]);
        setUpvotedIds(prev => ({ ...prev, [data.id]: true }));
        setShowModal(false);
        setNewTitle("");
        setNewContent("");
        setRewardBanner("Discussion created! +5 Karma Coins awarded to your wallet.");
        setTimeout(() => setRewardBanner(null), 4000);
      }
    } catch (err) {} finally {
      setCreatingPost(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingProfile) return;
    setSavingProfile(true);
    setProfileSaveMsg(null);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid || "",
          email: user?.email || "",
          displayName: profile.name.trim(),
          username: profile.handle.replace(/^@/, "").trim(),
          aiSpecialization: profile.role.trim(),
          githubUrl: profile.github.trim(),
          whatsappNumber: profile.whatsapp.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        setShowProfileModal(false);
        setRewardBanner("Builder profile saved to database.");
        setTimeout(() => setRewardBanner(null), 4000);
      } else {
        setProfileSaveMsg(data?.error || "Could not save profile.");
      }
    } catch {
      setProfileSaveMsg("Network error while saving profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 4;

  const filteredPosts = posts.filter(p => {
    if (!p) return false;
    const matchesChannel = selectedChannel === "all" || p.channel === selectedChannel;
    const searchLower = (searchQuery || "").toLowerCase();
    const titleMatch = (p.title || "").toLowerCase().includes(searchLower);
    const contentMatch = (p.content || "").toLowerCase().includes(searchLower);
    const tagsMatch = Array.isArray(p.tags) && p.tags.some(t => String(t || "").toLowerCase().includes(searchLower));
    return matchesChannel && (titleMatch || contentMatch || tagsMatch);
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="bg-white min-h-screen text-slate-900 py-12 pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Banner */}
        <div className="bg-[#162774] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-sm">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Community Discussions &amp; Forum
            </h1>
            <p className="text-blue-100 text-sm max-w-2xl mt-2">
              Ask technical questions, share architecture diagrams, join Wednesday Resume Reviews, and submit 3rd Saturday AMA questions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setProfileSaveMsg(null);
                setShowProfileModal(true);
              }}
              className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              My Builder Profile
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#D9F83B] hover:bg-[#c8e82e] text-[#162774] px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              + Start Topic
            </button>
          </div>
        </div>

        {/* Dynamic Reward Banner Notification */}
        {rewardBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-[#162774] text-white text-xs font-semibold shadow-sm flex items-center justify-between">
            <span>{rewardBanner}</span>
            <button onClick={() => setRewardBanner(null)} className="p-1 hover:bg-white/15 rounded-lg cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* WhatsApp Callout Bar */}
        <div className="bg-white border border-slate-200 hover:border-[#162774] rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Join our real-time developer group for daily voice jams, instant debugging, and job openings.
          </p>
          <div className="shrink-0">
            <a
              href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#D9F83B] hover:bg-[#c8e82e] text-[#162774] text-xs font-extrabold transition-colors inline-block whitespace-nowrap"
            >
              WhatsApp Group
            </a>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Channels Column */}
          <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-3xl p-5">
              <div className="text-xs text-slate-400 uppercase font-bold mb-4 px-2 tracking-wider">
                Discussion Channels
              </div>
              <div className="space-y-1">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChannel(ch.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedChannel === ch.id
                        ? "bg-[#162774] text-white"
                        : "text-slate-700 hover:text-[#162774] hover:bg-slate-50"
                    }`}
                  >
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Community Rituals Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5">
              <div className="text-xs text-slate-400 uppercase font-bold mb-3 px-2 tracking-wider">
                Weekly Rituals
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#162774] transition-colors">
                  <div className="font-bold text-[#162774]">Showcase Thursdays</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Live community project demos &amp; voting</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#162774] transition-colors">
                  <div className="font-bold text-[#162774]">Wednesday Resume Reviews</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">1-on-1 portfolio &amp; CV teardowns</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#162774] transition-colors">
                  <div className="font-bold text-[#162774]">3rd Saturday AMAs</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Live technical Q&amp;A with founders</div>
                </div>
              </div>
            </div>

            {/* Karma Coin Earning Rules Card */}
            <div className="bg-[#162774] text-white rounded-3xl p-5 text-xs">
              <div className="text-xs text-[#D9F83B] font-bold uppercase mb-3 tracking-wider">
                Discussion Karma
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <span>Start Discussion Topic</span>
                  <strong className="text-[#D9F83B] font-bold">+5 Coins</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <span>Constructive Reply</span>
                  <strong className="text-[#D9F83B] font-bold">+3 Coins</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <span>Received Peer Upvote</span>
                  <strong className="text-[#D9F83B] font-bold">+1 Coin</strong>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <span>Spam / Toxicity Penalty</span>
                  <strong className="text-rose-300 font-bold">-20 Coins</strong>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-blue-100 leading-relaxed">
                Admins review all posts. Coins are credited or debited to your builder wallet.
              </div>
            </div>

          </div>

          {/* Center Posts Feed */}
          <div className="lg:col-span-3 space-y-6">

            {/* Search bar */}
            <div>
              <input
                type="text"
                placeholder="Search discussions by keyword, question, or tag..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#162774]"
              />
            </div>

            {/* Post Feed */}
            <div className="space-y-4">
              {loadingPosts ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-[#162774]" size={18} />
                  <span>Loading discussions from database...</span>
                </div>
              ) : paginatedPosts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
                  <p className="text-sm font-semibold text-slate-700">
                    No discussions found in this channel yet.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#D9F83B] hover:bg-[#c8e82e] text-[#162774] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    + Start First Topic
                  </button>
                </div>
              ) : (
                paginatedPosts.map(post => {
                  const authorName = post.author?.name || "Community Builder";
                  const authorHandle = post.author?.handle || "@builder";
                  const authorRole = post.author?.role || "AI Builder";
                  const initials = authorName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "B";
                  const postTags = Array.isArray(post.tags) ? post.tags : [];

                  return (
                    <div
                      key={post.id}
                      className="bg-white border border-slate-200 hover:border-[#162774] rounded-3xl p-6 sm:p-7 transition-all"
                    >
                      {/* Author Header */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#162774] flex items-center justify-center font-bold text-white text-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>{authorName}</span>
                              <span className="text-[11px] text-slate-400 font-medium">{authorHandle}</span>
                            </div>
                            <div className="text-[11px] font-medium text-[#162774]">{authorRole}</div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400">{post.timeAgo || "Recently"}</div>
                      </div>

                      {/* Title & Content */}
                      <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                        {post.content}
                      </p>

                      {/* Tags */}
                      {postTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {postTags.map((t, tIdx) => (
                            <span key={`${t}-${tIdx}`} className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[#162774] text-[11px] font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleUpvote(post.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              upvotedIds[post.id]
                                ? "bg-[#D9F83B] text-[#162774]"
                                : "bg-slate-50 text-slate-700 hover:border-[#162774] border border-slate-200"
                            }`}
                          >
                            {post.upvotes || 0} Upvotes
                          </button>

                          <button
                            onClick={() => setActiveThread(post)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#162774] hover:text-white text-[#162774] text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                          >
                            {post.replies || (post.commentsList?.length || 0)} Replies
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (typeof navigator !== "undefined" && navigator.clipboard) {
                              navigator.clipboard.writeText(window.location.href);
                            }
                            setRewardBanner("Discussion link copied to clipboard.");
                            setTimeout(() => setRewardBanner(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-[#162774] transition-colors cursor-pointer"
                        >
                          Share
                        </button>
                      </div>

                    </div>
                  );
                })
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                  <div className="text-slate-500">
                    Page {currentPage} of {totalPages} ({filteredPosts.length} Total Topics)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#162774] cursor-pointer font-bold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#162774] cursor-pointer font-bold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Live Comments Thread Modal */}
      {activeThread && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh]">

            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[11px] uppercase text-[#162774] font-bold tracking-wider">LIVE THREAD</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{activeThread.title}</h3>
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {(!activeThread.commentsList || activeThread.commentsList.length === 0) ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No replies yet. Be the first builder to answer!
                </div>
              ) : (
                activeThread.commentsList.map(c => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{c.author} <span className="text-slate-400 font-medium text-[11px]">{c.handle}</span></span>
                      <span className="text-[11px] text-slate-400">{c.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder={`Replying as ${profile.name}...`}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="bg-[#D9F83B] hover:bg-[#c8e82e] text-[#162774] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submittingComment ? "Sending..." : "Reply"}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* User Profile Registration / Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Builder Profile &amp; Social Links</h3>
                <p className="text-xs text-slate-500">Visible to other builders on discussions and showcase arena.</p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {profileSaveMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {profileSaveMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Handle</label>
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Title / Focus Area</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  placeholder="e.g. AI Engineer • LangGraph Specialist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">WhatsApp Phone (for group invites)</label>
                <input
                  type="text"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-[#D9F83B] hover:bg-[#c8e82e] text-[#162774] rounded-xl text-xs font-extrabold uppercase transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* New Discussion Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Start a Discussion Topic</h2>
            <p className="text-xs text-slate-500 mb-6">Ask the community or post in Wednesday Resume Reviews &amp; 3rd Saturday AMAs.</p>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Best practices for streaming structured JSON from LLMs..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                  >
                    <option value="show-your-build">Showcase Thursdays</option>
                    <option value="resume-review">Wednesday Resume Reviews</option>
                    <option value="ama-questions">Saturday AMA Questions</option>
                    <option value="ai-agents">AI Agents &amp; Systems</option>
                    <option value="enterprise-rag">Enterprise RAG</option>
                    <option value="events-and-meetups">Events &amp; Meetups</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your Question / Findings / Resume Details</label>
                <textarea
                  rows={4}
                  placeholder="Share context, code snippet, or portfolio links..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774]"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPost}
                  className="px-6 py-2.5 bg-[#D9F83B] hover:bg-[#c8e82e] text-[#162774] rounded-xl text-xs font-extrabold uppercase transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {creatingPost ? "Publishing..." : "Publish Discussion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CommunityDiscussionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 py-32">
        <Loader2 className="animate-spin text-[#162774]" size={28} />
      </div>
    }>
      <AuthGate
        featureTitle="Technical Discussions & Engineering Forum"
        featureDescription="Sign in to start technical threads, share code snippets, reply to peers, and earn Karma Coins for solving blockers."
      >
        <DiscussionsContent />
      </AuthGate>
    </Suspense>
  );
}
