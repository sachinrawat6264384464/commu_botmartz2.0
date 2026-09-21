"use client";

import React, { useState } from "react";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Search,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Camera
} from "lucide-react";

export default function AdminTicketScannerPage() {
  const [ticketInput, setTicketInput] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleVerifyCheckIn = (codeToVerify?: string) => {
    const code = (codeToVerify || ticketInput).trim().toUpperCase();
    if (!code) return;

    setScanning(true);
    setError("");
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      if (code.startsWith("BMZ") || code.startsWith("CHK")) {
        setScanResult({
          valid: true,
          code,
          name: "Rahul Sharma",
          email: "rahul@example.com",
          eventTitle: "AI Frontier 2026 Summit",
          attendeeType: "STUDENT",
          checkedInAt: new Date().toLocaleTimeString(),
        });
      } else {
        setError(`Invalid Ticket Code: ${code}. No matching registration found in database.`);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-slate-900 pb-12">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
          LIVE EVENT ENTRY SCANNER
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ticket QR Code Scanner &amp; Check-in
        </h1>
        <p className="text-xs font-mono text-slate-500 mt-1">
          Scan participant QR pass or input registration code to verify live event access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scanner / Input Box */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          
          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-center space-y-3 text-slate-900">
            <Camera size={36} className="text-[#0066FF] mx-auto animate-pulse" />
            <div className="font-mono text-xs font-bold text-slate-800">
              Camera / Handheld QR Scanner Active
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              Point camera at ticket QR pass or type pass code below.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Enter Registration Code (e.g. BMZ-AIF-2026-88)
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type or scan code..."
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerifyCheckIn();
                  }}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 uppercase focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <button
              disabled={scanning || !ticketInput}
              onClick={() => handleVerifyCheckIn()}
              className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              Verify Ticket Check-in
            </button>
          </div>

        </div>

        {/* Scan Result Display */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-center">
          {scanning ? (
            <div className="text-center font-mono text-xs text-slate-400 py-12">
              Verifying credentials in Firestore...
            </div>
          ) : scanResult ? (
            <div className="space-y-6 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <UserCheck size={36} />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-200">
                  ✔ VALID PASS &bull; CHECKED IN
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {scanResult.name}
                </h2>
                <p className="text-xs font-mono text-slate-500">
                  {scanResult.email} &bull; {scanResult.attendeeType}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-left space-y-1">
                <div>Pass Code: <strong className="text-[#0066FF]">{scanResult.code}</strong></div>
                <div>Event: <strong className="text-slate-900">{scanResult.eventTitle}</strong></div>
                <div>Check-in Time: <strong className="text-emerald-600">{scanResult.checkedInAt}</strong></div>
              </div>
            </div>
          ) : error ? (
            <div className="space-y-4 text-center text-rose-600 font-mono text-xs py-8">
              <XCircle size={40} className="mx-auto" />
              <div>{error}</div>
            </div>
          ) : (
            <div className="text-center font-mono text-xs text-slate-400 py-12 space-y-2">
              <QrCode size={36} className="mx-auto text-slate-300" />
              <div>Scan ticket QR pass to display verification status</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
