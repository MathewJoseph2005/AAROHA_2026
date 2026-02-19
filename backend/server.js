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

// ============================================
// Serve frontend static files in production
// ============================================
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Root route — serve frontend or API info
app.get('/', (req, res, next) => {
  // If dist/index.html exists, let express.static handle it
  // Otherwise fall through to API info
  const fs = require('fs');
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return next(); // Will be caught by the SPA fallback below
  }
  // No frontend build — show API info
  res.status(200).json({
    success: true,
    message: 'Welcome to AAROHA 2026 - Battle of Bands: SARGAM API',
    version: '1.0.0',
  });
});

// 404 handler — for non-API routes, serve the SPA index.html
app.use((req, res, next) => {
  // If it's an API route, return 404 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }
  // Otherwise serve the SPA (client-side routing)
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
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
