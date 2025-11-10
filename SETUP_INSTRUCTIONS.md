# 🚀 Setup Instructions - Property Dealer App (Firebase)

## Prerequisites

- **Node.js**: v22 or higher
- **npm**: v10 or higher
- **Firebase CLI**: Latest version
- **Git**: Latest version
- **Android Studio**: For mobile app development (optional)

---

## 💻 Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abh1hi/property-dealer-app-1.git
cd property-dealer-app-1

# Checkout the Firebase migration branch
git checkout firebase-migration-complete
```

### 2. Install Firebase CLI

```bash
# Install globally
npm install -g firebase-tools

# Verify installation
firebase --version

# Login to Firebase
firebase login
```

---

## 🔥 Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name: `property-dealer-app`
4. Enable Google Analytics (recommended)
5. Click **"Create project"**

### 2. Upgrade to Blaze Plan

⚠️ **Required for Cloud Functions**

1. Firebase Console → Settings → Usage and billing
2. Click **"Modify plan"**
3. Select **"Blaze (Pay as you go)"**
4. Add payment method
5. Set budget alerts:
   - Alert at ₹500
   - Alert at ₹800

### 3. Enable Firebase Services

#### Authentication
```
1. Firebase Console → Authentication → Get Started
2. Enable "Phone" sign-in method
3. (Optional) Add test phone numbers for development
```

#### Firestore Database
```
1. Firebase Console → Firestore Database → Create Database
2. Start in production mode
3. Location: asia-south1 (Mumbai, India)
4. Click Enable
```

#### Firebase Storage
```
1. Firebase Console → Storage → Get Started
2. Start in production mode
3. Location: asia-south1 (Mumbai, India)
4. Click Done
```

### 4. Register Web App

1. Project Overview → Add app → Web
2. App nickname: `Property Dealer Web`
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. **Copy the Firebase configuration** (you'll need this next)

---

## ⚙️ Backend Configuration

### 1. Navigate to Backend Directory

```bash
cd metainflu/backend
```

### 2. Link Firebase Project

```bash
# Select your Firebase project
firebase use --add

# Select: property-dealer-app
# Alias: default
```

### 3. Install Dependencies

```bash
cd functions
npm install
cd ..
```

### 4. Configure Firebase (if needed)

The `firebase.json` and `.firebaserc` should already be configured. Verify:

```bash
cat firebase.json
cat .firebaserc
```

---

## 🎨 Frontend Configuration

### 1. Navigate to Frontend Directory

```bash
cd metainflu/frontend/client-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit with your Firebase config
nano .env  # or use your preferred editor
```

**Update `.env` with your Firebase configuration:**

```env
VITE_FIREBASE_API_KEY=AIza...your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=property-dealer-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=property-dealer-app
VITE_FIREBASE_STORAGE_BUCKET=property-dealer-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# For local development
VITE_API_URL=http://localhost:5001/property-dealer-app/asia-south1/api
VITE_ENV=development
```

---

## 🧪 Local Development with Emulators

### 1. Initialize Firebase Emulators

```bash
cd metainflu/backend

# Initialize emulators (if not already done)
firebase init emulators

# Select:
# ✓ Authentication Emulator
# ✓ Functions Emulator
# ✓ Firestore Emulator
# ✓ Storage Emulator
```

### 2. Start Firebase Emulators

```bash
# From backend directory
firebase emulators:start
```

**Emulator URLs:**
- Emulator UI: http://localhost:4000
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Auth: http://localhost:9099
- Storage: http://localhost:9199

### 3. Start Frontend Development Server

**In a new terminal:**

```bash
cd metainflu/frontend/client-app
npm run dev
```

**Access the app:**
- Frontend: http://localhost:5173
- Emulator UI: http://localhost:4000

---

## 🧪 Testing

### Manual Testing

1. Open frontend at http://localhost:5173
2. Test authentication flows:
   - Phone OTP registration
   - Phone OTP login
   - Aadhaar + password registration
   - Password login
3. Test property management:
   - Create property with images
   - View property list
   - Update property
   - Delete property
4. Monitor Emulator UI at http://localhost:4000

### View Emulator Data

- **Firestore**: Check documents in Collections tab
- **Auth**: View registered users in Authentication tab
- **Storage**: See uploaded files in Storage tab
- **Functions**: Monitor logs in Functions tab

---

## 📱 Mobile App Setup (Android)

### 1. Register Android App in Firebase

1. Firebase Console → Project Overview → Add app → Android
2. Package name: `com.propertydealer.app`
3. Download `google-services.json`
4. Place file in: `metainflu/frontend/client-app/android/app/`

### 2. Build and Run

```bash
cd metainflu/frontend/client-app

# Build frontend
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on emulator or device from Android Studio
```

---

## 🚀 Deployment to Production

### 1. Build Frontend

```bash
cd metainflu/frontend/client-app

# Production build
npm run build
```

### 2. Deploy to Firebase

```bash
cd metainflu/backend

# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 3. Update Frontend Environment

Update `.env` for production:

```env
VITE_API_URL=https://asia-south1-property-dealer-app.cloudfunctions.net/api
VITE_ENV=production
```

Rebuild and redeploy:

```bash
npm run build
cd ../../backend
firebase deploy --only hosting
```

### 4. Access Production App

**URLs:**
- Frontend: https://property-dealer-app.web.app
- API: https://asia-south1-property-dealer-app.cloudfunctions.net/api

---

## 🐛 Troubleshooting

### Firebase CLI Issues

```bash
# Logout and login again
firebase logout
firebase login

# Clear cache
firebase logout
rm -rf ~/.config/firebase
firebase login
```

### Emulator Issues

```bash
# Kill all Firebase processes
pkill -f firebase

# Clear emulator data
rm -rf ~/.config/firebase/emulators

# Restart emulators
firebase emulators:start
```

### CORS Errors

- Ensure `origin: true` is set in Cloud Functions (already configured)
- Check API URL in frontend `.env` file
- Verify emulators are running

### Port Already in Use

```bash
# Find process using port 5001 (or other port)
lsof -ti:5001 | xargs kill -9

# Or change ports in firebase.json
```

### Dependencies Issues

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📊 Monitoring & Logs

### View Function Logs

```bash
cd metainflu/backend

# View recent logs
firebase functions:log

# Stream logs in real-time
firebase functions:log --follow
```

### Firebase Console

- Functions → Logs
- Firestore → Usage
- Storage → Usage
- Authentication → Users
- Analytics → Dashboard (if enabled)

---

## 💰 Cost Management

### Monitor Usage

1. Firebase Console → Usage and Billing
2. Check daily/monthly usage
3. Review cost breakdown by service

### Budget Alerts

- Already configured: ₹500 and ₹800
- You'll receive email alerts when thresholds are reached

### Cost Optimization Tips

1. **Phone Auth**: Consider using MSG91 for SMS (₹0.15 vs ₹0.83)
2. **Firestore**: Implement caching and pagination
3. **Storage**: Compress images before upload
4. **Functions**: Use minimum instances = 0 (default)

---

## 🔗 Useful Commands

```bash
# Backend (from metainflu/backend)
firebase emulators:start              # Start emulators
firebase deploy                       # Deploy everything
firebase deploy --only functions      # Deploy only functions
firebase functions:log                # View function logs
firebase use                          # Show current project

# Frontend (from metainflu/frontend/client-app)
npm run dev                           # Start dev server
npm run build                         # Production build
npm run preview                       # Preview production build
npx cap sync android                  # Sync with Android
npx cap open android                  # Open Android Studio
```

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Phone Auth](https://firebase.google.com/docs/auth/web/phone-auth)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Vue 3 Documentation](https://vuejs.org)

---

## ❓ Need Help?

Refer to:
- [FIREBASE_MIGRATION_STATUS.md](./FIREBASE_MIGRATION_STATUS.md) - Migration progress
- [FIREBASE_IMPLEMENTATION_GUIDE.md](./FIREBASE_IMPLEMENTATION_GUIDE.md) - Detailed guide
- [FIREBASE_PRICING_BREAKDOWN.md](./FIREBASE_PRICING_BREAKDOWN.md) - Cost analysis

---

**Happy Coding! 🎉**
