const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String }, // Optional but useful for search/linking
  totalFees: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  pendingFees: { type: Number }, // Calculated
  paymentMode: { type: String, enum: ['Cash', 'Online'], required: true },
  date: { type: Date, default: Date.now },
  remarks: { type: String }
});

feeSchema.pre('save', function(next) {
  this.pendingFees = this.totalFees - this.paidAmount;
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
