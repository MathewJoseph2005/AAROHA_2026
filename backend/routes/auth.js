const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  signOut,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
  setupAdmin,
  createAdmin,
  getAllUsers,
  googleSignIn,
  getGoogleAuthUrl
} = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validateSignUp, validateSignIn, validateForgotPassword, validateAdminSetup } = require('../middleware/authValidation');

// =====================================================
// PUBLIC ROUTES (No authentication required)
// =====================================================

// Team signup (only for teams, not admins)
router.post('/signup', validateSignUp, signUp);

// Login (for both teams and admins)
router.post('/signin', validateSignIn, signIn);

// Google OAuth routes
router.post('/google', googleSignIn);           // Frontend sends Google ID token
router.get('/google/url', getGoogleAuthUrl);    // Get Google OAuth redirect URL

// Password recovery
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/refresh-token', refreshToken);

// Admin setup (uses ADMIN_SECRET, no login required)
// Use this to create the first admin account
router.post('/admin/setup', validateAdminSetup, setupAdmin);

// =====================================================
// PROTECTED ROUTES (Require authentication)
// =====================================================

router.post('/signout', verifyToken, signOut);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/reset-password', verifyToken, resetPassword);

// =====================================================
// ADMIN ONLY ROUTES (Require admin login)
// =====================================================

// Create another admin (existing admin must be logged in)
router.post('/admin/create', verifyToken, isAdmin, createAdmin);

// Get all users
router.get('/admin/users', verifyToken, isAdmin, getAllUsers);

module.exports = router;
