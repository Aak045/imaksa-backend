// models/Property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name:        { type: String, required: [true, 'Property name is required'], trim: true },
  price:       { type: String, required: [true, 'Price is required'] },
  type:        { type: String, enum: ['villa', 'penthouse', 'apartment', 'offplan', 'commercial', 'townhouse', 'Villa', 'Penthouse', 'Apartment', 'Offplan', 'Commercial', 'Townhouse'], required: true },
  listingType: { type: String, enum: ['buy', 'rent', 'offplan'], default: 'buy' },
  status:      { type: String, enum: ['active', 'sold', 'rented', 'draft'], default: 'active' },
  location:    { type: String, required: [true, 'Location is required'] },
  beds:        { type: String, default: '' },
  baths:       { type: String, default: '' },
  area:        { type: String, default: '' },
  badge:       { type: String, default: '' },
  desc:        { type: String, default: '' },
  img:         { type: String, default: '' },
  handover:    { type: String, default: '' },
  payplan:     { type: String, default: '' },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
