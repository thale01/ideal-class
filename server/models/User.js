const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  password: { type: String, required: true }, // Hashed password
  studentClass: { type: String }, // e.g. "SSC 2026"
  batch: { type: String },
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  attendance: [{ date: Date, status: { type: String, enum: ['present', 'absent'] } }],
  fees: {
    total: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    history: [{ date: Date, amount: Number, method: String, note: String }]
  },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
