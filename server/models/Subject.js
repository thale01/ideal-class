const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseId: { type: String, required: false }, // Using String for flexibility with mock and real IDs
  description: { type: String },
  category: { type: String, required: true }, // e.g. "SSC", "HSC"
  color: { type: String, default: '#4CAF50' }, // For colored cards
  icon: { type: String, default: '📘' },
  resources: {
    notes: [{
      title: { type: String, required: true },
      chapter: { type: String }, // Optional chapter categorization
      fileUrl: { type: String, required: true },
      uploadDate: { type: Date, default: Date.now }
    }],
    videos: [{
      title: { type: String, required: true },
      chapter: { type: String }, // Optional chapter categorization
      url: { type: String, required: true },
      type: { type: String, enum: ['URL', 'FILE'], default: 'URL' },
      uploadDate: { type: Date, default: Date.now }
    }]
  }
});

module.exports = mongoose.model('Subject', subjectSchema);
