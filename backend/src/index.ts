import express from 'express';
import cors from 'cors';
import { placesRouter } from './routes/places.js';
import { chatRouter } from './routes/chat.js';
import { alertsRouter } from './routes/alerts.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/places', placesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/alerts', alertsRouter);

app.listen(PORT, () => {
  console.log(`
  🌿 VISIT FLOW Backend
  ========================
  Server running on http://localhost:${PORT}
  Health check: http://localhost:${PORT}/api/health
  `);
});

export default app;
