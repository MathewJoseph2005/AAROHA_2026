const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// Registration fee constant
const REGISTRATION_FEE = 1200;

/**
 * Create a new team registration
 */
const createRegistration = async (req, res) => {
  try {
    const {
      team_name,
      college_name,
      team_leader_name,
      team_leader_email,
      team_leader_phone,
      team_members,
      num_microphones,
      drum_setup,
      additional_requirements,
      instagram_handle,
      transaction_id
    } = req.body;

    const registration_id = uuidv4();

    // User must be logged in (verifyToken middleware)
    const user_id = req.user.id;

    // Check if user already has a registration
    const { data: existing, error: checkError } = await supabase
      .from('registrations')
      .select('registration_id, registration_status, payment_status')
      .eq('user_id', user_id);

    // Allow re-registration if all previous registrations were rejected
    const activeRegistrations = (!checkError && existing)
      ? existing.filter(r => r.registration_status !== 'rejected' && r.payment_status !== 'failed')
      : [];

    if (activeRegistrations.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered a band. Only one registration per user is allowed.'
      });
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert([
        {
          registration_id,
          user_id,
          team_name,
          college_name,
          team_leader_name,
          team_leader_email,
          team_leader_phone,
          team_members,
          num_microphones,
          drum_setup,
          additional_requirements,
          instagram_handle: instagram_handle || null,
          transaction_id: transaction_id || null,
          registration_fee: REGISTRATION_FEE,
          payment_status: 'pending',
          registration_status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please complete the payment.',
      data: data[0],
      payment_details: {
        amount: REGISTRATION_FEE,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all registrations
 */
const getAllRegistrations = async (req, res) => {
  try {
    const { status, payment_status } = req.query;

    let query = supabase.from('registrations').select('*');

    if (status) {
      query = query.eq('registration_status', status);
    }

    if (payment_status) {
      query = query.eq('payment_status', payment_status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch registrations',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get registration by ID
 */
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('registration_id', id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update registration
 */
const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.registration_id;
    delete updateData.created_at;

    const { data, error } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('registration_id', id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Update failed',
        error: error.message
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, transaction_id } = req.body;

    // Check if registration is already rejected — block re-approval
    const { data: currentReg } = await supabase
      .from('registrations')
      .select('registration_status')
      .eq('registration_id', id)
      .single();

    if (currentReg?.registration_status === 'rejected' && payment_status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot approve a rejected registration. The user must register again.'
      });
    }

    const updateData = {
      payment_status,
      updated_at: new Date().toISOString()
    };

    if (transaction_id) {
      updateData.transaction_id = transaction_id;
    }

    if (payment_status === 'completed') {
      updateData.registration_status = 'confirmed';
    }

    if (payment_status === 'failed') {
      updateData.registration_status = 'rejected';
    }

    const { data, error } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('registration_id', id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Payment status update failed',
        error: error.message
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete registration
 */
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('registrations')
      .delete()
      .eq('registration_id', id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Delete failed',
        error: error.message
      });
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get event statistics
 */
const getEventStats = async (req, res) => {
  try {
    const { data: allRegistrations, error } = await supabase
      .from('registrations')
      .select('registration_status, payment_status');

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }

    const stats = {
      total_registrations: allRegistrations.length,
      confirmed: allRegistrations.filter(r => r.registration_status === 'confirmed').length,
      pending: allRegistrations.filter(r => r.registration_status === 'pending').length,
      payments_completed: allRegistrations.filter(r => r.payment_status === 'completed').length,
      payments_pending: allRegistrations.filter(r => r.payment_status === 'pending').length,
      total_revenue: allRegistrations.filter(r => r.payment_status === 'completed').length * REGISTRATION_FEE,
      event_details: {
        name: 'AAROHA 2026 - Battle of Bands: SARGAM',
        prize_pool: 60000,
        event_time: '12:00 PM – 6:00 PM',
        reporting_time: '10:00 AM',
        registration_fee: REGISTRATION_FEE
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get current user's registrations
 */
const getMyRegistrations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch registrations',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  updatePaymentStatus,
  deleteRegistration,
  getEventStats,
  getMyRegistrations
};
