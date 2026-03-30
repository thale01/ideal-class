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

// Approve application
router.patch('/:id/approve', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const app = mockDb.update('admissions', req.params.id, item => {
       item.status = 'approved';
       return item;
    });
    return res.json(app);
  }
  try {
    const app = await Admission.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(app);
  } catch (err) {
    res.status(404).json({ message: 'Application not found or error approving.' });
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
