// backend/models/Enquiry.js
const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: { // <-- ADD THIS
    type: String, 
    required: false, // Make it optional
  },
  courseInterest: {
    type: String,
    required: true,
  },
  message: { // <-- ADD THIS
    type: String,
    required: false, // Make it optional
  },
  status: {
    type: String,
    enum: ['public', 'claimed'],
    default: 'public',
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', EnquirySchema);