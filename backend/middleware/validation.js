const { body, validationResult } = require('express-validator');

/**
 * Validation rules for team registration
 */
const validateRegistration = [
  body('team_name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Team name must be between 2 and 100 characters'),

  body('college_name')
    .trim()
    .notEmpty()
    .withMessage('College name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('College name must be between 2 and 200 characters'),

  body('team_leader_name')
    .trim()
    .notEmpty()
    .withMessage('Team leader name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Team leader name must be between 2 and 100 characters'),

  body('team_leader_email')
    .trim()
    .notEmpty()
    .withMessage('Team leader email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('team_leader_phone')
    .trim()
    .notEmpty()
    .withMessage('Team leader phone is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),

  body('team_members')
    .isArray({ min: 1 })
    .withMessage('At least one team member is required'),

  body('team_members.*.name')
    .trim()
    .notEmpty()
    .withMessage('Team member name is required'),

  body('team_members.*.role')
    .trim()
    .notEmpty()
    .withMessage('Team member role/instrument is required'),

  body('num_microphones')
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of microphones must be between 1 and 20'),

  body('drum_setup')
    .trim()
    .notEmpty()
    .withMessage('Drum setup requirement is required (specify "none" if not needed)'),

  body('additional_requirements')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Additional requirements must not exceed 1000 characters'),

  body('instagram_handle')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Instagram handle must not exceed 50 characters'),

  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Validation rules for payment status update
 */
const validatePaymentUpdate = [
  body('payment_status')
    .trim()
    .notEmpty()
    .withMessage('Payment status is required')
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Payment status must be one of: pending, completed, failed, refunded'),

  body('transaction_id')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Transaction ID must be between 5 and 100 characters'),

  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validatePaymentUpdate
};
