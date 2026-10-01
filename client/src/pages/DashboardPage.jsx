import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  RefreshCw,
  Building,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsights = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/insights/executive-summary');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching executive briefing:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-sm font-mono text-slate-400">Synthesizing Enterprise Operational Pulse...</span>
      </div>
    );
  }

  const { stats, briefing } = data || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Operations Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time cross-department telemetry, automated workflow orchestration, and AI-synthesized health briefings.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Regenerate AI Briefing</span>
        </button>
      </div>

      {/* AI Executive Briefing Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Gemini Executive Synthesis</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            "{briefing?.executiveSummary || 'Enterprise operations progressing smoothly across all divisions.'}"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Operational Bottlenecks */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Detected Bottlenecks</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {briefing?.operationalBottlenecks?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended AI Actions */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Recommended Actions</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {briefing?.recommendedActions?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-nexus-surface/80 border border-white/10 space-y-2 glass-panel-hover transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Requests</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats?.totalTickets || 0}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{stats?.aiDeflectionRate} auto-deflected by AI</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-nexus-surface/80 border border-rose-500/20 space-y-2 glass-panel-hover transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Urgent Queue</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-300 font-mono">{stats?.urgentTickets || 0}</div>
          <div className="text-[11px] text-rose-400/80">Average resolution: 2.4 hrs</div>
        </div>

        <div className="p-5 rounded-2xl bg-nexus-surface/80 border border-white/10 space-y-2 glass-panel-hover transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Autonomous Runs</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300 font-mono">{stats?.totalWorkflowRuns || 0}</div>
          <div className="text-[11px] text-purple-400/80">{stats?.activeWorkflows} active multi-dept flows</div>
        </div>

        <div className="p-5 rounded-2xl bg-nexus-surface/80 border border-white/10 space-y-2 glass-panel-hover transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Enterprise SLA</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 font-mono">{stats?.slaComplianceRate}</div>
          <div className="text-[11px] text-emerald-400/80">Zero contract SLA breaches</div>
        </div>
      </div>

      {/* Departmental Health Radar Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Department Operational Posture</h3>
          <span className="text-xs text-slate-400 font-mono">Automated AI Health Scoring</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {briefing?.departmentalHealth?.map((dept, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-nexus-surface/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{dept.department}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  dept.status === 'Optimal' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {dept.status}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Efficiency Index</span>
                  <span className="font-mono font-bold text-white">{dept.healthScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.healthScore >= 90 ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} 
                    style={{ width: `${dept.healthScore}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{dept.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <Link 
          to="/tickets"
          className="group p-6 rounded-2xl bg-nexus-surface/60 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">Cross-Dept Ticket Hub</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-classify requests, generate draft responses via Gemini, and route across divisions.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
            <span>Explore Ticket Queue</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link 
          to="/knowledge"
          className="group p-6 rounded-2xl bg-nexus-surface/60 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">Enterprise Knowledge Brain</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Query policies and standard operating procedures with accurate citations via Gemini RAG.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
            <span>Query Knowledge Base</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link 
          to="/workflows"
          className="group p-6 rounded-2xl bg-nexus-surface/60 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">Autonomous Workflows</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trigger multi-agent onboarding, vendor risk scoring, and SEV-1 rapid triage runbooks in 1-click.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>Run Workflows</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
