"use client";

import React, { useState } from "react";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";

export default function AdminBootcampsPage() {
  const [bootcamps, setBootcamps] = useState<any[]>([
    { id: "1", title: "Hands-on AI Agent Accelerator", cohort: "Cohort 04", duration: "2 Days", price: "₹1,999", enrolled: 42, cap: 50 },
    { id: "2", title: "Enterprise RAG & Hybrid Retrieval", cohort: "Cohort 02", duration: "2 Days", price: "₹1,999", enrolled: 28, cap: 50 },
  ]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-[#00B8F0] uppercase font-bold">EDUCATION &amp; WORKSHOPS</div>
          <h1 className="text-2xl font-bold text-white">AI Bootcamps &amp; Cohorts</h1>
        </div>
      </div>

      {/* Bootcamps Table */}
      <div className="bg-[#0B1524] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070E1B] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
            <tr>
              <th className="p-4">Cohort Title</th>
              <th className="p-4">Cohort / Duration</th>
              <th className="p-4">Enrollment</th>
              <th className="p-4">Fee</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bootcamps.map((b) => (
              <tr key={b.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-bold text-white text-sm">{b.title}</td>
                <td className="p-4 text-slate-300 font-mono">
                  <div>{b.cohort}</div>
                  <div className="text-slate-500 text-[11px]">{b.duration}</div>
                </td>
                <td className="p-4 font-mono">
                  <span className="text-emerald-400 font-bold">{b.enrolled}</span> / {b.cap}
                </td>
                <td className="p-4 font-mono font-bold text-white">{b.price}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-1.5 text-slate-400 hover:text-white"><Edit size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
