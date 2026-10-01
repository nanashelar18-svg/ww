import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, LogOut, Building2 } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-white/10 bg-nexus-surface/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & AI Engine Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-black font-bold" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Nexus<span className="text-cyan-400">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold tracking-widest text-cyan-400/90 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase">
              ENTERPRISE OPS
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Gemini 1.5 Flash Reasoning Active</span>
        </div>
      </div>

      {/* User info & Actions */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="hidden md:flex items-center gap-2 text-xs bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-lg text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user.department}</span>
              <span className="text-slate-500">•</span>
              <span className="capitalize font-semibold text-purple-400">{user.role}</span>
            </div>

            <div className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-full border border-cyan-500/30 object-cover"
              />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-white leading-tight">{user.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
