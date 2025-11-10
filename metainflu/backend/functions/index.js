const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({origin: true})); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/searchRoutes");

// Register routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/admin", adminRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/chat", chatRoutes);
app.use("/upload", uploadRoutes);
app.use("/search", searchRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Property Dealer API - Firebase Cloud Functions",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
  });
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions
  .region("asia-south1") // Set your region
  .https.onRequest(app);

// Optional: Export other Cloud Functions here
exports.scheduledCleanup = functions
  .region("asia-south1")
  .pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
      console.log("Running scheduled cleanup...");
    // Add cleanup logic here
      return null;
  });