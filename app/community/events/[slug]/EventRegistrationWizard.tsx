"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Download,
  Calendar as CalendarIcon,
  CheckCircle2,
  X,
  Loader2,
  Ticket,
  User,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";

interface WizardProps {
  eventTitle: string;
  eventSlug: string;
  eventDate: string;
  eventLocation: string;
  onClose: () => void;
}

export default function EventRegistrationWizard({
  eventTitle,
  eventSlug,
  eventDate,
  eventLocation,
  onClose,
}: WizardProps) {
  const [step, setStep] = useState<"form" | "ticket">("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attendeeType: "student",
    plan: "single",
  });
  const [registration, setRegistration] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please enter your name and email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/community/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success && data.registration) {
        setRegistration(data.registration);
        setStep("ticket");
      } else {
        alert(data.error || "Failed to register.");
      }
    } catch (err: any) {
      alert(err.message || "Error processing registration.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PNG Ticket Pass via HTML5 Canvas
  const handleDownloadTicketPass = () => {
    if (!registration) return;

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 420);
    gradient.addColorStop(0, "#040914");
    gradient.addColorStop(0.5, "#0B1524");
    gradient.addColorStop(1, "#001D4A");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 420);

    // Accent Lines & Border
    ctx.strokeStyle = "#0066FF";
    ctx.lineWidth = 4;
    ctx.strokeRect(15, 15, 770, 390);

    ctx.strokeStyle = "rgba(0, 184, 240, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(25, 25, 750, 370);

    // Header Text
    ctx.fillStyle = "#00B8F0";
    ctx.font = "bold 14px monospace";
    ctx.fillText("BOTMARTZ OFFICIAL EVENT PASS", 45, 60);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(eventTitle.substring(0, 40), 45, 95);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "14px monospace";
    ctx.fillText(`Date: ${eventDate}  |  Location: ${eventLocation}`, 45, 125);

    // Divider Line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(45, 145);
    ctx.lineTo(755, 145);
    ctx.stroke();

    // Attendee Info
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`ATTENDEE: ${registration.name.toUpperCase()}`, 45, 185);

    ctx.fillStyle = "#64748B";
    ctx.font = "14px monospace";
    ctx.fillText(`EMAIL: ${registration.email}`, 45, 215);
    ctx.fillText(`TYPE: ${registration.attendeeType.toUpperCase()}`, 45, 240);

    // Registration Code Badge Box
    ctx.fillStyle = "#0066FF";
    ctx.fillRect(45, 270, 320, 55);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 18px monospace";
    ctx.fillText(`PASS CODE: ${registration.registrationCode}`, 65, 305);

    // Simulated QR Code Box on the Right
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(580, 180, 160, 160);

    ctx.fillStyle = "#040914";
    ctx.fillRect(595, 195, 130, 130);

    ctx.fillStyle = "#00B8F0";
    ctx.font = "bold 12px monospace";
    ctx.fillText("SCAN AT VENUE", 605, 360);

    // Watermark
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "12px monospace";
    ctx.fillText("Present this pass at event entry scanner. Valid for 1 attendee.", 45, 375);

    // Trigger Download
    const link = document.createElement("a");
    link.download = `Event-Pass-${registration.registrationCode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Generate .ics Calendar File Download
  const handleDownloadCalendarICS = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Botmartz Community//AI Events//EN
BEGIN:VEVENT
SUMMARY:${eventTitle}
DESCRIPTION:Registration Code: ${registration?.registrationCode || "CONFIRMED"}. Organized by Botmartz Community.
LOCATION:${eventLocation}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${eventSlug}-event.ics`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#091121] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="text-xs font-mono text-[#00B8F0] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                <Ticket size={14} />
                <span>STEP 1 OF 2 — EVENT REGISTRATION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Get Your Official Event Pass
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                {eventTitle} &bull; {eventDate}
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Phone Number (WhatsApp)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Attendee Type */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">I am registering as:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendeeType: "student" })}
                    className={`py-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      formData.attendeeType === "student"
                        ? "bg-[#0066FF] text-white border-[#0066FF]"
                        : "bg-slate-900 text-slate-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    Student / Learner
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendeeType: "professional" })}
                    className={`py-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      formData.attendeeType === "professional"
                        ? "bg-[#0066FF] text-white border-[#0066FF]"
                        : "bg-slate-900 text-slate-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    Working Professional
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating Event Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Confirm &amp; Generate Ticket Pass</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                REGISTRATION CONFIRMED!
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Your Event Pass is Ready
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Pass Code: <span className="text-[#00B8F0] font-bold">{registration?.registrationCode}</span>
              </p>
            </div>

            {/* Simulated Pass Preview Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 text-left font-mono text-xs space-y-2">
              <div className="text-[#00B8F0] font-bold">{eventTitle}</div>
              <div className="text-slate-300 font-bold">{registration?.name}</div>
              <div className="text-slate-500">{registration?.email}</div>
              <div className="text-emerald-400 font-bold pt-2 border-t border-white/5">
                Check-in Code: {registration?.checkInCode}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 font-mono text-xs">
              <button
                onClick={handleDownloadTicketPass}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Download size={16} />
                <span>Download Pass PNG (Event-Pass-{registration?.registrationCode}.png)</span>
              </button>

              <button
                onClick={handleDownloadCalendarICS}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
              >
                <CalendarIcon size={16} className="text-[#00B8F0]" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white pt-2 cursor-pointer block mx-auto font-mono"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
