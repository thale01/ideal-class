const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  classApplied: { type: String, required: true },
  batch: { type: String },
  previousScore: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', admissionSchema);
