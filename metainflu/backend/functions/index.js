const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ 
  origin: true,
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Property Dealer API is running on Firebase Cloud Functions',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Export Express app as Cloud Function
// Region: asia-south1 (Mumbai, India) for lower latency
exports.api = functions
  .region('asia-south1')
  .runWith({
    timeoutSeconds: 300,
    memory: '512MB',
    minInstances: 0, // Scale to zero when not in use
    maxInstances: 10 // Limit for cost control
  })
  .https.onRequest(app);

// Additional function for scheduled tasks (optional)
exports.scheduledCleanup = functions
  .region('asia-south1')
  .pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
    console.log('Running scheduled cleanup...');
    // Add cleanup logic here
    return null;
  });
