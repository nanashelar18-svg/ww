const express = require('express');
const router = express.Router();
const { z } = require('zod');
const db = require('../db/database');
const { authenticateToken } = require('../middleware/auth.middleware');
const aiService = require('../services/ai.service');

const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  target_department: z.string().min(2, 'Target department is required'),
  category: z.string().optional()
});

// GET /api/tickets
router.get('/', authenticateToken, (req, res) => {
  const { department, status, priority, search } = req.query;

  let tickets = db.tickets.find();

  if (department && department !== 'All') {
    tickets = tickets.filter(t => t.target_department === department);
  }
  if (status && status !== 'All') {
    tickets = tickets.filter(t => t.status === status);
  }
  if (priority && priority !== 'All') {
    tickets = tickets.filter(t => t.priority === priority);
  }
  if (search) {
    const q = search.toLowerCase();
    tickets = tickets.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: tickets.length, tickets });
});

// GET /api/tickets/:id
router.get('/:id', authenticateToken, (req, res) => {
  const ticket = db.tickets.findOne(t => t.id === Number(req.params.id));
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }
  res.json({ success: true, ticket });
});

// POST /api/tickets (Create with AI Auto-Triage)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const validatedData = createTicketSchema.parse(req.body);

    // Call AI Triage Engine
    const aiTriage = await aiService.triageTicket(
      validatedData.title,
      validatedData.description,
      validatedData.target_department
    );

    const newTicket = db.tickets.insert({
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category || 'General Operations',
      priority: aiTriage.priority || 'medium',
      target_department: validatedData.target_department,
      requester_id: req.user.id,
      requester_name: req.user.name,
      requester_email: req.user.email,
      assigned_to_email: null,
      ai_sentiment: aiTriage.sentiment || 'neutral',
      ai_suggested_priority: aiTriage.priority || 'medium',
      ai_suggested_response: aiTriage.suggestedResponse || '',
      ai_cross_dept_action: aiTriage.crossDeptAction || '',
      sla_hours: aiTriage.slaHours || 24
    });

    // Audit log
    db.audit_logs.insert({
      user_email: req.user.email,
      action: 'TICKET_CREATED_AI_TRIAGED',
      details: `Ticket #${newTicket.id} "${newTicket.title}" created & classified as ${newTicket.priority.toUpperCase()} priority`,
      department: validatedData.target_department
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created and AI auto-triaged successfully',
      ticket: newTicket,
      aiMetadata: aiTriage
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/tickets/:id (Update Status or Assignee)
router.patch('/:id', authenticateToken, (req, res) => {
  const { status, priority, assigned_to_email } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (priority) updates.priority = priority;
  if (assigned_to_email !== undefined) updates.assigned_to_email = assigned_to_email;

  const updatedTicket = db.tickets.update(req.params.id, updates);
  if (!updatedTicket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  db.audit_logs.insert({
    user_email: req.user.email,
    action: 'TICKET_UPDATED',
    details: `Ticket #${req.params.id} updated: ${JSON.stringify(updates)}`,
    department: updatedTicket.target_department
  });

  res.json({ success: true, ticket: updatedTicket });
});

// POST /api/tickets/:id/generate-ai-reply
router.post('/:id/generate-ai-reply', authenticateToken, async (req, res) => {
  const ticket = db.tickets.findOne(t => t.id === Number(req.params.id));
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  try {
    const aiTriage = await aiService.triageTicket(ticket.title, ticket.description, ticket.target_department);
    const updated = db.tickets.update(ticket.id, {
      ai_suggested_response: aiTriage.suggestedResponse,
      ai_cross_dept_action: aiTriage.crossDeptAction
    });

    res.json({
      success: true,
      suggestedResponse: aiTriage.suggestedResponse,
      crossDeptAction: aiTriage.crossDeptAction
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
