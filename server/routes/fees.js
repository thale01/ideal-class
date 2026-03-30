const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

const mockDb = require('../mock-db');
const mongoose = require('mongoose');

// Add manual fee entry
router.post('/', async (req, res) => {
  const { studentName, email, totalFees, paidAmount, paymentMode, date, remarks } = req.body;
  if (mongoose.connection.readyState !== 1) {
    const mockRes = mockDb.save('fees', { studentName, email, totalFees, paidAmount, paymentMode, date, remarks });
    return res.json(mockRes);
  }
  try {
    const fee = new Fee({ studentName, email, totalFees, paidAmount, paymentMode, date, remarks });
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all fees
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDb.get('fees') || []);
  }
  try {
    const fees = await Fee.find().sort({ date: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update fee
router.patch('/:id', async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    
    Object.assign(fee, req.body);
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete fee
router.delete('/:id', async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
