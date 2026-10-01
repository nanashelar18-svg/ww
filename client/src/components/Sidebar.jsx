import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  BookOpen, 
  Workflow, 
  ShieldCheck, 
  Bot, 
  Activity 
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', label: 'Executive Hub', icon: LayoutDashboard, badge: 'Live' },
    { to: '/tickets', label: 'Cross-Dept Tickets', icon: Layers, badge: 'AI Triage' },
    { to: '/knowledge', label: 'Enterprise Brain (RAG)', icon: BookOpen, badge: 'Citations' },
    { to: '/workflows', label: 'Workflow Agents', icon: Workflow, badge: 'Autonomous' },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-nexus-surface/60 backdrop-blur-xl flex flex-col justify-between p-4 hidden md:flex">
      <div className="space-y-6">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3">
          ENTERPRISE MODULES
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Operational Pulse Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI Autonomous Engine</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          68% of manual triage deflected automatically via multi-agent routing.
        </p>
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
          <span>SLA Uptime</span>
          <span className="text-emerald-400 font-bold">97.4%</span>
        </div>
      </div>
    </aside>
  );
}
