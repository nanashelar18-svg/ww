import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@nexus.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  const demoPersonas = [
    { name: 'Sarah Chen', email: 'admin@nexus.ai', role: 'Operations Lead (Admin)', dept: 'Operations', color: 'border-cyan-500/40 text-cyan-400' },
    { name: 'Alex Rivera', email: 'tech@nexus.ai', role: 'Engineering Lead', dept: 'Engineering', color: 'border-blue-500/40 text-blue-400' },
    { name: 'Elena Rostova', email: 'hr@nexus.ai', role: 'People Ops Manager', dept: 'Human Resources', color: 'border-purple-500/40 text-purple-400' },
    { name: 'Marcus Vance', email: 'legal@nexus.ai', role: 'Legal Counsel', dept: 'Legal & Compliance', color: 'border-amber-500/40 text-amber-400' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-nexus-dark relative overflow-hidden">
      {/* Background Cyber Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-black font-bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Nexus<span className="text-cyan-400">AI</span> Enterprise
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous Cross-Department Operations & Knowledge Platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-3xl bg-nexus-surface/85 backdrop-blur-xl border border-white/10 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Enterprise Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Master Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In with Enterprise SSO</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>1-Click Hackathon Evaluator Personas:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoPersonas.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(p.email)}
                  className={`p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border ${p.color} text-left transition-all`}
                >
                  <div className="text-[11px] font-bold text-white">{p.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono truncate">{p.role}</div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 text-center font-mono">
              Password pre-seeded: <code>password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
