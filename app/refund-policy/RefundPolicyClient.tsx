"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Mail,
  Copy,
  Check,
  HelpCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CreditCard,
  Building2,
  Calendar,
  Lock,
  ChevronRight
} from "lucide-react";

export default function RefundPolicyClient() {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  const emailTemplate = `Subject: Refund Request - [Your Full Name] - Order ID: [Your Order/Payment ID]

Dear Botmartz Support & Billing Team,

I would like to request a refund / cancellation for my recent transaction. Below are my order details:

- Full Name: [Your Full Name]
- Registered Email Address: [Your Email]
- Phone Number / WhatsApp: [Your Phone Number]
- Razorpay Payment ID: [e.g. pay_Q89xXXXXXX]
- Order ID / Invoice Number: [e.g. order_XXXXX or INV-XXXXX]
- Item Purchased: [e.g. 45-Day Virtual AI Internship Pass / Workshop Pass / Summit Ticket]
- Date of Transaction: [DD/MM/YYYY]
- Reason for Refund Request: [Brief description of reason]
- Preferred Refund Mode: [Original Payment Method via Razorpay / Direct UPI / Bank Transfer]

Please review and initiate the reversal as per the Botmartz Refund & Cancellation Policy.

Thank you,
[Your Name]`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(emailTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const sections = [
    { id: "overview", label: "1. Overview & Principles" },
    { id: "internship", label: "2. 45-Day AI Fellowship" },
    { id: "workshops", label: "3. Workshops & Bootcamps" },
    { id: "summits", label: "4. Summits & Conferences" },
    { id: "digital-assets", label: "5. Digital Goods & Karma Coins" },
    { id: "accidental-charges", label: "6. Accidental / Wrong Captures" },
    { id: "timeline", label: "7. Timelines & Processing" },
    { id: "how-to-request", label: "8. How to Request a Refund" },
    { id: "grievance", label: "9. Grievance Redressal Officer" }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-24 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0066FF] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Policy Navigation</span>
            </div>
            <h3 className="text-white font-bold text-base font-sans">
              Table of Contents
            </h3>
          </div>

          <nav className="space-y-1 font-mono text-xs">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === sec.id
                    ? "bg-[#0066FF] text-white font-bold shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <span>{sec.label}</span>
                <ChevronRight size={13} className={activeSection === sec.id ? "text-white" : "text-slate-600"} />
              </button>
            ))}
          </nav>

          {/* Fast Contact Card */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="text-[11px] text-slate-400 font-mono">
              Have an urgent billing inquiry or need an immediate reversal?
            </div>
            <a
              href="mailto:support@botmartz.com?subject=Billing%20%26%20Refund%20Inquiry"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <Mail size={13} className="text-amber-400" />
              <span>support@botmartz.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-10 text-slate-300 font-sans leading-relaxed text-sm">
        
        {/* Section 1: Overview & Principles */}
        <section id="overview" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <RotateCcw size={16} className="text-emerald-400" />
            <span>Section 1</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            Overview &amp; Core Principles
          </h2>
          <p>
            At <strong>Botmartz Community</strong> (governed by Founder Soham Sharma), we are dedicated to providing world-class software engineering fellowships, hands-on production workshops, and developer networking summits for authentic builders.
          </p>
          <p>
            We stand behind the quality and rigor of our programs. We understand that circumstances may change, technical difficulties may occur, or accidental payment captures may take place. This <strong>Refund &amp; Cancellation Policy</strong> sets forth transparent, equitable, and enforceable rules governing cancellations, reversals, and credit transfers.
          </p>
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-blue-200 text-xs font-mono space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Razorpay 256-bit Encrypted Gateways &amp; RBI Compliance</span>
            </div>
            <div>
              All approved refunds are remitted strictly back to the source bank account, credit card, debit card, or UPI VPA from which the original payment was processed in Indian Rupees (INR).
            </div>
          </div>
        </section>

        {/* Section 2: 45-Day AI Fellowship */}
        <section id="internship" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles size={16} className="text-amber-400" />
            <span>Section 2</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            45-Day Virtual AI Engineering Fellowship (₹299 / ₹1,999 Passes)
          </h2>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">7-Day Satisfaction Guarantee:</strong> If within <strong>7 calendar days</strong> of enrolling in the fellowship you determine that the curriculum or project simulator does not match your technical goals, you may request a <strong>100% full refund</strong>, provided you have not submitted code for the final Founder Audit or claimed the verified completion credential.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Program Rescheduling or Cancellation by Botmartz:</strong> If Botmartz cancels a fellowship cohort or fundamentally alters core mentorship deliverables without a mutually agreeable alternative, a <strong>100% immediate refund</strong> will be issued to all affected students.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
              <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">After 7 Days:</strong> Beyond the 7-day initial satisfaction period, fellowship fees are generally non-refundable due to the allocation of cloud simulation resources and dedicated mentor bandwidth. However, students may request to pause their 45-day sprint clock or roll their enrollment over into a subsequent batch free of charge.
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Workshops & Bootcamps */}
        <section id="workshops" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <FileText size={16} className="text-cyan-400" />
            <span>Section 3</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            Live Engineering Workshops &amp; Masterclasses
          </h2>
          <ul className="space-y-3 list-disc pl-5 text-slate-300">
            <li>
              <strong className="text-white">Cancellation 24+ Hours in Advance:</strong> Registered participants may cancel their workshop pass and receive a <strong>100% refund</strong> by notifying us at least 24 hours prior to the scheduled live session start time.
            </li>
            <li>
              <strong className="text-white">Emergency Seat Transfer:</strong> If you are unable to attend due to unforeseen circumstances within 24 hours of the workshop, you can request a <strong>free transfer</strong> to the next upcoming workshop batch or receive 100% credit equivalent in Karma Coins.
            </li>
            <li>
              <strong className="text-white">Post-Session Recordings:</strong> All paid workshop pass holders receive complete session recordings, architecture code repositories, and starter kits even if they miss the live livestream.
            </li>
          </ul>
        </section>

        {/* Section 4: Summits & In-Person Events */}
        <section id="summits" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <Building2 size={16} className="text-purple-400" />
            <span>Section 4</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            AI Summits, Conferences &amp; In-Person Events (e.g. AI Frontier 2026)
          </h2>
          <div className="space-y-3 text-slate-300">
            <p>
              Due to fixed venue arrangements, catering reservations, and speaker logistic commitments:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="text-emerald-400 font-bold">48+ Hours Prior to Event</div>
                <p className="text-slate-400 font-sans text-xs">
                  Full 100% refund or ticket transfer to another attendee of your choice at no cost.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="text-amber-400 font-bold">Within 48 Hours of Event</div>
                <p className="text-slate-400 font-sans text-xs">
                  Ticket transfers are supported up to 6 hours before opening doors. Direct monetary refunds are not permitted.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Digital Goods & Karma Coins */}
        <section id="digital-assets" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <CreditCard size={16} className="text-teal-400" />
            <span>Section 5</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            Digital Goods, Karma Coins &amp; System PRD Blueprints
          </h2>
          <ul className="space-y-2.5 list-disc pl-5 text-slate-300">
            <li>
              <strong>Karma Coin Top-Up Packs:</strong> Unused Karma Coin packs purchased via Razorpay can be refunded within 7 days of purchase. Once coins have been spent on bounty rewards, code reviews, or platform unlockables, they cannot be converted back into fiat currency.
            </li>
            <li>
              <strong>Verified Credentials:</strong> Issued digital credentials and tamper-proof SHA-256 certificate hashes on the Botmartz registry cannot be refunded once generated and published.
            </li>
          </ul>
        </section>

        {/* Section 6: Accidental / Wrong Captures */}
        <section id="accidental-charges" className="bg-slate-900/60 border border-rose-900/40 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle size={16} className="text-rose-400" />
            <span>Section 6</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            Accidental Charges, Duplicate Captures &amp; Billing Errors
          </h2>
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-rose-200 space-y-2 text-xs font-mono">
            <div className="font-bold text-sm text-rose-300">100% Instant Reversal Guarantee</div>
            <p className="font-sans leading-relaxed">
              If your bank account or card was debited multiple times due to a network glitch, or if a payment was captured mistakenly, Botmartz guarantees an immediate, full reversal of the duplicate amount.
            </p>
            <p className="font-sans leading-relaxed">
              Our automated ledger and admin reconciliation team actively identifies and cleans erroneous captures. If you notice an error before we do, simply email us with your transaction proof for priority processing within <strong>24 hours</strong>.
            </p>
          </div>
        </section>

        {/* Section 7: Timelines & Processing */}
        <section id="timeline" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <Clock size={16} className="text-amber-400" />
            <span>Section 7</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            Refund Processing Timelines &amp; Settlement
          </h2>
          <p>
            Once a refund request is authorized by our finance team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <div className="text-2xl font-black text-white">24-48h</div>
              <div className="text-slate-400 text-[11px]">Approval &amp; Initiation via Razorpay API</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <div className="text-2xl font-black text-emerald-400">5-7 Days</div>
              <div className="text-slate-400 text-[11px]">Bank / Card Network Settlement</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-1">
              <div className="text-2xl font-black text-[#0066FF]">100% INR</div>
              <div className="text-slate-400 text-[11px]">Direct to Original Source Account</div>
            </div>
          </div>
        </section>

        {/* Section 8: How to Request a Refund + Copy Template */}
        <section id="how-to-request" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-5">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <Mail size={16} className="text-[#0066FF]" />
            <span>Section 8</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            How to Request a Refund (Step-by-Step)
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                <div className="font-bold text-[#0066FF]">STEP 1</div>
                <div className="font-bold text-white">Collect Transaction ID</div>
                <div className="text-[11px] text-slate-400">Razorpay Payment ID (`pay_xxx`) and registered email address.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                <div className="font-bold text-[#0066FF]">STEP 2</div>
                <div className="font-bold text-white">Email Support Team</div>
                <div className="text-[11px] text-slate-400">Send an email to <code>support@botmartz.com</code> with order details.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400">STEP 3</div>
                <div className="font-bold text-white">Reversal Issued</div>
                <div className="text-[11px] text-slate-400">Finance team reviews within 24 hours and issues reversal credit.</div>
              </div>
            </div>

            {/* Interactive Template Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Ready-to-Use Refund Request Template
                </span>
                <button
                  type="button"
                  onClick={copyTemplate}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {emailTemplate}
              </pre>
            </div>
          </div>
        </section>

        {/* Section 9: Grievance Redressal Officer */}
        <section id="grievance" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider">
            <Building2 size={16} className="text-emerald-400" />
            <span>Section 9</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-sans">
            Grievance Redressal &amp; Nodal Contact
          </h2>
          <p>
            In compliance with Indian Digital Commerce regulations and Consumer Protection standards, you may direct any unresolved billing disputes or escalated refund inquiries directly to our designated Grievance Officer:
          </p>
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Designated Grievance Officer:</span>
              <span className="font-bold text-white">Founder Soham Sharma</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Official Organization:</span>
              <span className="font-bold text-white">Botmartz Builders Community</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Official Billing Email:</span>
              <span className="font-bold text-[#0066FF]">support@botmartz.com</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Physical Tech Hub:</span>
              <span className="font-bold text-slate-300">Indore, Madhya Pradesh 452001, India</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Support Response SLA:</span>
              <span className="font-bold text-emerald-400">Within 24 Business Hours</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
