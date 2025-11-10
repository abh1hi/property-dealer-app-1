# 🔥 Firebase Implementation Guide - Property Dealer App (Updated)

This guide has been updated to reflect your specific project structure and accelerate the migration to Firebase.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Backend Migration (Cloud Functions)](#backend-migration)
4. [Database Migration (Firestore)](#database-migration)
5. [Authentication Setup](#authentication-setup)
6. [Storage Setup](#storage-setup)
7. [Frontend Integration](#frontend-integration)
8. [Deployment](#deployment)
9. [Cost Optimization](#cost-optimization)
10. [Monitoring & Maintenance](#monitoring)

---

## Prerequisites

### Required Software
- Node.js v22 (already installed)
- Firebase CLI
- Git

### Install Firebase CLI
If not already installed, run this command:
```bash
npm install -g firebase-tools

# Login to Firebase (a browser window will open)
firebase login
```

---

## 🚀 Phase 1: Firebase Project Setup

### Step 1: Use Your Existing Firebase Project
You've already set up a Firebase project. We will use it.

*   **Project Name**: `test1`
*   **Project ID**: `test1-50da1`

### Step 2: Upgrade to Blaze Plan
To use Cloud Functions and other paid services, you must be on the Blaze plan.

1. Go to Firebase Console → Project `test1-50da1`.
2. Click the gear icon ⚙️ → **Usage and billing**.
3. Click **"Modify plan"** and select **"Blaze (Pay as you go)"**.
4. Set budget alerts to avoid unexpected costs (e.g., at ₹500 and ₹1000).

### Step 3: Enable Firebase Services
Ensure these services are enabled in the `test1-50da1` project console:

#### 3.1 Enable Authentication
1. Firebase Console → Authentication → Get Started.
2. Enable the **Phone** provider.
3. (Optional) Add test phone numbers for development.

#### 3.2 Enable Firestore Database
1. Firebase Console → Firestore Database → Create Database.
2. Start in **production mode**.
3. Choose location: `asia-south1` (Mumbai) is recommended for users in India.

#### 3.3 Enable Firebase Storage
1. Firebase Console → Storage → Get Started.
2. Follow the security rules setup wizard.
3. Location: `asia-south1` (Mumbai).

### Step 4: Register Your Apps

#### Web App (for Frontend)
1. Firebase Console → Project Overview → Add app → **Web** (the `</>` icon).
2. App nickname: `Property Dealer Web`.
3. **Check "Also set up Firebase Hosting"**.
4. **Copy the `firebaseConfig` object**. You will need this for your frontend.

```javascript
// This is an example - use the actual config from your console!
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "test1-50da1.firebaseapp.com",
  projectId: "test1-50da1",
  storageBucket: "test1-50da1.appspot.com",
  messagingSenderId: "317809189734",
  appId: "1:317809189734:web:xxxxxxxxxxxx"
};
```

#### Android App
1. In the same settings page, click Add app → **Android**.
2. **Android package name**: Get this from `metainflu/frontend/client-app/capacitor.config.json`. It's likely `com.propertydealer.app`.
3. Download the `google-services.json` file.
4. Place it in `metainflu/frontend/client-app/android/app/`.

---

## 🔧 Phase 2: Backend Migration (Cloud Functions)

### Step 1: Initialize Firebase in Backend
You have already run `npm install` in the `functions` directory. Now, associate it with your project.

```bash
cd c:\Users\abhin\Desktop\freelance\firebase-apnaaasiana\property-dealer-app-1\metainflu\backend

# Login if you haven't already
firebase login

# Associate this directory with your project
firebase use --add

# Select your project: test1-50da1
```

### Step 2: Configure `firebase.json`
This file tells Firebase how to deploy your services. Replace the content of `metainflu/backend/firebase.json` with this:

```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs22",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint"
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "../frontend/client-app/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```
**Note:** The `hosting.public` path is set for your Vue app's build output. The `rewrites` direct all `/api/**` calls to your cloud function and all other requests to your frontend app.

### Step 3: Adapt Express Server for Cloud Functions
Instead of running a standalone server, we will export the Express app as a single cloud function.

**Action:** Replace the content of `metainflu/backend/functions/index.js` with the following:

```javascript
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Initialize environment variables
dotenv.config();

// Import your existing routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const searchRoutes = require("./routes/searchRoutes");

const { errorHandler } = require("./middleware/errorMiddleware");
const { protect } = require("./middleware/authMiddleware");

const app = express();

// Use your existing CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://test1-50da1.web.app', // IMPORTANT: Add your Firebase Hosting URL
    'capacitor://localhost',
    'http://localhost',
    /^http:\/\/localhost:[0-9]+$/,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Mount your existing API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "API is running...",
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware
app.use(errorHandler);

// Expose the Express app as a single Cloud Function named "api"
exports.api = functions.region("asia-south1").https.onRequest(app);

```
**Next Step:** You will need to move/copy the `routes`, `controllers`, `middleware`, and `models` directories from `metainflu/backend/` into `metainflu/backend/functions/`. The database logic within them will be updated in the next phase.

---

## 💾 Phase 3: Database Migration (Firestore)

This phase involves removing Mongoose and adapting your data logic to use Firestore.

### Step 1: Update Dependencies
`mongoose` should be removed from `functions/package.json` and `firebase-admin` should be present (it is already).

### Step 2: Initialize Firebase Admin SDK
Create a file `metainflu/backend/functions/config/firestore.js` with the following content to initialize the Admin SDK, which allows your functions to access Firebase services.

```javascript
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
```

### Step 3: Convert Models and Controllers
This is the most significant part of the migration. You need to refactor your controllers and services to interact with Firestore instead of MongoDB.

**Example: Updating a Controller**

**Old (`propertyController.js` with Mongoose):**
```javascript
const Property = require('../models/Property');
// ...
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({});
  res.json(properties);
});
```

**New (`propertyController.js` with Firestore):**
```javascript
const { db } = require('../config/firestore'); // <-- Import Firestore
// ...
const getProperties = asyncHandler(async (req, res) => {
  const propertiesSnapshot = await db.collection('properties').get();
  const properties = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(properties);
});
```
You will need to apply this pattern to all your controllers (`authController`, `userController`, etc.).

---

## 🎨 Phase 6: Frontend Integration

### Step 1: Install Firebase SDK
This is already done in your `client-app/package.json`.

### Step 2: Initialize Firebase in Frontend
Create a new file at `metainflu/frontend/client-app/src/config/firebase.js` and add the `firebaseConfig` you copied earlier.

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// PASTE YOUR COPIED CONFIG HERE
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "test1-50da1.firebaseapp.com",
  projectId: "test1-50da1",
  storageBucket: "test1-50da1.appspot.com",
  messagingSenderId: "317809189734",
  appId: "1:317809189734:web:xxxxxxxxxxxx"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### Step 3: Update API Service
Your frontend uses `axios`. You need to update the base URL to point to your live Firebase function URL. For local development, you'll point to the Firebase emulator.

Modify `metainflu/frontend/client-app/src/services/api.js` (or wherever your axios instance is configured):

```javascript
import axios from 'axios';

// Determine API URL based on environment
const API_URL = import.meta.env.MODE === 'development'
  ? 'http://127.0.0.1:5001/test1-50da1/asia-south1/api/api' // Local emulator URL
  : 'https://asia-south1-test1-50da1.cloudfunctions.net/api/api'; // Deployed function URL

const api = axios.create({
  baseURL: API_URL,
});

// ... (add interceptors for auth tokens, etc.)

export default api;
```
**Note:** The local emulator URL follows the pattern: `http://<host>:<port>/<project-id>/<region>/<function-name>`. The `/api` is repeated because your express app is named `api` and the routes are mounted under `/api`.

---

## 🚀 Phase 7: Deployment

### Local Testing (Highly Recommended)
1.  **Start Firebase Emulators**: This runs a local version of Firebase services.
    ```bash
    cd c:\Users\abhin\Desktop\freelance\firebase-apnaaasiana\property-dealer-app-1\metainflu\backend
    firebase emulators:start --import=./firebase-data --export-on-exit
    ```
    *(The `--import` flag can be used to load seed data)*

2.  **Start Frontend Dev Server**:
    ```bash
    cd c:\Users\abhin\Desktop\freelance\firebase-apnaaasiana\property-dealer-app-1\metainflu\frontend\client-app
    npm run dev
    ```
    Now, your frontend at `http://localhost:5173` will communicate with your local backend at `http://127.0.0.1:5001`.

### Deploy to Firebase
1.  **Build Frontend**:
    ```bash
    cd c:\Users\abhin\Desktop\freelance\firebase-apnaaasiana\property-dealer-app-1\metainflu\frontend\client-app
    npm run build
    ```

2.  **Deploy Everything**:
    This command deploys your functions, hosting (with the new frontend build), and security rules all at once.
    ```bash
    cd c:\Users\abhin\Desktop\freelance\firebase-apnaaasiana\property-dealer-app-1\metainflu\backend
    firebase deploy
    ```

### Build Mobile Apps
After deploying, sync your frontend and open the native project.
```bash
cd c:\Users\abhin\Desktop\freelance\firebase-apnaaasiana\property-dealer-app-1\metainflu\frontend\client-app
npm run build
npx cap sync android
npx cap open android
```

---
*(The rest of the guide, including Cost Optimization, Monitoring, and Checklist, remains highly relevant and does not require project-specific changes at this time.)*
