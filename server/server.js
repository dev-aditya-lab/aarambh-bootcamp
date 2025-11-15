const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const registrationRoutes = require('./routes/registration');
const { router: adminRoutes } = require('./routes/admin');
const configRoutes = require('./routes/config');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aarambh';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/api/registration', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/config', configRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Aarambh API is running!',
    endpoints: {
      register: 'POST /api/registration',
      getRegistrations: 'GET /api/registration',
      deleteRegistration: 'DELETE /api/registration/:id',
      adminLogin: 'POST /api/admin/login',
      adminCreate: 'POST /api/admin/create',
      getConfig: 'GET /api/config',
      updateConfig: 'PUT /api/config/*'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 AARAMBH SERVER IS RUNNING 🚀    ║
╠═══════════════════════════════════════╣
║  Port: ${PORT}                          ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  API: http://localhost:${PORT}         ║
╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});
