const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

const mockDb = require('../mock-db');
const mongoose = require('mongoose');

// Add Announcement (Admin)
router.post('/', async (req, res) => {
  const { title, content, type } = req.body;
  if (mongoose.connection.readyState !== 1) {
    const list = mockDb.save('announcements', { title, content, type, createdAt: new Date().toISOString() });
    return res.status(201).json(list);
  }
  try {
    const list = new Announcement({ title, content, type });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ message: 'Error adding announcement.' });
  }
});

// GET all announcements (Student/Public)
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('announcements') || []);
  }
  try {
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching announcements list.' });
  }
});

// REMOVE announcement (Admin)
router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('announcements', req.params.id);
    return res.json({ message: 'Announcement removed successfully.' });
  }
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement removed successfully.' });
  } catch (err) {
    res.status(404).json({ message: 'Announcement record not found or error deleting.' });
  }
});

module.exports = router;
