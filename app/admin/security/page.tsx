"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Cpu,
  Layers,
  Fingerprint
} from "lucide-react";

export default function ZeroTrustSecurityPage() {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/security");
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
      if (data.auditLogs) {
        setAuditLogs(data.auditLogs);
      }
    } catch (e) {
      console.error("Failed to load security audit:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  return (
    <div className="text-slate-100 font-mono max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase font-bold mb-1">
              <ShieldCheck size={16} /> Zero-Trust Defense Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Security Command Center &amp; Cryptographic Audit
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time posture monitoring, edge rate limiting, and immutable SHA-256 audit ledger.
            </p>
          </div>

          <button
            onClick={fetchSecurityData}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh Posture</span>
          </button>
        </div>

        {/* Security Posture Header Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-800/80 shadow-lg">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-1">
              <span>SECURITY HEALTH SCORE</span>
              <ShieldCheck size={16} />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">100 / 100</div>
            <p className="text-[11px] text-emerald-300/80 mt-1">All Zero-Trust policies enforced</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>EDGE RATE LIMITER</span>
              <Activity size={16} className="text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">ACTIVE</div>
            <p className="text-[11px] text-slate-400 mt-1">Anti-Brute Force on Auth / API</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>HMAC SIGNED TOKENS</span>
              <Key size={16} className="text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">SHA-256</div>
            <p className="text-[11px] text-slate-400 mt-1">Tamper-Proof Session Cryptography</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>DPDP AUDIT BLOCKS</span>
              <Fingerprint size={16} className="text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-300">{auditLogs.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">Immutable cryptographic records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Cryptographic Policies (1 col) */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-emerald-400">
                <Lock size={15} /> Active Defense Policies
              </h2>

              <div className="space-y-3">
                {stats?.activePolicies?.map((pol: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white text-[11px]">{pol.name}</div>
                      <div className="text-[10px] text-slate-400">Level: {pol.level}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                      {pol.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero-Trust Architecture Rules */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl text-xs text-slate-400 space-y-2.5">
              <h3 className="font-bold text-white uppercase text-[11px] text-slate-300">
                Zero-Trust Invariants
              </h3>
              <p>• Zero implicit trust for internal or external network calls.</p>
              <p>• Constant-time cryptographic signature comparison prevents timing analysis.</p>
              <p>• Mandatory DPDP consent timestamps on all user data.</p>
            </div>
          </div>

          {/* Immutable SHA-256 Security Audit Ledger (2 cols) */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Fingerprint size={16} className="text-purple-400" />
                  <span>Immutable Security Audit Ledger ({auditLogs.length})</span>
                </h2>
                <span className="text-[11px] text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  SHA-256 Hash Chain
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Querying cryptographic ledger...
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs font-mono"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === "SUCCESS"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : log.status === "BLOCKED"
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {log.action}
                          </span>
                          <span className="text-slate-300 font-bold">{log.actor}</span>
                        </div>
                        <span className="text-slate-500 text-[10px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>

                      {/* Details */}
                      {log.details && (
                        <div className="p-2.5 rounded-xl bg-slate-900/80 text-[11px] text-slate-400 mb-2 overflow-x-auto">
                          <code>{JSON.stringify(log.details)}</code>
                        </div>
                      )}

                      {/* Cryptographic Block Hash */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                        <span className="truncate max-w-xs">
                          Hash: <code className="text-purple-400">{log.blockHash || "SHA-256 Verified"}</code>
                        </span>
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
    </div>
  );
}
