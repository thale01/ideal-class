const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');
const mongoose = require('mongoose');

// Ask a Doubt (Student)
router.post('/ask', async (req, res) => {
  const { studentName, subject, question, studentId } = req.body;
  try {
    const doubt = new Doubt({ studentName, subject, question, studentId });
    await doubt.save();
    res.status(201).json(doubt);
  } catch (err) {
    res.status(400).json({ message: 'Error submitting doubt.' });
  }
});

// Get all Doubts (Admin) or filtered by Student
router.get('/', async (req, res) => {
  const { studentId, subject } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (subject) filter.subject = subject;

  if (mongoose.connection.readyState !== 1) {
    return res.json([]);
  }
  try {
    const doubts = await Doubt.find(filter).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doubts.' });
  }
});

// Reply to Doubt (Admin)
router.patch('/:id/reply', async (req, res) => {
  const { answer } = req.body;
  try {
    const doubt = await Doubt.findByIdAndUpdate(req.params.id, {
      answer,
      isResolved: true,
      repliedAt: new Date()
    }, { new: true });
    res.json(doubt);
  } catch (err) {
    res.status(404).json({ message: 'Doubt not found.' });
  }
});

module.exports = router;
