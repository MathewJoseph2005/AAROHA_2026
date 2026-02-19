const supabase = require('../config/supabase');

/**
 * Verify JWT token from Supabase Auth
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    // Get user profile with role from database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
    }

    // Attach user and profile to request
    req.user = user;
    req.userProfile = profile || { role: 'team' }; // Default to team role

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error.'
    });
  }
};

/**
 * Check if user is admin
 * Admin access is granted if:
 * 1. User has role 'admin' in user_profiles table, OR
 * 2. User's email is in the ADMIN_EMAILS environment variable
 */
const isAdmin = (req, res, next) => {
  // Check if email is in ADMIN_EMAILS list
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  const userEmail = req.user?.email?.toLowerCase();
  const isEmailAdmin = userEmail && adminEmails.includes(userEmail);

  if (isEmailAdmin || (req.userProfile && req.userProfile.role === 'admin')) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin privileges required.'
  });
};

/**
 * Check if user is team member or admin
 */
const isTeamOrAdmin = (req, res, next) => {
  if (!req.userProfile || !['team', 'admin'].includes(req.userProfile.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Authentication required.'
    });
  }
  next();
};

/**
 * Check if user owns the registration or is admin
 */
const canAccessRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Admins can access any registration
    if (req.userProfile && req.userProfile.role === 'admin') {
      return next();
    }

    // Check if user owns this registration
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('user_id')
      .eq('registration_id', id)
      .single();

    if (error || !registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.'
      });
    }

    if (registration.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own registration.'
      });
    }

    next();
  } catch (error) {
    console.error('Access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization error.'
    });
  }
};

/**
 * Optional auth - doesn't fail if no token, just attaches user if present
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      req.user = user;
      req.userProfile = profile || { role: 'team' };
    }

    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isTeamOrAdmin,
  canAccessRegistration,
  optionalAuth
};
