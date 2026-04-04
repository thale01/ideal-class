
const mongoose = require('mongoose');
require('dotenv').config();

console.log('--- Database Diagnostics ---');
console.log('URI:', process.env.MONGODB_URI ? 'FOUND' : 'MISSING');

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ Status: Connected to MongoDB successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Status: Connection Failed.');
    console.error('Error Trace:', err.message);
    process.exit(1);
  });
