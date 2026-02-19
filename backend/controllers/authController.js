const supabase = require('../config/supabase');

/**
 * Helper: Check if email is in ADMIN_EMAILS environment variable
 */
const isAdminEmail = (email) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  return email && adminEmails.includes(email.toLowerCase());
};

/**
 * Helper: Get effective role (checks both profile role and ADMIN_EMAILS)
 */
const getEffectiveRole = (email, profileRole) => {
  if (isAdminEmail(email)) return 'admin';
  return profileRole || 'team';
};

/**
 * Sign up a new user (Team)
 */
const signUp = async (req, res) => {
  try {
    const { email, password, name, phone, college_name } = req.body;

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          college_name,
          role: 'team'
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Create user profile in database
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: data.user.id,
            email: email,
            name: name,
            phone: phone,
            college_name: college_name,
            role: 'team'
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          role: 'team'
        },
        session: data.session
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

/**
 * Sign in user (Team or Admin)
 */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: getEffectiveRole(data.user.email, profile?.role),
          name: profile?.name
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

/**
 * Sign out user
 */
const signOut = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed.'
    });
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    let { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    // If profile doesn't exist, auto-create it from auth user metadata
    if (error || !profile) {
      const metadata = req.user.user_metadata || {};
      const newProfile = {
        user_id: req.user.id,
        email: req.user.email,
        name: metadata.name || metadata.full_name || '',
        phone: metadata.phone || '',
        college_name: metadata.college_name || '',
        role: getEffectiveRole(req.user.email, req.userProfile?.role),
      };

      const { data: created, error: insertError } = await supabase
        .from('user_profiles')
        .upsert([newProfile], { onConflict: 'user_id' })
        .select()
        .single();

      if (!insertError && created) {
        profile = created;
      } else {
        // Table might not exist yet — return basic info from auth token
        console.error('Profile upsert error:', insertError?.message);
        profile = newProfile;
      }
    }

    // Update profile role to effective role (checks ADMIN_EMAILS)
    if (profile) {
      profile.role = getEffectiveRole(profile.email, profile.role);
    }

    // Get user's registrations
    let registrations = [];
    try {
      const { data: regData } = await supabase
        .from('registrations')
        .select('registration_id, team_name, registration_status, payment_status, created_at')
        .eq('user_id', req.user.id);
      registrations = regData || [];
    } catch (regErr) {
      console.error('Registrations fetch error:', regErr.message);
    }

    res.status(200).json({
      success: true,
      data: {
        profile,
        registrations
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.'
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, college_name } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        name,
        phone,
        college_name,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', req.user.id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: data[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.'
    });
  }
};

/**
 * Request password reset
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset email.'
    });
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password.'
    });
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token.'
    });
  }
};

/**
 * Admin: Create admin user (protected - only existing admins)
 */
/**
 * Setup first admin using ADMIN_SECRET (no login required)
 * Use this for initial admin setup
 */
const setupAdmin = async (req, res) => {
  try {
    const { email, password, name, phone, admin_secret } = req.body;

    // Verify admin secret
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    
    if (!ADMIN_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'ADMIN_SECRET not configured in environment variables.'
      });
    }

    if (admin_secret !== ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin secret. Access denied.'
      });
    }

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role: 'admin'
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Create admin profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: data.user.id,
            email: email,
            name: name,
            phone: phone,
            role: 'admin'
          }
        ]);

      if (profileError) {
        console.error('Admin profile creation error:', profileError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      data: {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          role: 'admin'
        }
      }
    });
  } catch (error) {
    console.error('Setup admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin account.'
    });
  }
};

/**
 * Admin: Create another admin (requires existing admin to be logged in)
 */
const createAdmin = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role: 'admin'
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Create admin profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: data.user.id,
            email: email,
            name: name,
            phone: phone,
            role: 'admin'
          }
        ]);

      if (profileError) {
        console.error('Admin profile creation error:', profileError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      data: {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          role: 'admin'
        }
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin account.'
    });
  }
};

/**
 * Admin: Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let query = supabase.from('user_profiles').select('*');

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users.'
    });
  }
};

/**
 * Sign in with Google OAuth
 * Frontend sends Google ID token after Google Sign-In
 */
const googleSignIn = async (req, res) => {
  try {
    const { id_token, access_token, name, phone, college_name } = req.body;

    if (!id_token) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Sign in with Google ID token using Supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: id_token,
      access_token: access_token // Optional: Google access token
    });

    if (error) {
      console.error('Google sign in error:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Google authentication failed'
      });
    }

    // Check if user profile exists, if not create one
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    let userProfile = existingProfile;

    if (!existingProfile) {
      // Create new profile for Google user
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: data.user.id,
            email: data.user.email,
            name: name || data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'Google User',
            phone: phone || null,
            college_name: college_name || null,
            role: 'team'
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        userProfile = newProfile;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Google sign in successful!',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: getEffectiveRole(data.user.email, userProfile?.role),
          name: userProfile?.name || data.user.user_metadata?.full_name
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        },
        isNewUser: !existingProfile
      }
    });
  } catch (error) {
    console.error('Google sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed. Please try again.'
    });
  }
};

/**
 * Get Google OAuth URL for redirect-based flow
 * Constructs the URL manually since signInWithOAuth is a client-side method
 */
const getGoogleAuthUrl = async (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      return res.status(500).json({
        success: false,
        message: 'Supabase URL not configured'
      });
    }

    const redirectTo = process.env.GOOGLE_REDIRECT_URL || 'http://localhost:3000/auth/callback';
    const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

    res.status(200).json({
      success: true,
      data: {
        url: authUrl
      }
    });
  } catch (error) {
    console.error('Get Google auth URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Google authentication URL'
    });
  }
};

module.exports = {
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
};
