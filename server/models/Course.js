const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: '📂' },
  color: { type: String, default: '#6366f1' },
  category: { type: String }, // e.g. "Primary", "High School", "Competitive"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
