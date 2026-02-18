const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const registrationRoutes = require('./routes/registration');
const authRoutes = require('./routes/auth');
const { initializeDatabase } = require('./scripts/initDb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AAROHA 2026 - SARGAM Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);

// OAuth callback handler
app.get('/auth/callback', (req, res) => {
  // Supabase sends tokens in the URL hash fragment
  // This page extracts them and displays the result
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Google Sign-In - AAROHA 2026</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        h1 { color: #4285f4; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .success { color: green; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h1>🎶 AAROHA 2026 - Google Sign-In</h1>
      <div id="result">Processing...</div>
      <script>
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const error = params.get('error_description');
        
        const resultDiv = document.getElementById('result');
        
        if (error) {
          resultDiv.innerHTML = '<p class="error">Error: ' + error + '</p>';
        } else if (accessToken) {
          resultDiv.innerHTML = '<p class="success">✅ Google Sign-In Successful!</p>' +
            '<h3>Access Token:</h3><pre>' + accessToken + '</pre>' +
            '<h3>Refresh Token:</h3><pre>' + (refreshToken || 'N/A') + '</pre>' +
            '<p>Use the access token in the Authorization header for API requests:</p>' +
            '<pre>Authorization: Bearer ' + accessToken + '</pre>';
        } else {
          resultDiv.innerHTML = '<p class="error">No tokens found in URL</p>';
        }
      </script>
    </body>
    </html>
  `);
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to AAROHA 2026 - Battle of Bands: SARGAM API',
    version: '1.0.0',
    endpoints: {
      // Health
      health: 'GET /health',
      
      // Auth (Public - Team)
      signup: 'POST /api/auth/signup [Team Only]',
      signin: 'POST /api/auth/signin',
      google_signin: 'POST /api/auth/google [Google ID Token]',
      google_url: 'GET /api/auth/google/url [Get OAuth URL]',
      forgot_password: 'POST /api/auth/forgot-password',
      refresh_token: 'POST /api/auth/refresh-token',
      
      // Auth (Admin Setup - No Login Required)
      admin_setup: 'POST /api/auth/admin/setup [Requires ADMIN_SECRET]',
      
      // Auth (Protected)
      signout: 'POST /api/auth/signout [Auth Required]',
      profile: 'GET /api/auth/profile [Auth Required]',
      update_profile: 'PUT /api/auth/profile [Auth Required]',
      
      // Auth (Admin Only)
      create_admin: 'POST /api/auth/admin/create [Admin Only]',
      get_all_users: 'GET /api/auth/admin/users [Admin Only]',
      
      // Registration (Public)
      event_info: 'GET /api/registrations/event-info',
      register: 'POST /api/registrations/register',
      
      // Registration (Protected)
      my_registrations: 'GET /api/registrations/my-registrations [Auth Required]',
      get_one: 'GET /api/registrations/:id [Auth Required]',
      update: 'PUT /api/registrations/:id [Auth Required]',
      
      // Registration (Admin Only)
      get_all: 'GET /api/registrations [Admin Only]',
      stats: 'GET /api/registrations/stats/overview [Admin Only]',
      update_payment: 'PATCH /api/registrations/:id/payment [Admin Only]',
      delete: 'DELETE /api/registrations/:id [Admin Only]'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and start server
const startServer = async () => {
  // Check database tables on startup
  try {
    await initializeDatabase();
  } catch (err) {
    console.error('Database initialization warning:', err.message);
    console.log('Server will continue, but some features may not work.\n');
  }

  app.listen(PORT, () => {
    console.log(`
  🎶 AAROHA 2026 - SARGAM Backend Server 🎶
  ==========================================
  Server running on port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  
  Event: Battle of Bands - SARGAM
  Prize Pool: ₹60,000
  Registration Fee: ₹1200 per team
  ==========================================
  
  AUTH ENDPOINTS:
  - POST /api/auth/signup                  - Team signup only
  - POST /api/auth/signin                  - Login (Team/Admin)
  - POST /api/auth/google                  - Google Sign-In (ID Token)
  - GET  /api/auth/google/url              - Get Google OAuth URL
  - POST /api/auth/admin/setup             - Create first admin [ADMIN_SECRET]
  - POST /api/auth/signout                 - Logout [Auth]
  - GET  /api/auth/profile                 - Get profile [Auth]
  - PUT  /api/auth/profile                 - Update profile [Auth]
  - POST /api/auth/forgot-password         - Password reset
  - POST /api/auth/admin/create            - Create admin [Admin]
  - GET  /api/auth/admin/users             - All users [Admin]
  
  REGISTRATION ENDPOINTS:
  - GET  /api/registrations/event-info     - Event details
  - POST /api/registrations/register       - New registration
  - GET  /api/registrations/my-registrations - My teams [Auth]
  - GET  /api/registrations/:id            - Get by ID [Auth]
  - PUT  /api/registrations/:id            - Update [Auth]
  - GET  /api/registrations                - All registrations [Admin]
  - GET  /api/registrations/stats/overview - Statistics [Admin]
  - PATCH /api/registrations/:id/payment   - Payment update [Admin]
  - DELETE /api/registrations/:id          - Delete [Admin]
  ==========================================
    `);
  });
};

startServer();

module.exports = app;
