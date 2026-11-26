"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const SECTIONS = [
  { id: "overview", num: "01", label: "1. Overview & Principles" },
  { id: "internship", num: "02", label: "2. 45-Day AI Fellowship" },
  { id: "workshops", num: "03", label: "3. Workshops & Bootcamps" },
  { id: "summits", num: "04", label: "4. Summits & Conferences" },
  { id: "digital-assets", num: "05", label: "5. Digital Goods & Karma Coins" },
  { id: "accidental-charges", num: "06", label: "6. Accidental / Wrong Captures" },
  { id: "timeline", num: "07", label: "7. Timelines & Processing" },
  { id: "how-to-request", num: "08", label: "8. How to Request a Refund" },
  { id: "grievance", num: "09", label: "9. Grievance Redressal Officer" },
];

export default function RefundPolicyClient() {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const rightScrollRef = useRef<HTMLDivElement>(null);

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

  // Scroll-spy on both window and the right-hand scrollable panel
  useEffect(() => {
    const container = rightScrollRef.current;

    const handleScroll = () => {
      const containerTop = container ? container.getBoundingClientRect().top : 0;
      const threshold = container && window.innerWidth >= 1024 ? containerTop + 80 : 160;
      let current = SECTIONS[0].id;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            current = sec.id;
          }
        }
      }
      setActiveSection(current);
    };

    container?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    const container = rightScrollRef.current;
    if (element && container && window.innerWidth >= 1024) {
      const topOffset = element.offsetTop - container.offsetTop;
      container.scrollTo({ top: topOffset, behavior: "smooth" });
    } else if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Stuck Navigation Sidebar */}
      <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start">
        <div className="bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-[11px] font-extrabold text-[#162774] uppercase tracking-wider mb-1">
              Policy Navigation
            </div>
            <h3 className="text-slate-950 font-extrabold text-lg font-sans">
              Table of Contents
            </h3>
          </div>

          <nav className="space-y-1.5 font-sans text-xs">
            {SECTIONS.map((sec) => {
              const active = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`group w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer font-bold ${
                    active
                      ? "bg-[#162774] text-[#D9F83B] shadow-sm"
                      : "bg-white/80 text-slate-700 hover:bg-white hover:text-[#162774] border border-slate-200/70"
                  }`}
                >
                  <span>{sec.label}</span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-180 ${
                      active
                        ? "bg-[#D9F83B] text-slate-950"
                        : "bg-slate-100 group-hover:bg-[#162774] text-slate-700 group-hover:text-[#D9F83B]"
                    }`}
                  >
                    <ArrowRight size={12} />
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Fast Contact Card */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="text-[11px] text-slate-600 font-medium">
              Have an urgent billing inquiry or need an immediate reversal?
            </div>
            <a
              href="mailto:support@botmartz.com?subject=Billing%20%26%20Refund%20Inquiry"
              className="w-full py-2.5 px-4 bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>support@botmartz.com</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Right Independently Scrollable Policy Content */}
      <div
        ref={rightScrollRef}
        className="lg:col-span-8 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 space-y-6 text-slate-700 font-sans leading-relaxed text-sm"
      >
        {/* Section 1 */}
        <section
          id="overview"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              01
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 1
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            Overview &amp; Core Principles
          </h2>
          <p>
            At <strong className="text-slate-950">Botmartz Community</strong> (governed by Founder Soham Sharma), we are dedicated to providing world-class software engineering fellowships, hands-on production workshops, and developer networking summits for authentic builders.
          </p>
          <p>
            We stand behind the quality and rigor of our programs. We understand that circumstances may change, technical difficulties may occur, or accidental payment captures may take place. This <strong className="text-slate-950">Refund &amp; Cancellation Policy</strong> sets forth transparent, equitable, and enforceable rules governing cancellations, reversals, and credit transfers.
          </p>
          <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] text-xs space-y-1">
            <div className="font-extrabold text-[#162774]">
              Razorpay 256-bit Encrypted Gateways &amp; RBI Compliance
            </div>
            <div className="text-slate-600">
              All approved refunds are remitted strictly back to the source bank account, credit card, debit card, or UPI VPA from which the original payment was processed in Indian Rupees (INR).
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section
          id="internship"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              02
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 2
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            45-Day Virtual AI Engineering Fellowship (₹299 / ₹1,999 Passes)
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200">
              <strong className="text-slate-950">7-Day Satisfaction Guarantee:</strong> If within <strong>7 calendar days</strong> of enrolling in the fellowship you determine that the curriculum or project simulator does not match your technical goals, you may request a <strong>100% full refund</strong>, provided you have not submitted code for the final Founder Audit or claimed the verified completion credential.
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200">
              <strong className="text-slate-950">Program Rescheduling or Cancellation by Botmartz:</strong> If Botmartz cancels a fellowship cohort or fundamentally alters core mentorship deliverables without a mutually agreeable alternative, a <strong>100% immediate refund</strong> will be issued to all affected students.
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200">
              <strong className="text-slate-950">After 7 Days:</strong> Beyond the 7-day initial satisfaction period, fellowship fees are generally non-refundable due to the allocation of cloud simulation resources and dedicated mentor bandwidth. However, students may request to pause their 45-day sprint clock or roll their enrollment over into a subsequent batch free of charge.
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section
          id="workshops"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              03
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 3
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            Live Engineering Workshops &amp; Masterclasses
          </h2>
          <ul className="space-y-3 list-disc pl-5 text-slate-700">
            <li>
              <strong className="text-slate-950">Cancellation 24+ Hours in Advance:</strong> Registered participants may cancel their workshop pass and receive a <strong>100% refund</strong> by notifying us at least 24 hours prior to the scheduled live session start time.
            </li>
            <li>
              <strong className="text-slate-950">Emergency Seat Transfer:</strong> If you are unable to attend due to unforeseen circumstances within 24 hours of the workshop, you can request a <strong>free transfer</strong> to the next upcoming workshop batch or receive 100% credit equivalent in Karma Coins.
            </li>
            <li>
              <strong className="text-slate-950">Post-Session Recordings:</strong> All paid workshop pass holders receive complete session recordings, architecture code repositories, and starter kits even if they miss the live livestream.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section
          id="summits"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              04
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 4
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            AI Summits, Conferences &amp; In-Person Events (e.g. AI Frontier 2026)
          </h2>
          <p>
            Due to fixed venue arrangements, catering reservations, and speaker logistic commitments:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-1.5">
              <div className="text-[#162774] font-extrabold">48+ Hours Prior to Event</div>
              <p className="text-slate-600">
                Full 100% refund or ticket transfer to another attendee of your choice at no cost.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-1.5">
              <div className="text-[#162774] font-extrabold">Within 48 Hours of Event</div>
              <p className="text-slate-600">
                Ticket transfers are supported up to 6 hours before opening doors. Direct monetary refunds are not permitted.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section
          id="digital-assets"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              05
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 5
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            Digital Goods, Karma Coins &amp; System PRD Blueprints
          </h2>
          <ul className="space-y-2.5 list-disc pl-5 text-slate-700">
            <li>
              <strong className="text-slate-950">Karma Coin Top-Up Packs:</strong> Unused Karma Coin packs purchased via Razorpay can be refunded within 7 days of purchase. Once coins have been spent on bounty rewards, code reviews, or platform unlockables, they cannot be converted back into fiat currency.
            </li>
            <li>
              <strong className="text-slate-950">Verified Credentials:</strong> Issued digital credentials and tamper-proof SHA-256 certificate hashes on the Botmartz registry cannot be refunded once generated and published.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section
          id="accidental-charges"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              06
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 6
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            Accidental Charges, Duplicate Captures &amp; Billing Errors
          </h2>
          <div className="p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] space-y-2 text-xs">
            <div className="font-extrabold text-sm text-[#162774]">100% Instant Reversal Guarantee</div>
            <p className="leading-relaxed text-slate-700">
              If your bank account or card was debited multiple times due to a network glitch, or if a payment was captured mistakenly, Botmartz guarantees an immediate, full reversal of the duplicate amount.
            </p>
            <p className="leading-relaxed text-slate-700">
              Our automated ledger and admin reconciliation team actively identifies and cleans erroneous captures. If you notice an error before we do, simply email us with your transaction proof for priority processing within <strong>24 hours</strong>.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section
          id="timeline"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              07
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 7
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            Refund Processing Timelines &amp; Settlement
          </h2>
          <p>Once a refund request is authorized by our finance team:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-center space-y-1">
              <div className="text-2xl font-black text-[#162774]">24–48h</div>
              <div className="text-slate-600 text-[11px] font-medium">Approval &amp; Initiation via Razorpay API</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-center space-y-1">
              <div className="text-2xl font-black text-[#162774]">5–7 Days</div>
              <div className="text-slate-600 text-[11px] font-medium">Bank / Card Network Settlement</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-center space-y-1">
              <div className="text-2xl font-black text-[#162774]">100% INR</div>
              <div className="text-slate-600 text-[11px] font-medium">Direct to Original Source Account</div>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section
          id="how-to-request"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              08
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 8
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            How to Request a Refund (Step-by-Step)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-1">
              <div className="font-extrabold text-[#162774]">STEP 1</div>
              <div className="font-bold text-slate-950">Collect Transaction ID</div>
              <div className="text-[11px] text-slate-600">Razorpay Payment ID (pay_xxx) and registered email address.</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-1">
              <div className="font-extrabold text-[#162774]">STEP 2</div>
              <div className="font-bold text-slate-950">Email Support Team</div>
              <div className="text-[11px] text-slate-600">Send an email to support@botmartz.com with order details.</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 space-y-1">
              <div className="font-extrabold text-[#162774]">STEP 3</div>
              <div className="font-bold text-slate-950">Reversal Issued</div>
              <div className="text-[11px] text-slate-600">Finance team reviews within 24 hours and issues reversal credit.</div>
            </div>
          </div>

          <div className="bg-[#F4F6FB] border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#162774] uppercase tracking-wider">
                Ready-to-Use Refund Request Template
              </span>
              <button
                type="button"
                onClick={copyTemplate}
                className="px-4 py-1.5 rounded-full bg-[#162774] hover:bg-[#1D3189] text-[#D9F83B] text-xs font-bold transition-all cursor-pointer"
              >
                {copied ? "Copied to Clipboard" : "Copy Template"}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {emailTemplate}
            </pre>
          </div>
        </section>

        {/* Section 9 */}
        <section
          id="grievance"
          className="scroll-mt-28 bg-white border border-slate-200 border-l-4 border-l-[#D9F83B] rounded-3xl p-7 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-[11px] flex items-center justify-center">
              09
            </span>
            <span className="text-[#162774] text-xs font-extrabold uppercase tracking-wider">
              Section 9
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950">
            Grievance Redressal &amp; Nodal Contact
          </h2>
          <p>
            In compliance with Indian Digital Commerce regulations and Consumer Protection standards, you may direct any unresolved billing disputes or escalated refund inquiries directly to our designated Grievance Officer:
          </p>
          <div className="p-5 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between gap-4 py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Designated Grievance Officer:</span>
              <span className="font-bold text-slate-950">Founder Soham Sharma</span>
            </div>
            <div className="flex justify-between gap-4 py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Official Organization:</span>
              <span className="font-bold text-slate-950">Botmartz Builders Community</span>
            </div>
            <div className="flex justify-between gap-4 py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Official Billing Email:</span>
              <span className="font-bold text-[#162774]">support@botmartz.com</span>
            </div>
            <div className="flex justify-between gap-4 py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Physical Tech Hub:</span>
              <span className="font-bold text-slate-800">Indore, Madhya Pradesh 452001, India</span>
            </div>
            <div className="flex justify-between gap-4 py-1.5">
              <span className="text-slate-500">Support Response SLA:</span>
              <span className="font-bold text-[#162774]">Within 24 Business Hours</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
