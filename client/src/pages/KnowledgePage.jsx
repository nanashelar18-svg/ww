import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  FileText, 
  Plus, 
  ExternalLink, 
  CheckCircle, 
  ShieldCheck,
  Building,
  Tag
} from 'lucide-react';

export default function KnowledgePage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');
  
  // RAG Query State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // New Doc Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'policy',
    department: 'Engineering',
    content: '',
    tags: ''
  });
  const [docSubmitting, setDocSubmitting] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const params = selectedDept !== 'All' ? { department: selectedDept } : {};
      const res = await api.get('/docs', { params });
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch docs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedDept]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    try {
      setAiLoading(true);
      const res = await api.post('/docs/query-ai', { query: aiQuery });
      if (res.data.success) {
        setAiResult(res.data);
      }
    } catch (err) {
      console.error('AI Knowledge query error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    try {
      setDocSubmitting(true);
      const res = await api.post('/docs', newDoc);
      if (res.data.success) {
        setIsModalOpen(false);
        setNewDoc({ title: '', category: 'policy', department: 'Engineering', content: '', tags: '' });
        fetchDocs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create document');
    } finally {
      setDocSubmitting(false);
    }
  };

  const sampleQueries = [
    "What are our mandatory token expiration and MFA standards?",
    "What is the standard SLA for employee equipment dispatch?",
    "What indemnification clause is required for vendor contracts over $25k?",
    "What are the mandatory steps in a SEV-1 outage incident?"
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Enterprise Knowledge Brain</span>
            <span className="text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              RAG & CITATIONS
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Query company policies, security guidelines, and SOPs with verifiable source citations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Policy / SOP</span>
        </button>
      </div>

      {/* RAG Search Engine Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30 border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Ask NexusAI Semantic Knowledge Engine</span>
        </div>

        <form onSubmit={handleAskAI} className="relative">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'What is our protocol for SEV-1 incidents or vendor liability?')..."
            className="w-full bg-slate-950/90 border border-purple-500/40 rounded-2xl px-5 py-4 pl-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner"
          />
          <Search className="w-5 h-5 text-purple-400 absolute left-4 top-4" />

          <button
            type="submit"
            disabled={aiLoading}
            className="absolute right-2.5 top-2.5 px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            {aiLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Search Brain</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">Try asking:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setAiQuery(q); }}
              className="text-[11px] bg-slate-800/80 hover:bg-purple-900/30 border border-slate-700/80 hover:border-purple-500/40 text-slate-300 px-3 py-1 rounded-full transition-all text-left"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* AI Answer & Source Citations Result Box */}
        {aiResult && (
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-purple-500/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Gemini Synthesized Answer</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Confidence: {aiResult.confidenceScore}%</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              {aiResult.answer}
            </p>

            {/* Key Takeaways */}
            {aiResult.keyTakeaways && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Protocol Steps:</span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {aiResult.keyTakeaways.map((k, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citations */}
            {aiResult.citations && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-xs text-slate-500 font-mono">Source Citations:</span>
                {aiResult.citations.map((c, idx) => (
                  <span key={idx} className="text-[11px] font-mono font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-purple-400" />
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Library Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Corporate Policies & Standard Operating Procedures</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            {['All', 'Engineering', 'Human Resources', 'Legal & Compliance', 'Operations'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedDept === dept
                    ? 'bg-purple-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-mono text-sm">
            Indexing repository documents...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-nexus-surface/60 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded-md">
                      {doc.category.toUpperCase()} • v{doc.version || '1.0'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{doc.department}</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{doc.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {doc.content}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span>{doc.tags || 'enterprise, policy'}</span>
                  </span>
                  <span>Author: {doc.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating New Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-nexus-surface border border-white/20 rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Publish New SOP / Policy</span>
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document Title</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g. Data Retention & GDPR Compliance SOP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
                  <select
                    value={newDoc.department}
                    onChange={(e) => setNewDoc({ ...newDoc, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="policy">Policy</option>
                    <option value="sop">SOP</option>
                    <option value="legal">Legal & Compliance</option>
                    <option value="technical">Technical Architecture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Document Text</label>
                <textarea
                  rows="5"
                  required
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  placeholder="Enter the official protocol or legal clauses. NexusAI RAG engine will immediately index this document for cross-department Q&A."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                ></textarea>
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
                  disabled={docSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/20 transition-all"
                >
                  {docSubmitting ? 'Publishing...' : 'Publish & Index in RAG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
