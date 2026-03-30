const express = require('express');
const router = express.Router();
const Update = require('../models/Update');
const mockDb = require('../mock-db');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  const { title, description, type, date, expiryDate } = req.body;
  
  if (mongoose.connection.readyState !== 1) {
    const mockRes = mockDb.save('updates', { title, description, type, date, expiryDate });
    return res.json(mockRes);
  }

  try {
    const update = new Update({ title, description, type, date, expiryDate });
    await update.save();
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('updates') || []);
  }

  try {
    const updates = await Update.find().sort({ date: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('updates', req.params.id);
    return res.json({ message: 'Update deleted (mock)' });
  }

  try {
    const update = await Update.findByIdAndDelete(req.params.id);
    if (!update) return res.status(404).json({ message: 'Update not found' });
    res.json({ message: 'Update deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

