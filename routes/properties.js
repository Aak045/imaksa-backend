// routes/properties.js — Properties CRUD API
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

// ── GET /api/properties ──
// Public — website fetches this to show properties
router.get('/', async (req, res) => {
  try {
    const { type, listingType, status, featured, limit } = req.query;
    
    let query = {};
    if (type)        query.type        = type;
    if (listingType) query.listingType = listingType;
    if (status)   query.status = status;
    if (featured) query.featured = true;
    
    // Default: only show active on public website
    if (!req.headers.authorization) {
      query.status = 'active';
    }

    let properties = await Property.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/properties/:id ──
// Public — single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/properties ──
// Protected (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Property added successfully',
      data: property 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── PUT /api/properties/:id ──
// Protected (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Property updated successfully',
      data: property 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── DELETE /api/properties/:id ──
// Protected (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Property deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
