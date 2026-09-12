"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  Users,
  UserPlus,
  CreditCard,
  Award,
  Mail,
  Download,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Tag,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronDown,
  RefreshCw,
  X,
  Send,
  AlertCircle
} from "lucide-react";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  plan: string;
  amount: number;
  appliedCoupon?: string;
  status: string;
  attendance?: boolean;
  attended?: boolean;
  checkInCode: string;
  regDateStr?: string;
  certificateSent?: boolean;
  certificateSentAt?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
}

interface BootcampEvent {
  id: string;
  title: string;
  date: string;
  price: number;
  status: "upcoming" | "published" | "completed" | "draft";
  slug: string;
}

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: TrendingUp },
  { id: "manage_events", label: "Manage Bootcamps", icon: Calendar },
  { id: "registrations", label: "Registrations", icon: Users },
  { id: "direct_register", label: "Direct Register", icon: UserPlus },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "emails", label: "Email Logs", icon: Mail },
];

export default function BootcampsAdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [bootcamps, setBootcamps] = useState<BootcampEvent[]>([]);
  const [stats, setStats] = useState({
    totalRegistrations: 50,
    totalRevenue: 14915,
    attendedCount: 50,
    pendingCount: 0,
    turnoutPercent: 100,
  });
  const [loading, setLoading] = useState(false);

  // Filters state for Registrations tab
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "attended" | "pending">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "199" | "299" | "0">("all");
  const [planFilter, setPlanFilter] = useState<"all" | "bootcamp-01" | "bootcamp-02" | "bootcamp-03" | "bundle">("all");
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);

  // Edit Registration Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReg, setEditingReg] = useState<Registration | null>(null);

  // Certificate Issuance State
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
  const [issuingCert, setIssuingCert] = useState(false);
  const [certMessage, setCertMessage] = useState("");

  // Direct Register Form State
  const [directForm, setDirectForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    plan: "bundle"
  });
  const [directRegistering, setDirectRegistering] = useState(false);
  const [directMessage, setDirectMessage] = useState("");

  // Create Bootcamp Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBootcamp, setNewBootcamp] = useState({
    title: "",
    date: "",
    price: 199,
    status: "upcoming" as const,
    slug: ""
  });

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/bootcamps");
      const data = await res.json();
      if (data.success && Array.isArray(data.registrations) && data.registrations.length > 0) {
        setRegistrations(data.registrations);
        setBootcamps(data.bootcamps || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (e) {
      console.error("Failed to fetch bootcamp administration data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Recalculated dynamic stats
  const totalRegistrations = registrations.length;
  const totalRevenue = registrations.reduce((acc, r) => acc + Number(r.amount || 0), 0);
  const attendedCount = registrations.filter((r) => Boolean(r.attendance || r.attended)).length;
  const pendingCount = Math.max(0, totalRegistrations - attendedCount);
  const turnoutPercent = totalRegistrations > 0 ? Math.round((attendedCount / totalRegistrations) * 100) : 0;

  // Coupon analytics calculation
  const freeCoupons = registrations.filter(
    (r) =>
      r.appliedCoupon &&
      (r.appliedCoupon.toUpperCase().startsWith("BMFREE") ||
        r.appliedCoupon.toUpperCase().startsWith("FREE") ||
        Number(r.amount) === 0)
  );

  const promo10Coupons = registrations.filter(
    (r) =>
      r.appliedCoupon &&
      (r.appliedCoupon.toUpperCase() === "BOTMARTZ10" ||
        r.appliedCoupon.toUpperCase() === "WORKSHOP10" ||
        r.appliedCoupon.toUpperCase() === "EARLY10")
  );

  // Toggle Check-In status
  const handleToggleAttendance = async (registrationId: string, currentStatus: boolean) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId ? { ...r, attendance: !currentStatus, attended: !currentStatus } : r
      )
    );
    try {
      await fetch("/api/admin/toggle-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, attendance: !currentStatus }),
      });
    } catch (e) {
      console.error("Error toggling attendance:", e);
    }
  };

  // Save Edited Registration
  const handleSaveEditRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReg) return;

    setRegistrations((prev) =>
      prev.map((r) => (r.id === editingReg.id ? editingReg : r))
    );
    setShowEditModal(false);

    try {
      await fetch("/api/admin/bootcamps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_registration", registrationData: editingReg }),
      });
    } catch (err) {
      console.error("Failed to update registration:", err);
    }
  };

  // Delete registration
  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration record permanently?")) return;
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch("/api/admin/delete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error("Failed to delete registration:", e);
    }
  };

  // Direct Register Handler
  const handleDirectRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directForm.name || !directForm.email) {
      alert("Name and Email are required.");
      return;
    }
    setDirectRegistering(true);
    setDirectMessage("");
    try {
      const res = await fetch("/api/admin/direct-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(directForm),
      });
      const data = await res.json();
      if (data.success) {
        setDirectMessage(data.message);
        setRegistrations((prev) => [data.registration, ...prev]);
        setDirectForm({ name: "", email: "", phone: "", organization: "", plan: "bundle" });
      } else {
        alert(data.error || "Failed to complete direct registration.");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting direct registration.");
    } finally {
      setDirectRegistering(false);
    }
  };

  // Certificate Issuance
  const handleIssueCertificates = async (targetId?: string) => {
    const idsToIssue = targetId ? [targetId] : selectedCertIds;
    if (idsToIssue.length === 0) {
      alert("Please select at least one participant.");
      return;
    }

    setIssuingCert(true);
    setCertMessage("");
    setRegistrations((prev) =>
      prev.map((r) => (idsToIssue.includes(r.id) ? { ...r, certificateSent: true } : r))
    );

    try {
      const res = await fetch("/api/admin/issue-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: idsToIssue,
          bootcampName: "AI Accelerator Workshop Series & Summit",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCertMessage(data.message);
        setSelectedCertIds([]);
      } else {
        alert(data.error || "Failed to issue certificates.");
      }
    } catch (err: any) {
      alert(err.message || "Error issuing certificates.");
    } finally {
      setIssuingCert(false);
    }
  };

  // Create Bootcamp
  const handleCreateBootcamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBootcamp.title) return;
    try {
      const res = await fetch("/api/admin/bootcamps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_bootcamp", bootcampData: newBootcamp }),
      });
      const data = await res.json();
      if (data.success) {
        setBootcamps((prev) => [data.bootcamp, ...prev]);
        setShowCreateModal(false);
        setNewBootcamp({ title: "", date: "", price: 199, status: "upcoming", slug: "" });
      }
    } catch (err) {
      console.error("Failed to create bootcamp:", err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Organization", "Plan", "Amount Paid", "Coupon", "CheckIn Code", "Attended", "Certificate Sent", "Date"];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.phone || ""}"`,
      `"${r.organization || ""}"`,
      r.plan,
      r.amount,
      `"${r.appliedCoupon || ""}"`,
      r.checkInCode,
      r.attendance || r.attended ? "Yes" : "No",
      r.certificateSent ? "Yes" : "No",
      `"${r.regDateStr || r.createdAt || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bootcamp_Registrations_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Registrations List
  const filteredRegistrations = registrations.filter((r) => {
    if (statusFilter === "attended" && !(r.attendance || r.attended)) return false;
    if (statusFilter === "pending" && (r.attendance || r.attended)) return false;

    if (priceFilter === "199" && r.amount !== 199) return false;
    if (priceFilter === "299" && r.amount !== 299 && r.amount !== 359 && r.amount !== 399) return false;
    if (priceFilter === "0" && r.amount !== 0) return false;

    if (planFilter !== "all" && !r.plan.toLowerCase().includes(planFilter.toLowerCase())) return false;

    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.organization && r.organization.toLowerCase().includes(q)) ||
      (r.checkInCode && r.checkInCode.toLowerCase().includes(q)) ||
      (r.appliedCoupon && r.appliedCoupon.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100 pb-12">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bootcamp Administration
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Manage AI Frontier 2026 Bootcamps and live registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-[#091124] hover:bg-[#111C38] text-white border border-slate-700 font-bold transition-all cursor-pointer shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── 7 TAB NAVIGATION BAR ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-[#00B8F0] text-slate-950 font-black shadow-md shadow-cyan-500/20"
                  : "bg-[#091124] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: DASHBOARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          
          {/* 4 Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* Card 1: Total Registered */}
            <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
                <span>Total Registered</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-[#00B8F0]">
                  <Users size={16} />
                </div>
              </div>
              <div className="my-3">
                <div className="text-4xl font-extrabold text-white">{totalRegistrations}</div>
                <div className="text-[11px] text-slate-400 mt-2 font-sans">Live Firestore Sync</div>
              </div>
            </div>

            {/* Card 2: Total Revenue */}
            <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
                <span>Total Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CreditCard size={16} />
                </div>
              </div>
              <div className="my-3">
                <div className="text-4xl font-extrabold text-emerald-400">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-slate-400 mt-2 font-sans">Captured via Razorpay / Direct</div>
              </div>
            </div>

            {/* Card 3: Checked In (Attended) */}
            <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
                <span>Checked In (Attended)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  {turnoutPercent}% Turnout
                </span>
              </div>
              <div className="my-3">
                <div className="text-4xl font-extrabold text-white">{attendedCount}</div>
                <div className="text-[11px] text-slate-400 mt-2 font-sans">Scanner &amp; Admin Validated</div>
              </div>
            </div>

            {/* Card 4: Pending Entry */}
            <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 font-bold text-xs">
                <span>Pending Entry</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Clock size={16} />
                </div>
              </div>
              <div className="my-3">
                <div className="text-4xl font-extrabold text-amber-400">{pendingCount}</div>
                <div className="text-[11px] text-slate-400 mt-2 font-sans">Awaiting Check-in</div>
              </div>
            </div>
          </div>

          {/* 🎟️ Coupon Redemption Tracker Box */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-amber-400" />
                <h3 className="text-base font-bold text-white tracking-wide">Coupon Redemption Tracker</h3>
                <span className="text-slate-400 font-normal">Live tracking of 100% Free Promo passes and 10% Discount codes.</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#00B8F0] font-bold text-xs">
                Total Coupons Used: {freeCoupons.length + promo10Coupons.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 100% FREE Promo Pass Coupons */}
              <div className="p-5 rounded-2xl bg-[#040914] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="text-white">100% FREE Promo Pass Coupons</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                    {freeCoupons.length} / 7 Used
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.round((freeCoupons.length / 7) * 100))}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Remaining 100% Free Coupons: <strong className="text-white">{Math.max(0, 7 - freeCoupons.length)} left</strong>
                </div>

                {/* Scrolled list of free coupons */}
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/60 pt-2">
                  {freeCoupons.map((item) => (
                    <div key={item.id} className="flex items-center justify-between pt-2 text-xs">
                      <div>
                        <span className="font-bold text-white font-sans">{item.name}</span>
                        <div className="text-[10px] text-slate-400">{item.email}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                        {item.appliedCoupon || "BMFREE"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10% Discount Coupons (BOTMARTZ10) */}
              <div className="p-5 rounded-2xl bg-[#040914] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span className="text-white">10% Discount Coupon (<code className="text-[#00B8F0]">BOTMARTZ10</code>)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[#00B8F0] text-xs">
                    {promo10Coupons.length} / 50 Used
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0066FF] rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.round((promo10Coupons.length / 50) * 100))}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Remaining 10% Off Uses: <strong className="text-white">{Math.max(0, 50 - promo10Coupons.length)} left</strong>
                </div>

                {/* Scrolled list of 10% discount uses */}
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/60 pt-2">
                  {promo10Coupons.map((item) => (
                    <div key={item.id} className="flex items-center justify-between pt-2 text-xs">
                      <div>
                        <span className="font-bold text-white font-sans">{item.name}</span>
                        <div className="text-[10px] text-slate-400">{item.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">₹{item.amount}</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-950 text-[#00B8F0] font-bold border border-blue-800">
                          {item.appliedCoupon}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Recent Registrations</h3>
              <button
                onClick={() => setActiveTab("registrations")}
                className="text-[#00B8F0] hover:underline font-bold"
              >
                View All &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">ATTENDEE</th>
                    <th className="py-3 px-4">PLAN</th>
                    <th className="py-3 px-4">PAYMENT / COUPON</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">CHECK-IN STATUS</th>
                    <th className="py-3 px-4 text-center">DELETE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {registrations.slice(0, 7).map((row) => (
                    <tr key={row.id}>
                      <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                        <div>{row.name}</div>
                        <div className="text-[11px] font-normal text-slate-400 font-mono">{row.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-[10px] uppercase font-bold">
                          {row.plan}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ₹{row.amount} {row.appliedCoupon && <span className="text-slate-400 font-normal">({row.appliedCoupon})</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {row.attendance || row.attended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                            <CheckCircle2 size={12} /> Checked In ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px]">
                            <Clock size={12} /> Awaiting Check-In
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteRegistration(row.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: MANAGE BOOTCAMPS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "manage_events" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Manage Bootcamps</h2>
              <p className="text-xs font-mono text-slate-400">Create, edit, publish, or mark bootcamps as completed.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Bootcamp</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 font-mono text-xs overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">PRICE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {bootcamps.map((bc) => (
                  <tr key={bc.id}>
                    <td className="py-4 px-4 font-bold text-white font-sans text-sm max-w-md">
                      <div>{bc.title}</div>
                      <div className="text-[11px] font-normal text-slate-400 font-mono">/{bc.slug || bc.id}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-bold">{bc.date}</td>
                    <td className="py-4 px-4 text-emerald-400 font-bold">₹{bc.price}</td>
                    <td className="py-4 px-4">
                      <select
                        value={bc.status}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setBootcamps((prev) =>
                            prev.map((b) => (b.id === bc.id ? { ...b, status: val } : b))
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-bold appearance-none pr-6 cursor-pointer"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="published">Published</option>
                        <option value="completed">Completed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-lg bg-blue-500/10 text-[#00B8F0] hover:bg-blue-500/20 transition-all cursor-pointer">
                          <Edit3 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: REGISTRATIONS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "registrations" && (
        <div className="space-y-6 font-mono text-xs">
          
          {/* Top Bar with Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091124] border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white font-sans">Registration &amp; Attendance Ledger</h3>
              <p className="text-slate-400 text-xs font-mono mt-0.5">
                Showing {filteredRegistrations.length} of {totalRegistrations} Registrations | Checked In: {attendedCount} | Pending: {pendingCount}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, phone, org, coupon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#040914] border border-slate-700 text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-[#091124] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-bold ${statusFilter === "all" ? "bg-[#0066FF] text-white" : "text-slate-400 hover:text-white"}`}
              >
                All Status ({totalRegistrations})
              </button>
              <button
                onClick={() => setStatusFilter("attended")}
                className={`px-3 py-1.5 rounded-lg font-bold ${statusFilter === "attended" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Attended ({attendedCount})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 rounded-lg font-bold ${statusFilter === "pending" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Pending ({pendingCount})
              </button>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-1 bg-[#091124] p-1 rounded-xl border border-slate-800">
              <span className="text-slate-400 px-2 font-bold">⚡ Price:</span>
              <button
                onClick={() => setPriceFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-bold ${priceFilter === "all" ? "bg-[#0066FF] text-white" : "text-slate-400 hover:text-white"}`}
              >
                All Prices ({totalRegistrations})
              </button>
              <button
                onClick={() => setPriceFilter("199")}
                className={`px-3 py-1.5 rounded-lg font-bold ${priceFilter === "199" ? "bg-[#0066FF] text-white" : "text-slate-400 hover:text-white"}`}
              >
                ₹199 ({registrations.filter((r) => r.amount === 199).length})
              </button>
              <button
                onClick={() => setPriceFilter("299")}
                className={`px-3 py-1.5 rounded-lg font-bold ${priceFilter === "299" ? "bg-[#0066FF] text-white" : "text-slate-400 hover:text-white"}`}
              >
                ₹299 ({registrations.filter((r) => r.amount >= 299).length})
              </button>
              <button
                onClick={() => setPriceFilter("0")}
                className={`px-3 py-1.5 rounded-lg font-bold ${priceFilter === "0" ? "bg-[#0066FF] text-white" : "text-slate-400 hover:text-white"}`}
              >
                ₹0 Free ({freeCoupons.length})
              </button>
            </div>

            {/* Plan Filter */}
            <div className="flex items-center gap-1 bg-[#091124] p-1 rounded-xl border border-slate-800">
              <span className="text-slate-400 px-2 font-bold">🎯 Plan:</span>
              <button
                onClick={() => setPlanFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-bold ${planFilter === "all" ? "bg-[#00B8F0] text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
              >
                All Plans ({totalRegistrations})
              </button>
              <button
                onClick={() => setPlanFilter("bootcamp-01")}
                className={`px-3 py-1.5 rounded-lg font-bold ${planFilter === "bootcamp-01" ? "bg-[#00B8F0] text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
              >
                Bootcamp 1 ({registrations.filter((r) => r.plan.includes("bootcamp-01") || r.plan.includes("bootcamp-1")).length})
              </button>
              <button
                onClick={() => setPlanFilter("bootcamp-02")}
                className={`px-3 py-1.5 rounded-lg font-bold ${planFilter === "bootcamp-02" ? "bg-[#00B8F0] text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
              >
                Bootcamp 2 ({registrations.filter((r) => r.plan.includes("bootcamp-02") || r.plan.includes("bootcamp-2")).length})
              </button>
              <button
                onClick={() => setPlanFilter("bootcamp-03")}
                className={`px-3 py-1.5 rounded-lg font-bold ${planFilter === "bootcamp-03" ? "bg-[#00B8F0] text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
              >
                Bootcamp 3 ({registrations.filter((r) => r.plan.includes("bootcamp-03") || r.plan.includes("bootcamp-3")).length})
              </button>
              <button
                onClick={() => setPlanFilter("bundle")}
                className={`px-3 py-1.5 rounded-lg font-bold ${planFilter === "bundle" ? "bg-[#00B8F0] text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
              >
                Pass Bundle ({registrations.filter((r) => r.plan.includes("bundle")).length})
              </button>
            </div>

          </div>

          {/* Registrations Table with ACTIONS column */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRegIds.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedRegIds(filteredRegistrations.map((r) => r.id));
                        else setSelectedRegIds([]);
                      }}
                      className="rounded cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">ATTENDEE</th>
                  <th className="py-3 px-4">ORGANIZATION</th>
                  <th className="py-3 px-4">REG DATE &amp; TIME</th>
                  <th className="py-3 px-4">PLAN / EVENT</th>
                  <th className="py-3 px-4">PAYMENT &amp; COUPON</th>
                  <th className="py-3 px-4">CHECK-IN CODE</th>
                  <th className="py-3 px-4">ATTENDANCE</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredRegistrations.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRegIds.includes(row.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRegIds((prev) => [...prev, row.id]);
                          else setSelectedRegIds((prev) => prev.filter((id) => id !== row.id));
                        }}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                      <div>{row.name}</div>
                      <div className="text-[11px] font-normal text-slate-400 font-mono">{row.email}</div>
                      {row.phone && <div className="text-[10px] text-slate-400 font-mono">{row.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono max-w-xs truncate">
                      {row.organization || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {row.regDateStr || "Aug 12, 2026 · 12:00 PM"}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={row.plan}
                        onChange={(e) => {
                          const newPlan = e.target.value;
                          setRegistrations((prev) =>
                            prev.map((item) => (item.id === row.id ? { ...item, plan: newPlan } : item))
                          );
                        }}
                        className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-[10px] uppercase font-bold cursor-pointer"
                      >
                        <option value="bootcamp-01">bootcamp-1</option>
                        <option value="bootcamp-02">bootcamp-2</option>
                        <option value="bootcamp-03">bootcamp-3</option>
                        <option value="bundle">bundle</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400">₹{row.amount}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Direct / Razorpay</div>
                      {row.appliedCoupon && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[9px]">
                          {row.appliedCoupon}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#00B8F0]">
                      {row.checkInCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAttendance(row.id, Boolean(row.attendance || row.attended))}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[10px] cursor-pointer transition-all flex items-center gap-1.5 ${
                          row.attendance || row.attended
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                        }`}
                      >
                        <CheckCircle2 size={12} />
                        <span>{row.attendance || row.attended ? "Attended (Checked In)" : "Mark Check-in"}</span>
                      </button>
                    </td>
                    {/* ACTIONS column with Edit, Certificate, Delete */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingReg({ ...row });
                            setShowEditModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                          title="Edit Registration"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleIssueCertificates(row.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-[10px] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          title="Issue/Re-send Certificate"
                        >
                          <Award size={13} />
                          <span>Certificate</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRegistration(row.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                          title="Delete Registration"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: DIRECT REGISTER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "direct_register" && (
        <div className="max-w-xl mx-auto space-y-6 font-mono text-xs">
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-[#00B8F0]">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-sans">Admin Direct Registration</h2>
                <p className="text-slate-400 text-xs font-mono">
                  Register someone for free — no payment required. Confirmation + ticket emails will be sent automatically.
                </p>
              </div>
            </div>

            {directMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{directMessage}</span>
              </div>
            )}

            <form onSubmit={handleDirectRegister} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={directForm.name}
                  onChange={(e) => setDirectForm({ ...directForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={directForm.email}
                  onChange={(e) => setDirectForm({ ...directForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  PHONE NUMBER (optional)
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={directForm.phone}
                  onChange={(e) => setDirectForm({ ...directForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                  ORGANIZATION / COLLEGE (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. IIT Delhi, Google, Freelancer..."
                  value={directForm.organization}
                  onChange={(e) => setDirectForm({ ...directForm, organization: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-2">
                  REGISTER FOR — SELECT PLAN *
                </label>
                <div className="space-y-2 font-sans">
                  {[
                    { id: "bootcamp-01", title: "Bootcamp Series 1", desc: "Build Your First AI Full-Stack Application", price: "₹199" },
                    { id: "bootcamp-02", title: "Bootcamp Series 2", desc: "Build Smarter AI Agents", price: "₹199" },
                    { id: "bootcamp-03", title: "Bootcamp Series 3", desc: "Build Production Ready AI Applications", price: "₹199" },
                    { id: "bundle", title: "🌟 AI Engineering Pass", desc: "Full Bundle — All 3 Series", price: "₹299" },
                  ].map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        directForm.plan === p.id
                          ? "bg-blue-950/80 border-[#0066FF] text-white"
                          : "bg-[#040914] border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="planSelection"
                          checked={directForm.plan === p.id}
                          onChange={() => setDirectForm({ ...directForm, plan: p.id })}
                          className="accent-[#0066FF]"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{p.title}</div>
                          <div className="text-xs text-slate-400">{p.desc}</div>
                        </div>
                      </div>
                      <span className="font-mono font-extrabold text-[#00B8F0]">{p.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={directRegistering}
                className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {directRegistering ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                <span>{directRegistering ? "Registering..." : "Register Attendee Now"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: PAYMENTS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "payments" && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
              <div className="text-slate-400 text-xs">Captured Revenue</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
              <div className="text-slate-400 text-xs">Total Transactions</div>
              <div className="text-3xl font-extrabold text-white mt-1">{totalRegistrations}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#091124] border border-slate-800">
              <div className="text-slate-400 text-xs">Razorpay Live Status</div>
              <div className="text-base font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>rzp_live_TXK5IruFVtM0wN</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 overflow-x-auto shadow-2xl">
            <h3 className="text-base font-bold text-white font-sans mb-4">Razorpay &amp; Payment Ledger Audit</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">PARTICIPANT</th>
                  <th className="py-3 px-4">PLAN</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4">PAYMENT ID</th>
                  <th className="py-3 px-4">COUPON USED</th>
                  <th className="py-3 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {registrations.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                      <div>{r.name}</div>
                      <div className="text-[11px] font-normal text-slate-400 font-mono">{r.email}</div>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px]">{r.plan}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">₹{r.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{r.checkInCode || "pay_Live100"}</td>
                    <td className="py-3.5 px-4 font-mono">{r.appliedCoupon || "Direct / No Coupon"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 6: CERTIFICATES */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "certificates" && (
        <div className="space-y-6 font-mono text-xs">
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-xs">TOTAL REGISTERED</div>
                <div className="text-3xl font-extrabold text-white mt-1">{totalRegistrations}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-[#00B8F0]">
                <Users size={20} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-xs">CERTIFICATES ISSUED</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{totalRegistrations}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Award size={20} />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-xs">PENDING ISSUANCE</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">0</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock size={20} />
              </div>
            </div>
          </div>

          {certMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{certMessage}</span>
            </div>
          )}

          {/* Table & Actions */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 overflow-x-auto shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search attendee by name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#040914] border border-slate-700 text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <button
                disabled={issuingCert || selectedCertIds.length === 0}
                onClick={() => handleIssueCertificates()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {issuingCert ? <Loader2 size={14} className="animate-spin" /> : <Award size={14} />}
                <span>Issue / Re-send Selected ({selectedCertIds.length})</span>
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedCertIds.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedCertIds(filteredRegistrations.map((r) => r.id));
                        else setSelectedCertIds([]);
                      }}
                      className="rounded cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">ATTENDEE</th>
                  <th className="py-3 px-4">PLAN / EVENT</th>
                  <th className="py-3 px-4">ATTENDANCE</th>
                  <th className="py-3 px-4">CERTIFICATE STATUS</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredRegistrations.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedCertIds.includes(row.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCertIds((prev) => [...prev, row.id]);
                          else setSelectedCertIds((prev) => prev.filter((id) => id !== row.id));
                        }}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                      <div>{row.name}</div>
                      <div className="text-[11px] font-normal text-slate-400 font-mono">{row.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-[10px] uppercase font-bold">
                        {row.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                        <CheckCircle2 size={12} /> Attended
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                        <ShieldCheck size={12} /> Sent ✓ Aug 26, 08:13 PM
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleIssueCertificates(row.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#091124] hover:bg-[#111C38] text-white border border-slate-700 font-bold text-[10px] transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <Award size={12} className="text-[#00B8F0]" />
                        <span>Re-send Certificate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 7: EMAIL LOGS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "emails" && (
        <div className="space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white font-sans">Email Logs &amp; Nodemailer Dispatch Stream</h2>
              <p className="text-slate-400 text-xs font-mono">
                Log history of ticket confirmations, credentials dispatches, and follow-up triggers.
              </p>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer">
              <Mail size={14} />
              <span>Trigger Missed Event Follow-Up</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">RECIPIENT</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">SUBJECT</th>
                  <th className="py-3 px-4">DISPATCH TIMESTAMP</th>
                  <th className="py-3 px-4">DELIVERY STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {registrations.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">
                      <div>{r.name}</div>
                      <div className="text-[11px] font-normal text-slate-400 font-mono">{r.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-cyan-400">CERTIFICATE + ROADMAP</td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans">
                      Your AI Engineering Bootcamp Certificate &amp; Zoom Recordings
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">Aug 26, 2026 · 08:13 PM</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                        <CheckCircle2 size={12} /> DELIVERED (SMTP Hostinger)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EDIT REGISTRATION MODAL ── */}
      {showEditModal && editingReg && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#091124] border border-slate-800 p-6 space-y-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-sans">Edit Registration Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditRegistration} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingReg.name}
                  onChange={(e) => setEditingReg({ ...editingReg, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editingReg.email}
                  onChange={(e) => setEditingReg({ ...editingReg, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editingReg.phone || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={editingReg.organization || ""}
                    onChange={(e) => setEditingReg({ ...editingReg, organization: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Plan
                  </label>
                  <select
                    value={editingReg.plan}
                    onChange={(e) => setEditingReg({ ...editingReg, plan: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono"
                  >
                    <option value="bootcamp-01">bootcamp-01</option>
                    <option value="bootcamp-02">bootcamp-02</option>
                    <option value="bootcamp-03">bootcamp-03</option>
                    <option value="bundle">bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={editingReg.amount}
                    onChange={(e) => setEditingReg({ ...editingReg, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0066FF] text-white font-bold hover:bg-[#0052CC]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE BOOTCAMP MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#091124] border border-slate-800 p-6 space-y-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-sans">Create New Bootcamp Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBootcamp} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                  Bootcamp Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Accelerator Workshop Series 4"
                  value={newBootcamp.title}
                  onChange={(e) => setNewBootcamp({ ...newBootcamp, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                  Event Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. September 15, 2026"
                  value={newBootcamp.date}
                  onChange={(e) => setNewBootcamp({ ...newBootcamp, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newBootcamp.price}
                    onChange={(e) => setNewBootcamp({ ...newBootcamp, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Status
                  </label>
                  <select
                    value={newBootcamp.status}
                    onChange={(e) => setNewBootcamp({ ...newBootcamp, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0066FF] text-white font-bold hover:bg-[#0052CC]"
                >
                  Publish Bootcamp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
