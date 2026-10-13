import { Router } from 'express';

const router = Router();

// GET /api/places — List all places with optional filters
router.get('/', (req, res) => {
  const { search, category, crowd, sort, limit = '50' } = req.query;

  // In a real app, this would query a database
  // For the MVP, the frontend uses its own mock data
  res.json({
    success: true,
    message: 'Places endpoint active. Frontend uses local mock data for the MVP.',
    query: { search, category, crowd, sort, limit },
    total: 45,
  });
});

// GET /api/places/:slug — Get single place details
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  res.json({
    success: true,
    message: `Place detail for "${slug}". Frontend uses local mock data.`,
    slug,
  });
});

// GET /api/places/:slug/crowd — Get live crowd data
router.get('/:slug/crowd', (req, res) => {
  const { slug } = req.params;

  // Simulate real-time crowd data
  const crowdPct = Math.floor(Math.random() * 80) + 10;
  const levels = ['low', 'moderate', 'high', 'critical'] as const;
  const level = crowdPct < 30 ? levels[0] : crowdPct < 55 ? levels[1] : crowdPct < 80 ? levels[2] : levels[3];

  res.json({
    success: true,
    slug,
    crowd: {
      percentage: crowdPct,
      level,
      visitors: Math.floor(crowdPct * 50 + Math.random() * 500),
      waitTimeMins: Math.floor(crowdPct * 0.8),
      parkingFreeSpaces: Math.max(0, 150 - Math.floor(crowdPct * 1.5)),
      updatedAt: new Date().toISOString(),
      confidence: 94 + Math.random() * 4,
    },
    forecast: {
      nextHour: Math.min(100, crowdPct + Math.floor(Math.random() * 20 - 10)),
      bestWindow: '6:00 AM - 8:30 AM',
      bestWindowConfidence: 96,
    },
  });
});

// GET /api/places/:slug/hourly — Get 24-hour forecast
router.get('/:slug/hourly', (req, res) => {
  const { slug } = req.params;
  const hours = Array.from({ length: 24 }, (_, i) => {
    const base = i < 6 ? 10 : i < 9 ? 25 : i < 12 ? 60 : i < 15 ? 75 : i < 18 ? 55 : i < 21 ? 35 : 15;
    return {
      hour: i,
      label: `${i.toString().padStart(2, '0')}:00`,
      crowdPct: Math.max(5, Math.min(98, base + Math.floor(Math.random() * 20 - 10))),
    };
  });

  res.json({ success: true, slug, hours });
});

export { router as placesRouter };
