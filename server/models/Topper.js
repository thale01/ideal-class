const mongoose = require('mongoose');

const topperSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marks: { type: Number, required: true }, // %
  exam: { type: String, required: true }, // e.g. "SSC 2025"
  photoUrl: { type: String }, // For photo upload
  achievement: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topper', topperSchema);
