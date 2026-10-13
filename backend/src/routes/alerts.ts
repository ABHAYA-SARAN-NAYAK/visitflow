import { Router } from 'express';

const router = Router();

// Store alerts in-memory for MVP
const alerts: any[] = [];

// POST /api/alerts — Create a new crowd alert
router.post('/', (req, res) => {
  const { placeSlug, threshold, channels, visitDate, timeWindow, userId } = req.body;

  if (!placeSlug || !threshold) {
    return res.status(400).json({ error: 'placeSlug and threshold are required' });
  }

  const alert = {
    id: `alert_${Date.now()}`,
    placeSlug,
    threshold,
    channels: channels || ['push'],
    visitDate: visitDate || null,
    timeWindow: timeWindow || 'any',
    userId: userId || 'anonymous',
    active: true,
    createdAt: new Date().toISOString(),
  };

  alerts.push(alert);

  res.json({
    success: true,
    alert,
    message: `Alert set! You'll be notified when crowd drops below ${threshold}%.`,
  });
});

// GET /api/alerts — List user alerts
router.get('/', (req, res) => {
  const { userId = 'anonymous' } = req.query;
  const userAlerts = alerts.filter(a => a.userId === userId);
  res.json({ success: true, alerts: userAlerts, total: userAlerts.length });
});

// DELETE /api/alerts/:id — Remove an alert
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = alerts.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  alerts.splice(index, 1);
  res.json({ success: true, message: 'Alert removed' });
});

export { router as alertsRouter };
