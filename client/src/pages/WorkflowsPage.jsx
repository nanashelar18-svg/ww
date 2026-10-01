import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  Terminal, 
  RotateCw,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState(null);
  const [activeRunResult, setActiveRunResult] = useState(null);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const [wRes, rRes] = await Promise.all([
        api.get('/workflows'),
        api.get('/workflows/runs')
      ]);
      if (wRes.data.success) setWorkflows(wRes.data.workflows);
      if (rRes.data.success) setRuns(rRes.data.runs);
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleTriggerWorkflow = async (workflowId) => {
    try {
      setExecutingId(workflowId);
      setActiveRunResult(null);

      // Simulate a small delay for realistic agent orchestration visual
      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await api.post(`/workflows/${workflowId}/trigger`, {
        timestamp: new Date().toISOString(),
        initiated_from: 'Enterprise UI'
      });

      if (res.data.success) {
        setActiveRunResult(res.data.run);
        fetchWorkflows();
      }
    } catch (err) {
      alert('Workflow execution error: ' + (err.response?.data?.message || err.message));
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>Autonomous Workflow Orchestrator</span>
          <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            MULTI-AGENT ENGINE
          </span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Eliminate manual cross-department handoffs through coordinated AI agents executing multi-step protocols.
        </p>
      </div>

      {/* Active Run Execution Spotlight */}
      {activeRunResult && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/40 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Workflow Orchestration Completed: "{activeRunResult.workflow_name}"
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              ALL STEPS SIGNED ✓
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {activeRunResult.step_results?.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">Step {step.order}</span>
                  <span className="text-slate-500">{step.department}</span>
                </div>
                <div className="text-xs font-semibold text-white">{step.action}</div>
                <p className="text-[11px] text-slate-400 italic pt-1">{step.agentLog}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Catalog */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-mono text-sm">
          Loading automated workflow pipelines...
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-emerald-400" />
            <span>Configured Enterprise Pipelines</span>
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {workflows.map((wf) => {
              const isExecuting = executingId === wf.id;

              return (
                <div 
                  key={wf.id}
                  className="p-6 rounded-3xl bg-nexus-surface/70 border border-white/10 hover:border-emerald-500/30 transition-all space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-white">{wf.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          {wf.execution_count || 0} Successful Executions
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {wf.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTriggerWorkflow(wf.id)}
                      disabled={isExecuting}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto flex-shrink-0"
                    >
                      {isExecuting ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching Agents...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Trigger Autonomous Run</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Trigger event pill */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                    <span className="text-cyan-400 font-bold">TRIGGER:</span>
                    <span>{wf.trigger_event}</span>
                  </div>

                  {/* Step-by-Step Multi-Department Flow */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">
                      Coordinated Department Sequence:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {wf.steps?.map((st, sIdx) => (
                        <div key={sIdx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5 relative">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-cyan-400 font-bold">Step {st.order}</span>
                            <span className="text-slate-400 font-medium">{st.department}</span>
                          </div>
                          <div className="text-xs text-slate-200 leading-tight">
                            {st.action}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-mono pt-1">
                            ✓ Auto-Agent Handled
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Historical Runs Table */}
      {runs.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span>Recent Autonomous Orchestration Runs</span>
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-nexus-surface/40">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-5 py-3">Run ID</th>
                  <th className="px-5 py-3">Workflow Name</th>
                  <th className="px-5 py-3">Initiated By</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {runs.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-mono font-bold text-cyan-400">#{r.id}</td>
                    <td className="px-5 py-3 font-semibold text-white">{r.workflow_name}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono">{r.initiated_by}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono">
                      {new Date(r.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
