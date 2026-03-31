require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Global Mongoose Configuration
mongoose.set('bufferCommands', false);

// Main App Route (for Health Check)
app.get('/', (req, res) => res.json({ message: 'Ideal Classes API - Server Running' }));

// Main Routes
const { router: authRoutes, seedAdmin } = require('./routes/auth');
const studentRoutes = require('./routes/students');
const contentRoutes = require('./routes/content');
const admissionRoutes = require('./routes/admissions');
const announcementRoutes = require('./routes/announcements');
const quizRoutes = require('./routes/quizzes');
const subjectRoutes = require('./routes/subjects');
const feeRoutes = require('./routes/fees');
const topperRoutes = require('./routes/toppers');
const updateRoutes = require('./routes/updates');
const doubtRoutes = require('./routes/doubts');
const courseRoutes = require('./routes/courses');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/toppers', topperRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/courses', courseRoutes);

const startServer = (mode) => {
  const server = app.listen(PORT, () => console.log(`🚀 Server ${mode} on http://localhost:${PORT}`))
    .on('error', (e) => {
      console.error('❌ Server startup error:', e.message);
      if (e.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is busy.`);
      }
    });
};

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log('✅ Connected to MongoDB: Ideal Classes Cluster');
    await seedAdmin();
    startServer('ready');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    startServer('running in failover/mock mode');
  });

// Simple Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
