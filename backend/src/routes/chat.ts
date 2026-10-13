import { Router } from 'express';

const router = Router();

// POST /api/chat — Send a message to Seena AI
router.post('/', (req, res) => {
  const { message, conversationId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set up SSE for streaming response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const msgLower = message.toLowerCase();

  let response = '';

  if (msgLower.includes('crowd') || msgLower.includes('busy')) {
    response = "Based on our real-time sensors, here's the current crowd status. The destination is currently at moderate levels. I recommend visiting during the early morning window (6-8 AM) for the best experience. Want me to set an alert for when it drops below 30%?";
  } else if (msgLower.includes('best time') || msgLower.includes('when')) {
    response = "I've analyzed the crowd patterns for the past 90 days. The best time to visit is Tuesday or Wednesday between 7-9 AM. Crowd drops to just 15-20% during these windows. Confidence level: 96%. Shall I add this to your itinerary?";
  } else if (msgLower.includes('plan') || msgLower.includes('trip')) {
    response = "I'd love to help plan your trip! I'll optimize the schedule around low-crowd windows. Tell me: 1) Which cities? 2) How many days? 3) Any must-see places? I'll create a crowd-optimized itinerary in seconds.";
  } else {
    response = "Hey! I'm Seena, your VISIT FLOW assistant. I can help with real-time crowd levels, best visit times, trip planning, hidden gems, parking info, and more. What would you like to know?";
  }

  // Simulate word-by-word streaming
  const words = response.split(' ');
  let wordIndex = 0;

  const interval = setInterval(() => {
    if (wordIndex < words.length) {
      res.write(`data: ${JSON.stringify({ type: 'token', content: words[wordIndex] + ' ' })}\n\n`);
      wordIndex++;
    } else {
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 50);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// GET /api/chat/suggestions — Get contextual prompt suggestions
router.get('/suggestions', (req, res) => {
  const { placeSlug } = req.query;

  const suggestions = placeSlug
    ? [
        `Is ${placeSlug} crowded right now?`,
        `Best time to visit ${placeSlug} today`,
        `Parking at ${placeSlug}`,
        `Quieter alternatives to ${placeSlug}`,
      ]
    : [
        'Find me a quiet place to visit this weekend',
        'Is Taj Mahal crowded right now?',
        'Plan a 2-day trip to Jaipur',
        'Hidden gems near Mumbai',
        'Best time to visit Hampi',
      ];

  res.json({ success: true, suggestions });
});

export { router as chatRouter };
