// routes/sellrequests.js
const express = require('express');
const router = express.Router();
const SellRequest = require('../models/SellRequest');
const { protect } = require('../middleware/auth');
const { sendSellRequestEmail } = require('../config/email');

// ── POST /api/sellrequests ──
// Public — "Sell With Us" form on the website submits here
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, propertyType, location, size, askingPrice, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Save to MongoDB
    const sellRequest = await SellRequest.create({
      name, email, phone, propertyType, location, size, askingPrice, notes,
      ip: req.ip,
    });

    // ── RESPOND IMMEDIATELY ──
    res.set('Connection', 'keep-alive');
    res.status(201).json({
      success: true,
      message: 'Thank you! Our team will review your property details and reach out within 24 hours.',
    });

    // ── Send email in BACKGROUND (after response sent) ──
    setImmediate(async () => {
      try {
        await sendSellRequestEmail(sellRequest);
        console.log('✅ Sell request notification sent for:', sellRequest.name, '→', process.env.CLIENT_EMAIL);
      } catch (emailErr) {
        console.log('⚠️ Sell request notification FAILED for:', sellRequest.name, '→', process.env.CLIENT_EMAIL, '| Error:', emailErr.message);
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/sellrequests ──
// Protected — admin only
router.get('/', protect, async (req, res) => {
  try {
    const { read, limit } = req.query;
    let query = {};
    if (read === 'false') query.read = false;
    if (read === 'true')  query.read = true;

    const sellRequests = await SellRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

    const unreadCount = await SellRequest.countDocuments({ read: false });

    res.json({
      success: true,
      count: sellRequests.length,
      unreadCount,
      data: sellRequests,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── PUT /api/sellrequests/:id/read ──
// Protected — mark as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const sellRequest = await SellRequest.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!sellRequest) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: sellRequest });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── PUT /api/sellrequests/:id/notes ──
// Protected — add internal notes / mark contacted
router.put('/:id/notes', protect, async (req, res) => {
  try {
    const sellRequest = await SellRequest.findByIdAndUpdate(
      req.params.id,
      { adminNotes: req.body.adminNotes, contacted: req.body.contacted },
      { new: true }
    );
    res.json({ success: true, data: sellRequest });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── PUT /api/sellrequests/read-all ──
// Protected — mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await SellRequest.updateMany({ read: false }, { read: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── DELETE /api/sellrequests/:id ──
// Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    await SellRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Sell request deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
