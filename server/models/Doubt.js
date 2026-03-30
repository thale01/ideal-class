const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: { type: String, required: true },
  subject: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  repliedAt: { type: Date }
});

module.exports = mongoose.model('Doubt', doubtSchema);
