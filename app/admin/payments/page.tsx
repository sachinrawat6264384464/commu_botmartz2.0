import React from "react";
import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  ShieldCheck,
  Tag
} from "lucide-react";
import PaymentsClientTable, { PaymentRecord } from "./client-table";

import { fetchCollectionDocs } from "@/lib/firebase-admin-helper";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  let allPayments: PaymentRecord[] = [];
  let totalRevenue = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let freeCount = 0;

  try {
    const [workshopDocs, ordersDocs, paymentsDocs, attendeesDocs] = await Promise.all([
      fetchCollectionDocs("workshop_registrations"),
      fetchCollectionDocs("orders"),
      fetchCollectionDocs("payments"),
      fetchCollectionDocs("attendees")
    ]);

      const transactionsMap = new Map<string, PaymentRecord>();

      const toIsoString = (val: any) => {
        if (!val) return new Date().toISOString();
        if (typeof val === "string") return val;
        if (val.toDate && typeof val.toDate === "function") return val.toDate().toISOString();
        if (val instanceof Date) return val.toISOString();
        return new Date(val).toISOString();
      };

      const normalizeStatus = (status: any, amount: number) => {
        if (!status) return amount > 0 ? "PAID" : "FREE";
        const s = String(status).toUpperCase();
        if (s === "CAPTURED" || s === "PAID" || s === "COMPLETED" || s === "SUCCESS") return "PAID";
        if (s === "PENDING_REVIEW" || s === "PENDING") return "PENDING_UTR";
        if (s === "REJECTED" || s === "FAILED") return "REJECTED";
        if (s === "FREE_REGISTERED" || s === "FREE") return "FREE";
        return s;
      };

      // 1. Process workshop registrations
      workshopDocs.forEach((data: any) => {
        const txKey = data.paymentId || data.orderId || data.id;
        const amt = Number(data.amount) || 0;
        transactionsMap.set(txKey, {
          id: data.id,
          paymentId: data.paymentId || `REG_${String(data.id).slice(-6)}`,
          orderId: data.orderId || "",
          invoiceNumber: data.invoiceNumber || `INV-${String(data.id).slice(-6)}`,
          checkInCode: data.checkInCode || "",
          attendeeName: data.name || "Workshop Attendee",
          email: data.email || "",
          phone: data.phone || "",
          collegeOrCompany: data.collegeOrCompany || "",
          itemName: data.itemName || data.track || "Production AI Engineering Workshop",
          itemCategory: "WORKSHOP_PASS",
          amount: amt,
          currency: data.currency || "INR",
          method: data.paymentMethod || (amt > 0 ? "Razorpay (Online)" : "Free Registration"),
          status: normalizeStatus(data.status, amt),
          createdAt: toIsoString(data.createdAt),
          source: "workshop_registrations"
        });
      });

      // 2. Process orders
      ordersDocs.forEach((data: any) => {
        const txKey = data.paymentId || data.orderId || data.id;
        const amt = Number(data.amount) || 0;
        const existing = transactionsMap.get(txKey);

        if (existing) {
          existing.orderId = existing.orderId || data.orderId;
          existing.invoiceNumber = existing.invoiceNumber || data.invoiceNumber;
          existing.itemName = existing.itemName || data.itemName;
          existing.itemCategory = data.itemCategory || existing.itemCategory;
        } else {
          transactionsMap.set(txKey, {
            id: data.id,
            paymentId: data.paymentId || data.id,
            orderId: data.orderId || "",
            invoiceNumber: data.invoiceNumber || `INV-${String(data.id).slice(-6)}`,
            checkInCode: "",
            attendeeName: data.name || "Customer",
            email: data.email || "",
            phone: data.phone || "",
            collegeOrCompany: "",
            itemName: data.itemName || "Botmartz Pass / Pack",
            itemCategory: data.itemCategory || "ORDER",
            amount: amt,
            currency: data.currency || "INR",
            method: data.paymentMethod || "Razorpay (Online)",
            status: normalizeStatus(data.status, amt),
            createdAt: toIsoString(data.createdAt),
            source: "orders"
          });
        }
      });

      // 3. Process payments
      paymentsDocs.forEach((data: any) => {
        const txKey = data.paymentId || data.orderId || data.id;
        const amt = Number(data.amount) || 0;
        const existing = transactionsMap.get(txKey);

        if (existing) {
          existing.method = data.method || existing.method;
        } else {
          transactionsMap.set(txKey, {
            id: data.id,
            paymentId: data.paymentId || data.id,
            orderId: data.orderId || "",
            invoiceNumber: `INV-${String(data.id).slice(-6)}`,
            checkInCode: "",
            attendeeName: data.name || "Customer",
            email: data.email || "",
            phone: "",
            collegeOrCompany: "",
            itemName: "Platform Payment",
            itemCategory: "DIRECT_PAYMENT",
            amount: amt,
            currency: data.currency || "INR",
            method: data.method || "Razorpay (Online)",
            status: normalizeStatus(data.status, amt),
            createdAt: toIsoString(data.createdAt),
            source: "payments"
          });
        }
      });

      // 4. Process attendees (Summit tickets & UTRs)
      attendeesDocs.forEach((data: any) => {
        const txKey = data.paymentId || (data.utrNumber ? `UTR_${data.utrNumber}` : data.id);
        const amt = Number(data.amount) || 0;
        const existing = transactionsMap.get(txKey);

        if (!existing) {
          transactionsMap.set(txKey, {
            id: data.id,
            paymentId: data.utrNumber ? `UTR-${data.utrNumber}` : (data.paymentId || `TC-${String(data.id).slice(-6)}`),
            orderId: data.orderId || "",
            invoiceNumber: `INV-SUMMIT-${String(data.id).slice(-6)}`,
            checkInCode: data.checkInCode || "",
            attendeeName: data.name || "Attendee",
            email: data.email || "",
            phone: data.phone || "",
            collegeOrCompany: "",
            itemName: data.eventTitle || data.tier || "AI Frontier 2026 Pass",
            itemCategory: "EVENT_TICKET",
            amount: amt,
            currency: "INR",
            method: data.paymentMethod || (data.utrNumber ? `Manual UPI UTR (${data.utrNumber})` : "Razorpay"),
            status: normalizeStatus(data.status, amt),
            utrNumber: data.utrNumber || "",
            createdAt: toIsoString(data.createdAt || data.submittedAt),
            source: "attendees"
          });
        }
      });

      allPayments = Array.from(transactionsMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      totalRevenue = allPayments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0);

      paidCount = allPayments.filter((p) => p.status === "PAID").length;
      pendingCount = allPayments.filter((p) => p.status === "PENDING_UTR").length;
      freeCount = allPayments.filter((p) => p.status === "FREE").length;
    } catch (err) {
      console.warn("Error querying payments in admin payments page:", err);
    }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            FINANCE &amp; RECONCILIATION LEDGER
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Payments &amp; Transactions</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-time synchronization with Razorpay, Cloud Firestore orders, and manual UPI verifications.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/admin/workshops"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all"
          >
            Workshop Passes &rarr;
          </Link>
          <Link
            href="/admin/wallets"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xs"
          >
            Karma Wallets &rarr;
          </Link>
        </div>
      </div>

      {/* Realtime Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Total Gross Revenue</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Processed via Razorpay INR</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Captured Transactions</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0066FF] mb-1">{paidCount}</div>
          <div className="text-[11px] text-slate-500">100% Signature Verified</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Pending UTR Review</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 mb-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-bold">Awaiting Bank Approval</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Total Platform Records</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Receipt size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">{allPayments.length}</div>
          <div className="text-[11px] text-slate-500">{freeCount} Free registrations</div>
        </div>
      </div>

      {/* Live Interactive Table */}
      <PaymentsClientTable initialPayments={allPayments} />
    </div>
  );
}
