const express = require('express');
const router = express.Router();
const User = require('../models/User');

const { authAdmin } = require('../middleware/auth');


const mockDb = require('../mock-db');
const mongoose = require('mongoose');

// GET all students (Admin only)
router.get('/', authAdmin, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('students') || []);
  }
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students. Running in failover/mock mode.' });
  }
});

// CREATE/ADD student manually (Admin only)
router.post('/', authAdmin, async (req, res) => {
  const { name, email, phone, studentClass, batch } = req.body;
  const password = process.env.STUDENT_PASSWORD || 'student123';

  if (mongoose.connection.readyState !== 1) {
    const mockRes = mockDb.save('students', { name, email, phone, role: 'student', password, studentClass, batch });
    return res.status(201).json(mockRes);
  }
  try {
    const newStudent = new User({
      name, email, phone, role: 'student', password, studentClass, batch
    });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: 'Error adding student. Please ensure unique email.' });
  }
});

// UPDATE student details
router.patch('/:id', authAdmin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(404).json({ message: 'Student record not found.' });
  }
});

// RESET student password (Admin only)
router.patch('/:id/reset-password', authAdmin, async (req, res) => {
  const { newPassword } = req.body;
  const bcrypt = require('bcryptjs');
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true });
    if (!user) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting student password' });
  }
});

// DELETE student
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully.' });
  } catch (err) {
    res.status(404).json({ message: 'Student record not found or error deleting.' });
  }
});

// Update Fees or Attendance (specific updates)
router.patch('/:id/fees', authAdmin, async (req, res) => {
  const { amount, method, note } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Student not found' });

    user.fees.paid += parseFloat(amount);
    user.fees.history.push({ date: new Date(), amount, method, note });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating payment status.' });
  }
});

// EXPORT all students to Excel (Admin only)
router.get('/export', authAdmin, async (req, res) => {
  const xlsx = require('xlsx');
  let studentsData = [];

  if (mongoose.connection.readyState !== 1) {
    studentsData = mockDb.get('students') || [];
  } else {
    try {
      studentsData = await User.find({ role: 'student' }).lean();
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching students for export' });
    }
  }

  try {
    const flattened = studentsData.map(s => ({
      ID: s._id ? s._id.toString() : 'N/A',
      Name: s.name,
      Email: s.email,
      Phone: s.phone,
      Class: s.studentClass || 'N/A',
      Batch: s.batch || 'N/A',
      TotalFees: s.fees?.total || 0,
      PaidFees: s.fees?.paid || 0,
      PendingFees: (s.fees?.total || 0) - (s.fees?.paid || 0),
      AdmissionDate: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(flattened);
    xlsx.utils.book_append_sheet(wb, ws, "Students");

    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Ideal_Classes_Students.xlsx');
    res.send(buffer);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ message: 'Excel generation failed' });
  }
});

module.exports = router;
