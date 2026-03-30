const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Subject = require('../models/Subject');
const mockDb = require('../mock-db');
const mongoose = require('mongoose');

// Storage for PDFs and occasional Videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/notes/';
    if (file.mimetype.includes('video')) dest = 'uploads/videos/';
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create Subject
router.post('/', async (req, res) => {
  const { name, category, color, icon, description } = req.body;
  
  if (mongoose.connection.readyState !== 1) {
    const mockRes = mockDb.save('subjects', { name, category, color, icon, description, resources: { notes: [], videos: [] } });
    return res.json(mockRes);
  }

  try {
    const subject = new Subject({ name, category, color, icon, description });
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Subject Metadata
router.put('/:id', async (req, res) => {
  const { name, category, color, icon, description, resources } = req.body;
  if (mongoose.connection.readyState !== 1) {
    const updated = mockDb.update('subjects', req.params.id, sub => ({ ...sub, name, category, color, icon, description, resources: resources || sub.resources }));
    return res.json(updated);
  }
  try {
    const updateData = { name, category, color, icon, description };
    if (resources) updateData.resources = resources;
    const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Subjects
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('subjects'));
  }

  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Subject (Add Note/Video) - Supports Bulk
router.post('/:id/resource', upload.array('files', 15), async (req, res) => {
  const { type, title, url, chapter } = req.body; // type: 'note' or 'video'
  
  if (mongoose.connection.readyState !== 1) {
    const updated = mockDb.update('subjects', req.params.id, sub => {
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const fileUrl = `/uploads/${type === 'note' ? 'notes' : 'videos'}/${file.filename}`;
          const noteTitle = req.files.length === 1 && title ? title : file.originalname.split('.')[0];
          if (type === 'note') sub.resources.notes.push({ title: noteTitle, chapter, fileUrl, uploadDate: new Date(), _id: new mongoose.Types.ObjectId().toString() });
          else sub.resources.videos.push({ title: noteTitle, chapter, url: fileUrl, type: 'FILE', uploadDate: new Date(), _id: new mongoose.Types.ObjectId().toString() });
        });
      } else {
        const fileUrl = url;
        if (type === 'note') sub.resources.notes.push({ title, chapter, fileUrl, uploadDate: new Date(), _id: new mongoose.Types.ObjectId().toString() });
        else sub.resources.videos.push({ title, chapter, url: fileUrl, type: 'URL', uploadDate: new Date(), _id: new mongoose.Types.ObjectId().toString() });
      }
      return sub;
    });
    return res.json(updated);
  }

  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fileUrl = `/uploads/${type === 'note' ? 'notes' : 'videos'}/${file.filename}`;
        const noteTitle = req.files.length === 1 && title ? title : file.originalname.split('.')[0];
        if (type === 'note') {
          subject.resources.notes.push({ title: noteTitle, chapter, fileUrl });
        } else {
          subject.resources.videos.push({ title: noteTitle, chapter, url: fileUrl, type: 'FILE' });
        }
      });
    } else {
      if (type === 'note') {
        subject.resources.notes.push({ title, chapter, fileUrl: url });
      } else {
        subject.resources.videos.push({ title, chapter, url, type: 'URL' });
      }
    }

    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Subject
router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('subjects', req.params.id);
    return res.json({ message: 'Subject deleted (mock)' });
  }

  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Resource
router.delete('/:id/resource', async (req, res) => {
  const { resourceId, type } = req.query; // type: 'note' or 'video'

  if (mongoose.connection.readyState !== 1) {
    mockDb.update('subjects', req.params.id, sub => {
      if (type === 'note') sub.resources.notes = sub.resources.notes.filter(n => n._id !== resourceId);
      else sub.resources.videos = sub.resources.videos.filter(v => v._id !== resourceId);
      return sub;
    });
    return res.json({ message: 'Resource deleted (mock)' });
  }

  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (type === 'note') {
      subject.resources.notes = subject.resources.notes.filter(n => n._id.toString() !== resourceId);
    } else {
      subject.resources.videos = subject.resources.videos.filter(v => v._id.toString() !== resourceId);
    }

    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
