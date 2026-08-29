import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MessageCircle, Sparkles, BookOpen, ShieldCheck } from "lucide-react";

export default function CommunityFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Community Hub */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center p-2">
                <Image
                  src="/logo.png"
                  alt="Botmartz Logo"
                  width={52}
                  height={52}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg leading-tight">
                    BOTMARTZ
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-[10px] font-mono font-bold uppercase">
                    COMMUNITY
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 font-medium mt-0.5">
                  AI Engineers, Builders &amp; Applied Research Ecosystem
                </div>
              </div>
            </div>

            <p className="text-slate-500 leading-relaxed text-xs max-w-sm">
              The official builder and developer hub of Botmartz AI Solutions. Flagship summits, developer discussions, project showcases, 48h hackathons, and weekly engineering rituals.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <MessageCircle size={14} />
                <span>Join WhatsApp Hub</span>
              </a>
              <a
                href="https://discord.gg/k75ZpEnzp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[11px] font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>Join Discord Server</span>
              </a>
            </div>
          </div>

          {/* Community Rituals */}
          <div>
            <h4 className="font-mono text-slate-900 uppercase tracking-wider mb-4 font-bold text-xs">Community Rituals</h4>
            <ul className="space-y-2.5">
              <li><Link href="/showcase" className="text-slate-600 hover:text-[#0066FF] transition-colors">🔥 Showcase Thursdays</Link></li>
              <li><Link href="/discussions?channel=resume-review" className="text-slate-600 hover:text-[#0066FF] transition-colors">📄 Wednesday Resume Reviews</Link></li>
              <li><Link href="/events?type=ama" className="text-slate-600 hover:text-[#0066FF] transition-colors">🎙️ 3rd Saturday AMAs</Link></li>
              <li><Link href="/challenges" className="text-slate-600 hover:text-[#0066FF] transition-colors">🏆 48h Arena Hackathons</Link></li>
              <li><Link href="/magazine" className="text-slate-600 hover:text-[#0066FF] transition-colors">📖 AI Engineering Magazine</Link></li>
            </ul>
          </div>

          {/* Events & Learning */}
          <div>
            <h4 className="font-mono text-slate-900 uppercase tracking-wider mb-4 font-bold text-xs">Events &amp; Media</h4>
            <ul className="space-y-2.5">
              <li><Link href="/events/ai-frontier-2026" className="text-slate-600 hover:text-[#0066FF] transition-colors">AI Frontier 2026 Summit</Link></li>
              <li><Link href="/events" className="text-slate-600 hover:text-[#0066FF] transition-colors">All Meetups &amp; Calendar</Link></li>
              <li><Link href="/workshops" className="text-slate-600 hover:text-[#0066FF] transition-colors">AI Accelerator Bootcamps</Link></li>
              <li><Link href="/gallery" className="text-slate-600 hover:text-[#0066FF] transition-colors">📸 Summit Photo Wall</Link></li>
              <li><Link href="/certificates" className="text-slate-600 hover:text-[#0066FF] transition-colors">Verify Certificate</Link></li>
            </ul>
          </div>

          {/* Botmartz Enterprise & Admin */}
          <div>
            <h4 className="font-mono text-slate-900 uppercase tracking-wider mb-4 font-bold text-xs">Enterprise &amp; Portal</h4>
            <ul className="space-y-2.5">
              <li><a href="https://www.botmartz.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#0066FF] transition-colors flex items-center gap-1"><span>Enterprise AI</span> <ExternalLink size={11} /></a></li>
              <li><a href="https://www.botmartz.com/implementation" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#0066FF] transition-colors flex items-center gap-1"><span>Implementation Model</span> <ExternalLink size={11} /></a></li>
              <li><a href="https://www.botmartz.com/work/labs/insurance-intelligence" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#0066FF] transition-colors flex items-center gap-1"><span>Insurance Lab</span> <ExternalLink size={11} /></a></li>
              <li><Link href="/admin/login" className="text-slate-400 hover:text-slate-700 text-[11px] font-mono flex items-center gap-1"><span>Staff &amp; Admin Login →</span></Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} Botmartz AI Solution Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://www.botmartz.com/privacy" className="hover:text-slate-600">Privacy</a>
            <a href="https://www.botmartz.com/terms" className="hover:text-slate-600">Terms</a>
            <a href="https://www.botmartz.com/contact" className="hover:text-slate-600">Contact</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
