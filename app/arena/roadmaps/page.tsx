"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Loader2, X, CheckCircle2 } from "lucide-react";
import type { ManagedRoadmap } from "@/lib/roadmaps-server";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CareerRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<ManagedRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Top Unique Code Unlock Bar State
  const [codeInput, setCodeInput] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [unlockedMap, setUnlockedMap] = useState<Record<string, { roadmap: ManagedRoadmap; purchase: any }>>({});

  // Active Roadmap Viewer Modal (with anti-copy / watermark / blur-on-unfocus)
  const [viewerData, setViewerData] = useState<{
    roadmap: ManagedRoadmap;
    purchase?: any;
  } | null>(null);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // Payment Modal State (Initial ₹200 / 3 Days OR Extend ₹100 / +2 Days)
  const [payModal, setPayModal] = useState<{
    action: "unlock" | "extend";
    roadmap?: ManagedRoadmap;
    prefillCode?: string;
  } | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [extendCodeInput, setExtendCodeInput] = useState("");
  const [payError, setPayError] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetch("/api/roadmaps")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.roadmaps)) {
          setRoadmaps(data.roadmaps);
        }
      })
      .catch((err) => console.error("Failed to fetch roadmaps:", err))
      .finally(() => setLoading(false));
  }, []);

  // Anti-capture / anti-copy keyboard & focus protection when viewing any roadmap
  useEffect(() => {
    if (!viewerData) {
      setIsWindowBlurred(false);
      return;
    }

    const handleBlur = () => setIsWindowBlurred(true);
    const handleFocus = () => setIsWindowBlurred(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        e.key === "PrintScreen" ||
        ((e.ctrlKey || e.metaKey) && (key === "c" || key === "p" || key === "s" || key === "u" || key === "x"))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewerData]);

  const domains = useMemo(() => {
    const unique = Array.from(
      new Set(roadmaps.map((r) => r.category || "Core Engineering"))
    );
    return ["All", ...unique];
  }, [roadmaps]);

  const filteredRoadmaps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return roadmaps.filter((r) => {
      const cat = r.category || "Core Engineering";
      if (selectedDomain !== "All" && cat !== selectedDomain) return false;
      if (!q) return true;
      return (
        r.roleName.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q)
      );
    });
  }, [roadmaps, searchQuery, selectedDomain]);

  const totalPages = Math.max(1, Math.ceil(filteredRoadmaps.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRoadmaps = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredRoadmaps.slice(start, start + itemsPerPage);
  }, [filteredRoadmaps, safePage, itemsPerPage]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleVerifyUniqueCode = async (e?: React.FormEvent, overrideCode?: string) => {
    if (e) e.preventDefault();
    const clean = (overrideCode ?? codeInput).trim().toUpperCase();
    setCodeError("");

    if (!clean) {
      setCodeError("Please enter your Unique Code.");
      return;
    }

    setVerifyingCode(true);
    try {
      const res = await fetch("/api/roadmaps/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueCode: clean }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCodeError(data.error || "Invalid or Expired Unique Code.");
        return;
      }

      setUnlockedMap((prev) => ({
        ...prev,
        [data.roadmap.id]: { roadmap: data.roadmap, purchase: data.purchase },
      }));
      setViewerData({ roadmap: data.roadmap, purchase: data.purchase });
    } catch (err: any) {
      setCodeError(err.message || "Could not verify Unique Code.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleCardClick = (rm: ManagedRoadmap) => {
    // 1. Free roadmap -> open immediately
    if (!rm.isPaid) {
      setViewerData({ roadmap: rm });
      return;
    }
    // 2. Unlocked in current session via Unique Code -> open immediately
    if (unlockedMap[rm.id]) {
      setViewerData(unlockedMap[rm.id]);
      return;
    }
    // 3. Locked paid roadmap -> open payment modal
    setPayError("");
    setPaymentReceipt(null);
    setPayModal({ action: "unlock", roadmap: rm });
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModal) return;
    setPayError("");

    if (payModal.action === "extend" && !extendCodeInput.trim()) {
      setPayError("Please enter your existing Unique Code.");
      return;
    }
    if (payModal.action === "unlock" && (!userName.trim() || !userEmail.trim())) {
      setPayError("Please enter your Full Name and Email Address.");
      return;
    }

    setPaying(true);
    try {
      const orderRes = await fetch("/api/roadmaps/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: payModal.action,
          roadmapId: payModal.roadmap?.id,
          uniqueCode: extendCodeInput.trim().toUpperCase(),
          userName: userName.trim(),
          userEmail: userEmail.trim(),
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Could not initialize payment.");
      }

      const verifyAndFinish = async (paymentIds: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const vRes = await fetch("/api/roadmaps/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...paymentIds,
            action: payModal.action,
            roadmapId: payModal.roadmap?.id,
            uniqueCode: extendCodeInput.trim().toUpperCase(),
            userName: userName.trim(),
            userEmail: userEmail.trim(),
          }),
        });
        const vData = await vRes.json();
        if (!vRes.ok || !vData.success) {
          throw new Error(vData.error || "Payment verification failed.");
        }

        setPaymentReceipt(vData);
        if (vData.purchase?.uniqueCode) {
          setCodeInput(vData.purchase.uniqueCode);
        }
        setPaying(false);
      };

      if (orderData.isDevMock) {
        await verifyAndFinish({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_road_mock_${Date.now()}`,
          razorpay_signature: "mock_sig",
        });
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Razorpay SDK failed to load.");
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Botmartz Career Roadmaps",
        description: orderData.itemTitle || "Roadmap Access",
        order_id: orderData.orderId,
        prefill: {
          name: userName.trim(),
          email: userEmail.trim(),
        },
        theme: { color: "#1D3189" },
        handler: async (response: any) => {
          try {
            await verifyAndFinish({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (err: any) {
            setPayError(err.message || "Payment verification failed.");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      rzp.open();
    } catch (err: any) {
      setPayError(err.message || "Payment failed.");
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-24 font-sans">
      {/* Print Block */}
      <style>{`@media print { body { display: none !important; } }`}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── 1. HERO + TOP UNIQUE CODE UNLOCK BAR ── */}
        <div
          className="bg-[#162774] text-white rounded-3xl p-7 sm:p-10 border border-white/15 shadow-2xl space-y-6"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Career Roadmaps Catalog
              </h1>
              <p className="text-blue-100/85 text-xs sm:text-sm font-sans mt-2 leading-relaxed">
                Explore all domain-wise engineering roadmaps directly below. The first 2 roadmaps are free to view — unlock any specialized roadmap for 3 days (₹200) or extend validity (+2 days for ₹100) using your Unique Code.
              </p>
            </div>

            <Link
              href="/arena"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 text-[#162774] font-extrabold text-xs transition-all shadow-md shrink-0 flex items-center gap-2 group w-fit"
            >
              <span>Internship Playground</span>
              <span className="w-6 h-6 rounded-full bg-[#162774] text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                <ArrowRight size={12} />
              </span>
            </Link>
          </div>

          {/* Top Unique Code Input Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <form onSubmit={(e) => handleVerifyUniqueCode(e)} className="flex-1 flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter Roadmap Unique Code (e.g. BM-ROAD-9A4K2M) to Unlock..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-950 placeholder:text-slate-400 font-bold text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  disabled={verifyingCode}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-[#162774] font-extrabold text-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {verifyingCode ? "Verifying..." : "Unlock with Code"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setPayError("");
                  setPaymentReceipt(null);
                  setExtendCodeInput(codeInput);
                  setPayModal({ action: "extend", prefillCode: codeInput });
                }}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white hover:text-slate-950 text-white border border-white/25 font-bold text-xs transition-all cursor-pointer shrink-0"
              >
                Extend +2 Days (₹100)
              </button>
            </div>

            {codeError && (
              <div className="text-xs font-bold text-rose-300 bg-rose-950/50 border border-rose-500/40 px-3.5 py-2 rounded-xl">
                {codeError}
              </div>
            )}
          </div>
        </div>

        {/* ── 2. QUICK SEARCH & DOMAIN FILTER PILLS ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search roadmaps by role, domain, or skill..."
              className="w-full sm:max-w-md px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
            />
            <div className="text-xs font-semibold text-slate-500">
              {filteredRoadmaps.length === 0
                ? "Showing 0 Roadmaps"
                : `Showing ${(safePage - 1) * itemsPerPage + 1}–${Math.min(
                    safePage * itemsPerPage,
                    filteredRoadmaps.length
                  )} of ${filteredRoadmaps.length} Roadmaps`}
            </div>
          </div>

          {domains.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              {domains.map((dom) => {
                const active = selectedDomain === dom;
                return (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => {
                      setSelectedDomain(dom);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-[#162774] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {dom === "All" ? "All Domains" : dom}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 3. GAP-FREE 10-PER-PAGE ROADMAPS GRID ── */}
        {loading ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
            <Loader2 size={18} className="animate-spin text-[#1D3189]" />
            <span>Loading Domain-Wise Roadmaps...</span>
          </div>
        ) : paginatedRoadmaps.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
            <p className="text-sm font-bold text-slate-800">No matching roadmaps found</p>
            <p className="text-xs text-slate-500">Try clearing your search or selecting All Domains.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {paginatedRoadmaps.map((rm) => {
                const isUnlocked = !rm.isPaid || Boolean(unlockedMap[rm.id]);
                return (
                  <div
                    key={rm.id}
                    onClick={() => handleCardClick(rm)}
                    className="relative overflow-hidden bg-white border border-slate-200 border-l-4 border-l-[#162774] hover:border-[#1D3189] rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="p-6 pb-4 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {isUnlocked ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                              {!rm.isPaid ? "Free Access" : "Unlocked"}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-[#162774] text-white text-[10px] font-extrabold uppercase tracking-wider">
                              ₹{rm.price} • {rm.validityDays} Days
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            {rm.category || "Core Engineering"}
                          </span>
                        </div>
                        <span className="w-8 h-8 shrink-0 rounded-full bg-slate-100 group-hover:bg-[#162774] text-slate-900 group-hover:text-white flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
                          <ArrowRight size={13} />
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-950 group-hover:text-[#1D3189] transition-colors mb-1.5">
                        {rm.roleName}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
                        {rm.tagline}
                      </p>
                    </div>

                    <div className="relative overflow-hidden px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs font-bold">
                      <div
                        className="pointer-events-none absolute inset-0 bg-[#162774] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />
                      <span className="relative z-10 text-slate-500 group-hover:text-blue-200 transition-colors duration-500">
                        {rm.stages?.length || 0} Stages
                      </span>
                      {isUnlocked ? (
                        <span className="relative z-10 text-emerald-700 group-hover:text-white transition-colors duration-500">
                          View Full Roadmap →
                        </span>
                      ) : (
                        <span className="relative z-10 px-3.5 py-1.5 rounded-xl bg-[#D9F83B] text-slate-950 font-extrabold shadow-xs transition-all duration-300">
                          Unlock (₹{rm.price}) →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      pageNum === safePage
                        ? "bg-[#162774] text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── PROTECTED ROADMAP VIEWER MODAL (NO COPY / NO PRINT / WATERMARK / BLUR ON UNFOCUS) ── */}
      {viewerData && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto select-none"
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="min-h-full flex items-center justify-center">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
              {/* Diagonal Anti-Leak Watermark Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-[0.06] flex flex-wrap items-center justify-center gap-12 -rotate-12 select-none"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="text-sm font-black text-slate-950 whitespace-nowrap">
                    {viewerData.purchase
                      ? `${viewerData.purchase.userEmail} • ${viewerData.purchase.uniqueCode}`
                      : "BOTMARTZ PROTECTED ROADMAP"}
                  </span>
                ))}
              </div>

              {/* Blur Curtain if tab loses focus */}
              {isWindowBlurred && (
                <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center text-center p-6 text-white">
                  <div className="space-y-2">
                    <div className="text-lg font-extrabold text-[#D9F83B]">Protected View Paused</div>
                    <p className="text-xs text-blue-100">Click back into this window to continue viewing the roadmap.</p>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="relative z-10 bg-[#070E54] px-6 sm:px-8 py-6 text-white flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#D9F83B] text-slate-950 text-[10px] font-extrabold uppercase mb-2">
                    {viewerData.roadmap.category}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">{viewerData.roadmap.roleName}</h2>
                  <p className="text-xs text-blue-100/85 mt-1">{viewerData.roadmap.tagline}</p>
                  {viewerData.purchase && (
                    <div className="mt-2 text-[11px] font-bold text-[#D9F83B]">
                      Code: {viewerData.purchase.uniqueCode} • Valid until{" "}
                      {new Date(viewerData.purchase.expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setViewerData(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Protected Body */}
              <div className="relative z-10 p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
                {/* Target Companies */}
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500 mb-2">Target Hiring Companies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(viewerData.roadmap.targetCompanies || []).map((c) => (
                      <span key={c} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stages */}
                <div className="space-y-4">
                  {(viewerData.roadmap.stages || []).map((stage) => (
                    <div key={stage.stageNumber} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#1D3189] uppercase">
                          Stage {stage.stageNumber}: {stage.stageName}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{stage.duration}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{stage.focus}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(stage.coreSkills || []).map((sk) => (
                          <span key={sk} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
                        {(stage.deliverables || []).map((del, di) => (
                          <div key={di} className="text-xs text-slate-700 flex items-start gap-2 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT MODAL (₹200 FOR 3 DAYS OR ₹100 FOR +2 DAYS EXTEND) ── */}
      {payModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto flex items-center justify-center">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setPayModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            {paymentReceipt ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-950">
                  {payModal.action === "extend" ? "Validity Extended (+2 Days)" : "Roadmap Access Unlocked"}
                </h3>
                <p className="text-xs text-slate-600">
                  Your Unique Code has been emailed to <strong>{paymentReceipt.purchase?.userEmail}</strong>.
                </p>

                <div className="p-4 rounded-2xl bg-[#070E54] text-white space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">
                    Roadmap Unique Code
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-black tracking-widest text-[#D9F83B]">
                      {paymentReceipt.purchase?.uniqueCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentReceipt.purchase?.uniqueCode || "");
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    >
                      {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="text-[11px] text-blue-100/80">
                    Valid until{" "}
                    {new Date(paymentReceipt.purchase?.expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const code = paymentReceipt.purchase?.uniqueCode;
                    setPayModal(null);
                    if (code) handleVerifyUniqueCode(undefined, code);
                  }}
                  className="w-full py-3 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm cursor-pointer"
                >
                  Open Roadmap Now &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
                <div>
                  <div className="text-[11px] font-bold text-[#1D3189] uppercase tracking-wider">
                    {payModal.action === "extend" ? "Extend Roadmap Validity" : "Unlock Specialized Roadmap"}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-950 mt-0.5">
                    {payModal.action === "extend"
                      ? "Add +2 Days Access (₹100)"
                      : `${payModal.roadmap?.roleName}`}
                  </h3>
                  <p className="text-slate-500 mt-1">
                    {payModal.action === "extend"
                      ? "Enter your existing Unique Code to add 2 more days of access."
                      : `Pay ₹${payModal.roadmap?.price || 200} for ${payModal.roadmap?.validityDays || 3}-day access. Your Unique Code will be sent to your email.`}
                  </p>
                </div>

                {payModal.action === "extend" ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Existing Unique Code *</label>
                    <input
                      type="text"
                      required
                      value={extendCodeInput}
                      onChange={(e) => setExtendCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. BM-ROAD-9A4K2M"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold uppercase tracking-wider focus:bg-white focus:outline-none focus:border-[#1D3189]"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Rohan Mehta"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address * (Receives Unique Code)</label>
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-medium focus:bg-white focus:outline-none focus:border-[#1D3189]"
                      />
                    </div>
                  </>
                )}

                {payError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                    {payError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full py-3.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>
                      {payModal.action === "extend"
                        ? "Pay ₹100 & Extend +2 Days →"
                        : `Pay ₹${payModal.roadmap?.price || 200} & Get Unique Code →`}
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
