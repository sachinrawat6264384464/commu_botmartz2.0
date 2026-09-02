import React from "react";
import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import {
  Users,
  CreditCard,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Tag,
  ArrowUpRight
} from "lucide-react";
import WorkshopsClientTable from "./client-table";

export const dynamic = "force-dynamic";

export default async function AdminWorkshopsPage() {
  let registrations: any[] = [];
  let totalRevenue = 0;
  let paidCount = 0;

  if (adminDb) {
    try {
      const snap = await adminDb
        .collection("workshop_registrations")
        .orderBy("createdAt", "desc")
        .get();

      registrations = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      paidCount = registrations.filter((r) => r.status === "PAID").length;
      totalRevenue = registrations
        .filter((r) => r.status === "PAID")
        .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    } catch (err) {
      console.warn("Error fetching workshop registrations:", err);
    }
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            BOTMARTZ WORKSHOP REGISTRATIONS &amp; PAYMENTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Workshop Attendees &amp; Passes</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-time telemetry of all registered candidates and Razorpay transactions stored in Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/admin/page-locks"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            Page Lock Scheduler &rarr;
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>View Live Page</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Realtime Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Total Registered Attendees</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">{registrations.length}</div>
          <div className="text-[11px] text-slate-500">Live Attendees in Database</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Paid Confirmed Passes</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 mb-1">{paidCount}</div>
          <div className="text-[11px] text-emerald-700 font-bold">100% Verified via Razorpay</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Total Workshop Revenue</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-purple-700 font-bold">Processed via Razorpay INR</div>
        </div>
      </div>

      {/* Interactive Attendees Table with Search & CSV Export */}
      <WorkshopsClientTable registrations={registrations} />

    </div>
  );
}
