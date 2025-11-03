// backend/controllers/enquiryController.js
const Enquiry = require('../models/Enquiry');

// @desc    Public form submission
exports.createPublicEnquiry = async (req, res) => {
  // 1. Destructure new fields from req.body
  const { name, email, phone, courseInterest, message } = req.body;
  
  // 2. Add validation for required fields
  if (!name || !email || !courseInterest) {
      return res.status(400).json({ msg: 'Please enter name, email, and course interest' });
  }
  
  try {
    const newEnquiry = new Enquiry({
      name,
      email,
      phone, // ADDED
      courseInterest,
      message, // ADDED
      // status and claimedBy will use default values
    });
    const enquiry = await newEnquiry.save();
    res.json(enquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Fetch all unclaimed leads (Public)
exports.getPublicEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ status: 'public' }).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Fetch leads claimed by logged-in user (Private)
exports.getPrivateEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({
      status: 'claimed',
      claimedBy: req.user.id,
    }).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Claim a lead
exports.claimEnquiry = async (req, res) => {
  try {
    let enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ msg: 'Enquiry not found' });
    }

    // Check if already claimed
    if (enquiry.status === 'claimed') {
      return res.status(400).json({ msg: 'Enquiry already claimed' });
    }

    // Claim the enquiry
    enquiry.status = 'claimed';
    enquiry.claimedBy = req.user.id;
    await enquiry.save();

    res.json(enquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Unclaim a lead
exports.unclaimEnquiry = async (req, res) => {
  try {
    let enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ msg: 'Enquiry not found' });
    }

    // Check if it's already public
    if (enquiry.status === 'public') {
      return res.status(400).json({ msg: 'Enquiry is already public' });
    }

    // Important: Check if the logged-in user is the one who claimed it
    if (enquiry.claimedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to unclaim this lead' });
    }

    // Unclaim the enquiry
    enquiry.status = 'public';
    enquiry.claimedBy = null;
    await enquiry.save();

    res.json(enquiry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};