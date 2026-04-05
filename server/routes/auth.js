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

    const { isFirebaseVerified } = req.body;
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch || isFirebaseVerified) {
        if (isFirebaseVerified) console.log('ADMIN LOGIN: VERIFIED (Via Firebase)');
        const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: admin.name, role: 'admin', email: admin.email } });
      }
    } else {
      // Internal code fallback if seed failed but DB IS connected
      const fallbackPass = process.env.ADMIN_PASSWORD || 'IdealPass123';
      if (password === fallbackPass || isFirebaseVerified) {
        if (isFirebaseVerified) console.log('ADMIN LOGIN: VERIFIED (Via Firebase Fallback)');
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

// Admin reset any Student Password
router.put('/admin/reset-student-password', authAdmin, async (req, res) => {
  const { studentId, newPassword } = req.body;
  try {
    const user = await User.findById(studentId);
    if (!user || user.role !== 'student') {
        return res.status(404).json({ message: 'Student not found' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error resetting student password' });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  const { name, email, phone, password } = req.body;
  const mongoose = require('mongoose');

  // DEBUG LOGS
  console.log('--- STUDENT LOGIN ATTEMPT ---');
  console.log('DB CONNECTION STATUS:', mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED');
  console.log('REQUEST DATA:', { 
    name: name?.trim(), 
    email: email?.trim().toLowerCase(), 
    phone: phone?.trim(), 
    passwordLength: password?.length 
  });

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('MOCK FAILOVER ACTIVATED: Database not ready');
      const studentPassword = process.env.STUDENT_PASSWORD || 'student123';
      if (password === studentPassword) {
        const token = jwt.sign({ role: 'student', email, name }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { name: name || 'Student', role: 'student', email, phone } });
      }
      return res.status(401).json({ message: 'Invalid Credentials (Mock Mode)' });
    }

    // SEARCH STRATEGY: Use unique email first for lookup
    const trimmedEmail = email?.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail, role: 'student' });

    if (!user) {
       console.log('USER STATUS: NOT FOUND (email mismatch)');
       return res.status(401).json({ message: 'No student account found with this email' });
    }

    console.log('USER STATUS: FOUND - Name:', user.name);

    // APPROVAL CHECK
    if (user.status === 'pending') {
      console.log('USER STATUS: BLOCKED (Pending Approval)');
      return res.status(403).json({ message: 'Your account is not approved yet' });
    }

    // PASSWORD VERIFICATION
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
      console.log('BCRYPT MATCH:', isMatch);
    } catch (e) {
      // Fallback for plain-text password for legacy/manually added records
      isMatch = (password === user.password);
      console.log('PLAIN-TEXT MATCH (Fallback):', isMatch);
    }

    const { isFirebaseVerified } = req.body;
    const globalPass = process.env.STUDENT_PASSWORD || 'student123';
    
    if (isMatch || password === globalPass || isFirebaseVerified) {
      if (isFirebaseVerified) console.log('LOGIN STATUS: VERIFIED (Via Firebase Primary)');
      else console.log('LOGIN STATUS: VERIFIED (Local Credentials)');
      
      const token = jwt.sign({ id: user._id, role: 'student', email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { name: user.name, role: 'student', email: user.email, phone: user.phone, id: user._id } });
    }

    console.log('LOGIN STATUS: FAILED (Password Mismatch)');
    res.status(401).json({ message: 'Invalid Credentials - Check your password' });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server Internal Error during authentication' });
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

