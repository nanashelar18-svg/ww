import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  Send, 
  CheckCircle, 
  Building2, 
  User,
  AlertCircle
} from 'lucide-react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_department: 'Engineering',
    category: 'Operational Request'
  });
  const [submitting, setSubmitting] = useState(false);
  const [replyLoadingId, setReplyLoadingId] = useState(null);

  const departments = ['All', 'Engineering', 'Human Resources', 'Legal & Compliance', 'Customer Support', 'Operations'];

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (deptFilter !== 'All') params.department = deptFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get('/tickets', { params });
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [deptFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/tickets', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          target_department: 'Engineering',
          category: 'Operational Request'
        });
        fetchTickets();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.patch(`/tickets/${ticketId}`, { status: newStatus });
      fetchTickets();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleGenerateAiReply = async (ticketId) => {
    try {
      setReplyLoadingId(ticketId);
      const res = await api.post(`/tickets/${ticketId}/generate-ai-reply`);
      if (res.data.success) {
        fetchTickets();
      }
    } catch (err) {
      console.error('Failed to generate AI reply:', err);
    } finally {
      setReplyLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Cross-Department Ticket Hub</span>
            <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
              AI AUTO-TRIAGED
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated priority grading, sentiment scoring, and cross-department resolution recommendations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Cross-Dept Request</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-nexus-surface/80 border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Department:</span>
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                deptFilter === dept
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, requests, tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 font-mono text-sm">
          Loading cross-department queue...
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-nexus-surface/40 border border-dashed border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Tickets Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your department filter or create a new request.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div 
              key={t.id}
              className="p-5 sm:p-6 rounded-2xl bg-nexus-surface/70 border border-white/10 hover:border-cyan-500/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-400">#{t.id}</span>
                  <h3 className="text-base font-bold text-white">{t.title}</h3>
                  
                  {/* Priority Tag */}
                  <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    t.priority === 'urgent'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : t.priority === 'high'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }`}>
                    {t.priority} priority
                  </span>

                  {/* Sentiment */}
                  {t.ai_sentiment && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Sentiment: {t.ai_sentiment}
                    </span>
                  )}
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_on_dept">Waiting on Dept</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Description & Details */}
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Target: <strong className="text-white">{t.target_department}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Requester: {t.requester_name}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SLA Guarantee: {t.sla_hours || 24}h</span>
                </span>
              </div>

              {/* AI Auto-Triage & Suggested Response Box */}
              {(t.ai_suggested_response || t.ai_cross_dept_action) && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-cyan-950/20 border border-cyan-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini Auto-Triage Resolution Plan</span>
                    </div>

                    <button
                      onClick={() => handleGenerateAiReply(t.id)}
                      disabled={replyLoadingId === t.id}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1"
                    >
                      {replyLoadingId === t.id ? 'Re-evaluating...' : 'Regenerate'}
                    </button>
                  </div>

                  {t.ai_cross_dept_action && (
                    <div className="text-xs text-slate-300">
                      <strong className="text-cyan-300">Action Plan: </strong>
                      {t.ai_cross_dept_action}
                    </div>
                  )}

                  {t.ai_suggested_response && (
                    <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 italic">
                      "{t.ai_suggested_response}"
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating New Ticket */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexus-surface border border-white/20 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Create Cross-Department Request</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Request Subject / Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Urgent Security Review for Vendor DPA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Department
                  </label>
                  <select
                    value={formData.target_department}
                    onChange={(e) => setFormData({ ...formData, target_department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Compliance, Onboarding"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Operational Description
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide complete context. NexusAI will automatically analyze priority, grade SLA requirements, and draft initial resolution steps."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>On submit, Gemini 1.5 Flash will automatically score sentiment, assign priority, and suggest a cross-department plan.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  {submitting ? 'Submitting & Triaging...' : 'Submit & Auto-Triage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
