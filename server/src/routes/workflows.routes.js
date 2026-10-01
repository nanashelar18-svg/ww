const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateToken } = require('../middleware/auth.middleware');

// GET /api/workflows
router.get('/', authenticateToken, (req, res) => {
  const workflows = db.workflows.find();
  res.json({ success: true, count: workflows.length, workflows });
});

// GET /api/workflows/runs
router.get('/runs', authenticateToken, (req, res) => {
  const runs = db.workflow_runs.find();
  res.json({ success: true, count: runs.length, runs });
});

// POST /api/workflows/:id/trigger
router.post('/:id/trigger', authenticateToken, async (req, res) => {
  const workflow = db.workflows.findOne(w => w.id === Number(req.params.id));
  if (!workflow) {
    return res.status(404).json({ success: false, message: 'Workflow not found' });
  }

  const inputPayload = req.body || {};

  // Simulate cross-department agent step execution
  const executedSteps = workflow.steps.map(step => {
    return {
      order: step.order,
      department: step.department,
      action: step.action,
      status: 'completed',
      timestamp: new Date().toISOString(),
      agentLog: `AI Agent executed [${step.department}] action successfully. Signed and recorded in enterprise ledger.`
    };
  });

  const runRecord = db.workflow_runs.insert({
    workflow_id: workflow.id,
    workflow_name: workflow.name,
    initiated_by: req.user.email,
    status: 'completed',
    input_data: JSON.stringify(inputPayload),
    step_results: executedSteps
  });

  db.workflows.incrementRun(workflow.id);

  db.audit_logs.insert({
    user_email: req.user.email,
    action: 'WORKFLOW_COMPLETED',
    details: `Successfully orchestrated "${workflow.name}" across ${workflow.involved_departments.join(', ')}`,
    department: req.user.department
  });

  res.json({
    success: true,
    message: `Workflow "${workflow.name}" executed successfully across all departments.`,
    run: runRecord
  });
});

module.exports = router;
