const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['exam', 'holiday', 'batch', 'general', 'urgent', 'event'], default: 'general' },
  targetClass: { type: String, default: 'All' },
  publishedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
