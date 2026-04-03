const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const mockDb = require('../mock-db');
const mongoose = require('mongoose');

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_PASS || 'your-app-password'
  }
});

// Apply for admission (Student Portal)
router.post('/apply', async (req, res) => {
  const { name, email, phone, classApplied, previousScore, message, batch } = req.body;
  if (mongoose.connection.readyState !== 1) {
    const mockRes = mockDb.save('admissions', { name, email, phone, classApplied, previousScore, message, batch, status: 'pending' });
    return res.status(201).json(mockRes);
  }
  try {
    const application = new Admission({
      name, email, phone, classApplied, previousScore, message, batch
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: 'Error submitting application.' });
  }
});

// GET all applications (Admin)
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('admissions') || []);
  }
  try {
    const list = await Admission.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications list.' });
  }
});

// Setup Email Notification Helper
const sendApprovalEmail = (name, email, classApplied) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Admission Approved - Ideal Classes',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4a90e2;">Congratulations ${name}!</h2>
        <p>We are pleased to inform you that your admission for <b>${classApplied}</b> at <b>Ideal Classes</b> has been approved!</p>
        <p><b>Your student account is now active:</b></p>
        <ul>
          <li><b>Login ID:</b> ${email}</li>
          <li><b>Temporary Password:</b> student123</li>
        </ul>
        <p>Please login to the portal to access your study material and lectures.</p>
        <br/>
        <p>Best Regards,</p>
        <p><b>Ideal Classes Team</b></p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("❌ Email failed to send:", err.message);
    else console.log("✅ Admission email sent to:", email);
  });
};

router.patch('/:id/approve', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const app = mockDb.update('admissions', req.params.id, item => {
       item.status = 'approved';
       return item;
    });
    // Create mock student
    mockDb.save('students', { name: app.name, email: app.email, phone: app.phone, role: 'student', active: true });
    
    // Send email even in mock mode
    sendApprovalEmail(app.name, app.email, app.classApplied);
    
    return res.json(app);
  }
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission record not found' });

    // 1. Update Admission Status
    admission.status = 'approved';
    await admission.save();

    // 2. Create Student Account if it doesn't already exist
    let student = await User.findOne({ email: admission.email, role: 'student' });
    if (!student) {
      student = new User({
        name: admission.name,
        email: admission.email,
        phone: admission.phone,
        studentClass: admission.classApplied,
        batch: admission.batch || 'DEFAULT BATCH',
        role: 'student',
        password: 'student123'
      });
      await student.save();
    }

    // 3. Send Email Notification
    sendApprovalEmail(admission.name, admission.email, admission.classApplied);
    
    res.json(admission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockDb.remove('admissions', req.params.id);
    return res.json({ message: 'Deleted from local mock storage' });
  }
  try {
    const app = await Admission.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting application' });
  }
});

module.exports = router;
