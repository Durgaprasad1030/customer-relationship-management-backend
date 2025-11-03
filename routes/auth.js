// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware'); // Import auth middleware

// @route   POST api/auth/register
// @desc    Register employee
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login employee
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get logged in user
router.get('/me', auth, getMe); // This route is protected by the auth middleware

module.exports = router;