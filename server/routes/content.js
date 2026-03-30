const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Note = require('../models/Note');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/notes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create folders if they don't exist
const fs = require('fs');
if (!fs.existsSync('uploads/notes')) {
  fs.mkdirSync('uploads/notes', { recursive: true });
}

// UPLOAD note (Admin) - Supports Bulk Upload
router.post('/upload', upload.array('files', 15), async (req, res) => {
  const { title, subject, studentClass, chapter, description } = req.body;
  const notes = [];

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files provided for upload.' });
  }

  try {
    for (const file of req.files) {
      const fileUrl = `/uploads/notes/${file.filename}`;
      // Use the provided title if it's a single upload, otherwise use the filename
      const noteTitle = req.files.length === 1 && title ? title : file.originalname.split('.')[0];
      
      const note = new Note({
        title: noteTitle,
        subject: subject || 'General',
        studentClass,
        chapter,
        description,
        fileUrl
      });
      await note.save();
      notes.push(note);
    }
    
    res.json({ message: `Successfully uploaded ${notes.length} notes.`, data: notes });
  } catch (err) {
    console.error('Bulk upload error:', err);
    res.status(400).json({ message: 'Error adding note records.' });
  }
});

// GET notes list (Student/Admin)
router.get('/', async (req, res) => {
  const { studentClass, subject } = req.query;
  const query = {};
  if (studentClass) query.studentClass = studentClass;
  if (subject) query.subject = subject;

  try {
    const notes = await Note.find(query);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes index.' });
  }
});

module.exports = router;
