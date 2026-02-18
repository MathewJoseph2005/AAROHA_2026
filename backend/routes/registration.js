const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  updatePaymentStatus,
  deleteRegistration,
  getEventStats,
  getMyRegistrations
} = require('../controllers/registrationController');
const { validateRegistration, validatePaymentUpdate } = require('../middleware/validation');
const { verifyToken, isAdmin, optionalAuth, canAccessRegistration } = require('../middleware/auth');

// =====================================================
// PUBLIC ROUTES (No authentication required)
// =====================================================

// Event info route
router.get('/event-info', (req, res) => {
  res.status(200).json({
    success: true,
    event: {
      name: 'AAROHA 2026 - Battle of Bands: SARGAM',
      description: 'A high-energy inter-college music showdown bringing together the most talented campus bands for an electrifying live performance experience.',
      prize_pool: '₹60,000',
      event_time: '12:00 PM – 6:00 PM',
      reporting_time: '10:00 AM (2 hours prior - Mandatory)',
      registration_fee: '₹1200 per team',
      requirements: [
        'Team must specify number of microphones',
        'Team must specify drum setup requirements',
        'Any additional technical requirements must be mentioned'
      ]
    }
  });
});

// Register team (requires authentication)
router.post('/register', verifyToken, validateRegistration, createRegistration);

// =====================================================
// AUTHENTICATED ROUTES (Require login)
// =====================================================

// Get my registrations (for logged in team users)
router.get('/my-registrations', verifyToken, getMyRegistrations);

// Get single registration (user can only access their own, admin can access all)
router.get('/:id', verifyToken, canAccessRegistration, getRegistrationById);

// Update registration (user can only update their own, admin can update all)
router.put('/:id', verifyToken, canAccessRegistration, updateRegistration);

// =====================================================
// ADMIN ONLY ROUTES
// =====================================================

// Get all registrations (admin only)
router.get('/', verifyToken, isAdmin, getAllRegistrations);

// Event statistics (admin only)
router.get('/stats/overview', verifyToken, isAdmin, getEventStats);

// Update payment status (admin only)
router.patch('/:id/payment', verifyToken, isAdmin, validatePaymentUpdate, updatePaymentStatus);

// Delete registration (admin only)
router.delete('/:id', verifyToken, isAdmin, deleteRegistration);

module.exports = router;
