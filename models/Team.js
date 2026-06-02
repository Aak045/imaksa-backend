// models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:   { type: String, required: [true, 'Name is required'], trim: true },
  role:   { type: String, required: [true, 'Role is required'] },
  email:  { type: String, default: '' },
  phone:  { type: String, default: '' },
  bio:    { type: String, default: '' },
  photo:  { type: String, default: '' },
  order:  { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
