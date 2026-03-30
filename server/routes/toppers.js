const express = require('express');
const router = express.Router();
const Topper = require('../models/Topper');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = 'uploads/toppers/';
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const mockDb = require('../mock-db');
const mongoose = require('mongoose');

router.post('/', upload.single('photo'), async (req, res) => {
  const { name, marks, exam, achievement } = req.body;
  const photoUrl = req.file ? `/uploads/toppers/${req.file.filename}` : '';
  if (mongoose.connection.readyState !== 1) {
    const mockRes = mockDb.save('toppers', { name, marks, exam, achievement, photoUrl });
    return res.json(mockRes);
  }
  try {
    const topper = new Topper({ name, marks, exam, achievement, photoUrl });
    await topper.save();
    res.json(topper);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('toppers') || []);
  }
  try {
    const toppers = await Topper.find().sort({ marks: -1 });
    res.json(toppers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('toppers', req.params.id);
    return res.json({ message: 'Deleted from local mock storage' });
  }
  try {
    const topper = await Topper.findByIdAndDelete(req.params.id);
    if (!topper) return res.status(404).json({ message: 'Topper not found' });
    res.json({ message: 'Topper deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
