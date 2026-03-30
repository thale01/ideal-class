const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  classCategory: { type: String, required: true }, // e.g. "SSC"
  subject: { type: String, required: true }, // e.g. "Mathematics"
  chapter: { type: String },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
