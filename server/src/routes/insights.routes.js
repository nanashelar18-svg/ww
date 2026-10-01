const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateToken } = require('../middleware/auth.middleware');
const aiService = require('../services/ai.service');

// GET /api/insights/executive-summary
router.get('/executive-summary', authenticateToken, async (req, res) => {
  const tickets = db.tickets.find();
  const workflows = db.workflows.find();
  const docs = db.documents.find();

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const totalWorkflowRuns = workflows.reduce((acc, w) => acc + (w.execution_count || 0), 0);

  const stats = {
    totalTickets,
    openTickets,
    urgentTickets,
    resolvedTickets,
    totalDocuments: docs.length,
    activeWorkflows: workflows.length,
    totalWorkflowRuns,
    aiDeflectionRate: '68%',
    slaComplianceRate: '97.4%'
  };

  try {
    const aiBriefing = await aiService.generateExecutiveBriefing(stats, tickets.slice(0, 5), workflows);

    res.json({
      success: true,
      stats,
      briefing: aiBriefing
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/insights/audit-trail
router.get('/audit-trail', authenticateToken, (req, res) => {
  const logs = db.audit_logs.find().slice(0, 20);
  res.json({ success: true, logs });
});

module.exports = router;
