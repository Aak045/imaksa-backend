// routes/subscribers.js
const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { protect } = require('../middleware/auth');

// ── POST /api/subscribers ──
// Public — website subscribe popup submits here
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    await Subscriber.create({
      name, email,
      source: req.body.source || 'popup',
      ip: req.ip,
    });

    res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/subscribers ──
// Protected — admin only
router.get('/', protect, async (req, res) => {
  try {
    const { limit } = req.query;

    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── DELETE /api/subscribers/:id ──
// Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Subscriber deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
