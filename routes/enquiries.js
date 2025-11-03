// backend/routes/enquiries.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createPublicEnquiry,
  getPublicEnquiries,
  getPrivateEnquiries,
  claimEnquiry,
  unclaimEnquiry, // Make sure this is imported
} = require('../controllers/enquiryController');

// --- Public Route (No Auth) ---
// @route   POST api/enquiries/public
// @desc    Public enquiry form submission
router.post('/public', createPublicEnquiry);

// --- Private Routes (Auth Required) ---
// @route   GET api/enquiries/public
// @desc    Fetch unclaimed leads
router.get('/public', auth, getPublicEnquiries);

// @route   GET api/enquiries/private
// @desc    Fetch leads claimed by logged in user
router.get('/private', auth, getPrivateEnquiries);

// @route   POST api/enquiries/claim/:id
// @desc    Claim a lead
router.post('/claim/:id', auth, claimEnquiry);

// @route   POST api/enquiries/unclaim/:id
// @desc    Unclaim a lead
router.post('/unclaim/:id', auth, unclaimEnquiry); // Make sure this line exists

module.exports = router;