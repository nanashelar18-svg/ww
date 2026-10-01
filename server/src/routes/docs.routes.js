const express = require('express');
const router = express.Router();
const { z } = require('zod');
const db = require('../db/database');
const { authenticateToken } = require('../middleware/auth.middleware');
const aiService = require('../services/ai.service');

const createDocSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(2, 'Category is required'),
  department: z.string().min(2, 'Department is required'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  summary: z.string().optional(),
  tags: z.string().optional()
});

const querySchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters')
});

// GET /api/docs
router.get('/', authenticateToken, (req, res) => {
  const { department, category, search } = req.query;

  let docs = db.documents.find();

  if (department && department !== 'All') {
    docs = docs.filter(d => d.department === department);
  }
  if (category && category !== 'All') {
    docs = docs.filter(d => d.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    docs = docs.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.content.toLowerCase().includes(q) ||
      (d.tags && d.tags.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: docs.length, documents: docs });
});

// GET /api/docs/:id
router.get('/:id', authenticateToken, (req, res) => {
  const doc = db.documents.findOne(d => d.id === Number(req.params.id));
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }
  res.json({ success: true, document: doc });
});

// POST /api/docs
router.post('/', authenticateToken, (req, res) => {
  try {
    const data = createDocSchema.parse(req.body);

    const newDoc = db.documents.insert({
      title: data.title,
      category: data.category,
      department: data.department,
      content: data.content,
      summary: data.summary || data.content.substring(0, 150) + '...',
      tags: data.tags || '',
      author: req.user.name,
      version: '1.0'
    });

    db.audit_logs.insert({
      user_email: req.user.email,
      action: 'DOCUMENT_PUBLISHED',
      details: `Published document "${newDoc.title}" in ${newDoc.department}`,
      department: newDoc.department
    });

    res.status(201).json({ success: true, document: newDoc });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/docs/query-ai (Enterprise RAG Q&A with Gemini)
router.post('/query-ai', authenticateToken, async (req, res) => {
  try {
    const { query } = querySchema.parse(req.body);
    const allDocs = db.documents.find();

    const aiResult = await aiService.queryKnowledgeBase(query, allDocs);

    db.audit_logs.insert({
      user_email: req.user.email,
      action: 'KNOWLEDGE_AI_QUERY',
      details: `Queried: "${query.substring(0, 60)}..."`,
      department: req.user.department
    });

    res.json({
      success: true,
      query,
      answer: aiResult.answer,
      citations: aiResult.citations,
      confidenceScore: aiResult.confidenceScore,
      keyTakeaways: aiResult.keyTakeaways,
      aiModel: aiResult.aiModel
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
