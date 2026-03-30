const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

const mockDb = require('../mock-db');
const mongoose = require('mongoose');

// Create Quiz (Admin)
router.post('/', async (req, res) => {
  const { title, subject, studentClass, questions } = req.body;
  if (mongoose.connection.readyState !== 1) {
    const list = mockDb.save('quizzes', { title, subject, studentClass, questions });
    return res.status(201).json(list);
  }
  try {
    const list = new Quiz({ title, subject, studentClass, questions });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ message: 'Error adding quiz.' });
  }
});

// GET all quizzes (Student)
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('quizzes') || []);
  }
  try {
    const list = await Quiz.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quizzes list.' });
  }
});

// DELETE quiz (Admin)
router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('quizzes', req.params.id);
    return res.json({ message: 'Quiz removed successfully.' });
  }
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz removed successfully.' });
  } catch (err) {
    res.status(404).json({ message: 'Quiz record not found or error deleting.' });
  }
});

module.exports = router;
