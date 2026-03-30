const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // For holidays, exam dates, batch changes
  type: { type: String, enum: ['Holiday', 'Exam Date', 'Batch Change', 'General'], default: 'General' },
  date: { type: Date, default: Date.now },
  expiryDate: { type: Date } // Optional for temporary updates
});

module.exports = mongoose.model('Update', updateSchema);
