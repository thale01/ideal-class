const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const User = require('../models/User');
const mongoose = require('mongoose');
const mockDb = require('../mock-db');

// Middleware to check Admin role
const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authorization required' });
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// GET all courses
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('courses') || []);
  }
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// GET specific course
router.get('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const all = mockDb.get('courses') || [];
    return res.json(all.find(c => c._id === req.params.id) || {});
  }
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(404).json({ message: 'Course not found' });
  }
});

// CREATE course (Admin only)
router.post('/', authAdmin, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const item = mockDb.save('courses', req.body);
    return res.status(201).json(item);
  }
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: 'Error creating course' });
  }
});

// UPDATE course (Admin only)
router.put('/:id', authAdmin, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const item = mockDb.update('courses', req.params.id, c => ({ ...c, ...req.body }));
    return res.json(item);
  }
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating course' });
  }
});

// DELETE course (Admin only)
router.delete('/:id', authAdmin, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('courses', req.params.id);
    return res.json({ message: 'Course deleted from mock DB' });
  }
  try {
    await Course.findByIdAndDelete(req.params.id);
    // Also clear courseId from associated subjects
    await Subject.updateMany({ courseId: req.params.id }, { $unset: { courseId: "" } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// ASSIGN courses to student (Admin only)
router.post('/assign/:studentId', authAdmin, async (req, res) => {
  const { courseIds } = req.body; // Array of course IDs
  if (mongoose.connection.readyState !== 1) {
    mockDb.update('students', req.params.studentId, (st) => {
      return { ...st, assignedCourses: courseIds };
    });
    return res.json({ message: 'Courses assigned in mock DB' });
  }
  try {
    await User.findByIdAndUpdate(req.params.studentId, { assignedCourses: courseIds });
    res.json({ message: 'Courses assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning courses' });
  }
});

module.exports = router;
