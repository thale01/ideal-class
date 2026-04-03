const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

const mockDb = require('../mock-db');
const mongoose = require('mongoose');

// Apply for admission (Student Portal)
router.post('/apply', async (req, res) => {
  const { name, email, phone, classApplied, previousScore, message, batch } = req.body;
  if (mongoose.connection.readyState !== 1) {
    const mockRes = mockDb.save('admissions', { name, email, phone, classApplied, previousScore, message, batch, status: 'pending' });
    return res.status(201).json(mockRes);
  }
  try {
    const application = new Admission({
      name, email, phone, classApplied, previousScore, message, batch
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: 'Error submitting application.' });
  }
});

// GET all applications (Admin)
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('admissions') || []);
  }
  try {
    const list = await Admission.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications list.' });
  }
});

// Approve application - Creates student account automatically
const User = require('../models/User');
router.patch('/:id/approve', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const app = mockDb.update('admissions', req.params.id, item => {
       item.status = 'approved';
       return item;
    });
    // For mock mode, we'll try to find or create a mock student too
    mockDb.save('students', { 
       name: app.name, 
       email: app.email, 
       phone: app.phone, 
       studentClass: app.classApplied,
       role: 'student',
       active: true 
    });
    return res.json(app);
  }
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission record not found' });

    // 1. Update Admission Status
    admission.status = 'approved';
    await admission.save();

    // 2. Create Student Account if it doesn't already exist
    let student = await User.findOne({ email: admission.email, role: 'student' });
    if (!student) {
      student = new User({
        name: admission.name,
        email: admission.email,
        phone: admission.phone,
        studentClass: admission.classApplied,
        batch: admission.batch || 'NEW BATCH',
        role: 'student',
        password: 'student123' // Default password for new admissions
      });
      await student.save();
    }
    
    res.json(admission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('admissions', req.params.id);
    return res.json({ message: 'Deleted from local mock storage' });
  }
  try {
    const app = await Admission.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting application' });
  }
});

module.exports = router;
