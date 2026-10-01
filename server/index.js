require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const ticketRoutes = require('./src/routes/tickets.routes');
const docRoutes = require('./src/routes/docs.routes');
const workflowRoutes = require('./src/routes/workflows.routes');
const insightRoutes = require('./src/routes/insights.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes - Support both /api/* and root paths for serverless function rewrites
const apiRoutes = [
  ['/auth', authRoutes],
  ['/tickets', ticketRoutes],
  ['/docs', docRoutes],
  ['/workflows', workflowRoutes],
  ['/insights', insightRoutes]
];

apiRoutes.forEach(([routePath, router]) => {
  app.use(`/api${routePath}`, router);
  app.use(routePath, router);
});

// Health check endpoint
const handleHealth = (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'NexusAI Enterprise Backend',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'Google Gemini 1.5 Flash (Active)' : 'NexusAI Contextual Heuristics (Ready)'
  });
};
app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 NexusAI Enterprise Server active on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔑 AI Key Configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
    console.log(`====================================================`);
  });
}

module.exports = app;

