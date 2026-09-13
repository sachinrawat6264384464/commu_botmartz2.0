"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage("Invalid unsubscribe link. Parameters missing.");
      return;
    }

    const processUnsubscribe = async () => {
      try {
        const res = await fetch("/api/newsletter/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        });

        const data = await res.json();
        if (data.success) {
          setStatus("success");
          setMessage(data.message || "You have been unsubscribed from newsletter communications.");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to process unsubscribe request.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Network connection error. Please try again.");
      }
    };

    processUnsubscribe();
  }, [email, token]);

  return (
    <div className="min-h-screen bg-[#040914] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0A1124] p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Mail className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Botmartz Email Preferences</h1>

        {status === "loading" && (
          <div className="py-8 flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Processing your unsubscribe request...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-6 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
            <p className="text-xs text-slate-500">
              Note: You will still receive essential transactional and security emails related to your account.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="py-6 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm text-rose-300 leading-relaxed">{message}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <ShieldCheck className="h-4 w-4" />
            <span>DPDP Verified</span>
          </div>
          <Link href="/" className="text-slate-300 hover:text-white underline">
            Return to Botmartz
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#040914] flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
