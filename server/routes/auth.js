const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authAdmin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Ensure Admin User Exists in DB (Seed)
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'IdealPass123', 10);
      await User.create({
        name: 'System Admin',
        email: 'admin@idealclasses.com',
        phone: '0000000000',
        role: 'admin',
        password: hashedPassword
      });
      console.log('✅ Admin account seeded');
    }
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
  }
};

module.exports = { router, seedAdmin };

// Admin Login
router.post('/admin/login', async (req, res) => {
  const { password, email } = req.body;
  const mongoose = require('mongoose');

  try {
    // Failover/Mock Mode check
    if (mongoose.connection.readyState !== 1) {
      const fallbackPass = process.env.ADMIN_PASSWORD || 'IdealPass123';
      if (password === fallbackPass) {
        const token = jwt.sign({ role: 'admin', email: email || 'admin@idealclasses.com' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: 'Owner/Admin (Failover)', role: 'admin', email: email || 'admin@idealclasses.com' } });
      }
      return res.status(401).json({ message: 'Invalid Admin Password (Failover Mode)' });
    }

    // Standard Database Login
    // Check if the specific email exists as an admin
    let admin = await User.findOne({ email, role: 'admin' });

    // Fallback to searching for ANY admin if email doesn't match a specific one (to support legacy behavior)
    if (!admin) {
      admin = await User.findOne({ role: 'admin' });
    }

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: admin.name, role: 'admin', email: admin.email } });
      }
    } else {
      // Internal code fallback if seed failed but DB IS connected
      const fallbackPass = process.env.ADMIN_PASSWORD || 'IdealPass123';
      if (password === fallbackPass) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: 'Owner/Admin (Failover)', role: 'admin' } });
      }
    }
    res.status(401).json({ message: 'Invalid Admin Password' });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server Error during admin login' });
  }
});

// Change Admin Password
router.post('/admin/change-password', authAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin account not found' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: 'Admin password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error updating password' });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  const { name, email, phone, password } = req.body;
  const mongoose = require('mongoose');

  try {
    if (mongoose.connection.readyState !== 1) {
      // Mock failover
      const studentPassword = process.env.STUDENT_PASSWORD || 'student123';
      if (password === studentPassword) {
        const token = jwt.sign({ role: 'student', email, name }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: name || 'Student', role: 'student', email, phone } });
      }
      return res.status(401).json({ message: 'Invalid Credentials (Mock Mode)' });
    }

    const user = await User.findOne({ name, email, phone, role: 'student' });
    if (user) {
      // Try bcrypt first, fallback to plain text for legacy/existing accounts
      let isMatch = false;
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (e) {
        isMatch = (password === user.password);
      }

      const globalPass = process.env.STUDENT_PASSWORD || 'student123';
      if (isMatch || password === globalPass) {
        const token = jwt.sign({ id: user._id, role: 'student', email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: user.name, role: 'student', email: user.email, phone: user.phone, id: user._id } });
      }
    }

    res.status(401).json({ message: 'Invalid Student Credentials' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error during login' });
  }
});

// Get Profile
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// module.exports = router; (removed)

