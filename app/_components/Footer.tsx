import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function CommunityFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#0066FF] flex items-center justify-center font-bold font-mono text-white text-sm shadow-sm">
                B
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-sm">
                BOTMARTZ COMMUNITY
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs max-w-sm mb-6">
              The developer, researcher, and builder hub of Botmartz AI Solutions. Flagship summits, developer discussions, project showcases, and hands-on cohorts.
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              community.botmartz.com
            </div>
          </div>

          <div>
            <h4 className="font-mono text-slate-900 uppercase tracking-wider mb-4 font-bold text-xs">Community Hub</h4>
            <ul className="space-y-2.5">
              <li><Link href="/discussions" className="text-slate-600 hover:text-[#0066FF] transition-colors">Discussions &amp; Forum</Link></li>
              <li><Link href="/showcase" className="text-slate-600 hover:text-[#0066FF] transition-colors">Builder Showcase</Link></li>
              <li><Link href="/challenges" className="text-slate-600 hover:text-[#0066FF] transition-colors">Hackathons &amp; Arena</Link></li>
              <li><Link href="/leaderboard" className="text-slate-600 hover:text-[#0066FF] transition-colors">Hall of Fame</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-slate-900 uppercase tracking-wider mb-4 font-bold text-xs">Events &amp; Learning</h4>
            <ul className="space-y-2.5">
              <li><Link href="/events/ai-frontier-2026" className="text-slate-600 hover:text-[#0066FF] transition-colors">AI Frontier 2026 Summit</Link></li>
              <li><Link href="/events" className="text-slate-600 hover:text-[#0066FF] transition-colors">All Meetups &amp; Calendar</Link></li>
              <li><Link href="/workshops" className="text-slate-600 hover:text-[#0066FF] transition-colors">AI Accelerator Bootcamps</Link></li>
              <li><Link href="/certificates" className="text-slate-600 hover:text-[#0066FF] transition-colors">Verify Certificate</Link></li>
              <li><Link href="/gallery" className="text-slate-600 hover:text-[#0066FF] transition-colors">Photo Wall</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-slate-900 uppercase tracking-wider mb-4 font-bold text-xs">Botmartz Enterprise</h4>
            <ul className="space-y-2.5">
              <li><a href="https://www.botmartz.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#0066FF] transition-colors flex items-center gap-1"><span>Enterprise AI</span> <ExternalLink size={11} /></a></li>
              <li><a href="https://www.botmartz.com/implementation" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#0066FF] transition-colors flex items-center gap-1"><span>Implementation Model</span> <ExternalLink size={11} /></a></li>
              <li><a href="https://www.botmartz.com/work/labs/insurance-intelligence" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#0066FF] transition-colors flex items-center gap-1"><span>Insurance Intelligence Lab</span> <ExternalLink size={11} /></a></li>
              <li><Link href="/admin" className="text-slate-400 hover:text-slate-600 text-[11px] font-mono">Community Admin CMS →</Link></li>
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
