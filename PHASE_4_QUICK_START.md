# 🚀 Phase 4: Local Testing - Quick Start Guide

## ✅ Phase 3 Complete!

**Firebase Project Created:**
- Project Name: `propoerty-deal-app`
- Project ID: `test1-50da1`
- Project Number: `317809189734`
- Region: `asia-south1` (Mumbai, India)

**Configured Services:**
- ✅ Web App: `property-app`
- ✅ Android App: `ashianaapp` (com.apnaaashiana.app)
- ✅ Firebase Hosting: `test1-50da1`
- ✅ Firebase Configuration Added

---

## 📋 What's Next: Phase 4 - Local Testing

Now we need to:
1. Enable Firebase services (Auth, Firestore, Storage)
2. Install dependencies
3. Start Firebase emulators
4. Test the application locally

---

## Step 1: Enable Firebase Services

### 1.1 Enable Authentication (Phone)

```
1. Go to Firebase Console: https://console.firebase.google.com/project/test1-50da1
2. Click "Authentication" in left menu
3. Click "Get Started"
4. Click "Sign-in method" tab
5. Enable "Phone" provider
6. Click "Save"
```

**Optional: Add Test Phone Numbers (for development)**
```
Authentication → Sign-in method → Phone → Phone numbers for testing

Example:
  +91 1234567890 → OTP: 123456
```

### 1.2 Enable Firestore Database

```
1. Go to Firebase Console
2. Click "Firestore Database" in left menu
3. Click "Create database"
4. Select "Start in production mode"
5. Choose location: "asia-south1 (Mumbai)"
6. Click "Enable"
```

### 1.3 Enable Firebase Storage

```
1. Go to Firebase Console
2. Click "Storage" in left menu
3. Click "Get Started"
4. Select "Start in production mode"
5. Location: "asia-south1 (Mumbai)"
6. Click "Done"
```

### 1.4 Upgrade to Blaze Plan (Required for Cloud Functions)

⚠️ **Important: Cloud Functions require Blaze (Pay-as-you-go) plan**

```
1. Go to Firebase Console
2. Click gear icon → "Usage and billing"
3. Click "Modify plan"
4. Select "Blaze (Pay as you go)"
5. Add payment method
6. Set budget alerts:
   - Alert at ₹500 (50%)
   - Alert at ₹800 (80%)
7. Click "Purchase"
```

**Don't worry about costs:**
- Development: ~₹623/month (mostly within free tier)
- Free tier includes: 50K Firestore reads/day, 20K writes/day, 1GB storage
- See [FIREBASE_PRICING_BREAKDOWN.md](./FIREBASE_PRICING_BREAKDOWN.md) for details

---

## Step 2: Local Setup

### 2.1 Clone and Checkout Branch (if not done)

```bash
git clone https://github.com/abh1hi/property-dealer-app-1.git
cd property-dealer-app-1
git checkout firebase-migration-complete
git pull origin firebase-migration-complete
```

### 2.2 Install Firebase CLI (if not done)

```bash
# Install globally
npm install -g firebase-tools

# Verify installation
firebase --version

# Login to Firebase
firebase login
```

### 2.3 Install Backend Dependencies

```bash
cd metainflu/backend/functions
npm install

# This will install:
# - firebase-functions
# - firebase-admin
# - express
# - and other dependencies
```

### 2.4 Install Frontend Dependencies

```bash
cd ../../frontend/client-app
npm install

# This will install:
# - firebase SDK
# - vue, vite, capacitor
# - and other dependencies
```

### 2.5 Create Frontend .env File

```bash
# Copy the example file
cp .env.example .env

# The file already has your Firebase config!
# No need to edit unless you want to change API URLs
```

---

## Step 3: Initialize Firebase Emulators

```bash
cd metainflu/backend

# Initialize emulators (first time only)
firebase init emulators

# When prompted, select:
# ✓ Authentication Emulator
# ✓ Functions Emulator
# ✓ Firestore Emulator
# ✓ Storage Emulator
# ✓ Hosting Emulator (optional)

# Accept default ports:
# - Auth: 9099
# - Functions: 5001
# - Firestore: 8080
# - Storage: 9199
# - UI: 4000
```

---

## Step 4: Start Development!

### 4.1 Terminal 1: Start Firebase Emulators

```bash
cd metainflu/backend
firebase emulators:start

# Wait for this message:
# ✓ All emulators ready!
```

**Emulator URLs:**
- 📡 Emulator UI: http://localhost:4000
- 🔐 Auth: http://localhost:9099
- 💾 Firestore: http://localhost:8080
- 💾 Storage: http://localhost:9199
- ⚡ Functions: http://localhost:5001

### 4.2 Terminal 2: Start Frontend Dev Server

```bash
cd metainflu/frontend/client-app
npm run dev

# Frontend will start at: http://localhost:5173
```

### 4.3 Open Application

1. **Frontend**: http://localhost:5173
2. **Emulator UI**: http://localhost:4000 (monitor all services)

---

## Step 5: Test Features

### 5.1 Test Authentication

**Phone OTP Registration:**
1. Open http://localhost:5173
2. Click "Sign Up" or "Register"
3. Enter phone number: `+91 1234567890` (if using test number)
4. Enter OTP: `123456` (if using test number)
5. Check Emulator UI → Authentication to see new user

**Aadhaar + Password Registration:**
1. Try registering with Aadhaar number
2. Set password
3. Login with same credentials

### 5.2 Test Property Management

**Create Property:**
1. Login as seller
2. Navigate to "Add Property"
3. Fill property details
4. Upload images (stored in Storage emulator)
5. Submit
6. Check Emulator UI → Firestore → `properties` collection

**View Properties:**
1. Navigate to property list
2. Verify properties load
3. Click on property to view details
4. Verify images display correctly

### 5.3 Monitor Emulator UI

Open http://localhost:4000 to:
- View Firestore documents
- See authenticated users
- Check uploaded files in Storage
- Monitor function logs
- Debug API calls

---

## 🐛 Troubleshooting

### Issue: Emulators won't start

```bash
# Kill any existing Firebase processes
pkill -f firebase

# Clear emulator cache
rm -rf ~/.config/firebase/emulators

# Try again
firebase emulators:start
```

### Issue: Port already in use

```bash
# Find and kill process on port 5001 (or other port)
lsof -ti:5001 | xargs kill -9

# Or change port in firebase.json
```

### Issue: Frontend can't connect to emulators

1. Check if emulators are running
2. Verify `.env` file has `VITE_USE_EMULATORS=true`
3. Check console for connection errors
4. Verify `firebase.js` has emulator connection code

### Issue: CORS errors

- Already configured in Cloud Functions
- If persists, check browser console for specific error
- Verify API URL in `.env` matches emulator URL

### Issue: Dependencies error

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## ✅ Testing Checklist

### Authentication ☐
- [ ] Phone OTP registration works
- [ ] Phone OTP login works
- [ ] Aadhaar + password registration works
- [ ] Password login works
- [ ] User data saved in Firestore
- [ ] Token generation works

### Property Management ☐
- [ ] Create property with details
- [ ] Upload multiple images
- [ ] Property saved in Firestore
- [ ] Images saved in Storage
- [ ] View property list
- [ ] View single property details
- [ ] Edit property
- [ ] Delete property

### User Profile ☐
- [ ] View user profile
- [ ] Update profile details
- [ ] Change avatar
- [ ] View user's properties

### Emulators ☐
- [ ] All emulators start successfully
- [ ] Emulator UI accessible
- [ ] Can view Firestore data
- [ ] Can view Storage files
- [ ] Function logs visible

---

## 📊 Progress Update

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Cleanup | ✅ Complete | 100% |
| 2. Frontend Setup | ✅ Complete | 100% |
| 3. Firebase Project | ✅ Complete | 100% |
| 4. Local Testing | 🟡 In Progress | 0% |
| 5. Testing | 🔄 Pending | 0% |
| 6. Mobile App | 🔄 Pending | 0% |
| 7. Deployment | 🔄 Pending | 0% |

**Overall: 42% Complete (3/7 phases)**

---

## 🚀 After Testing Works

Once local testing is successful:

1. **Phase 5**: Comprehensive testing of all features
2. **Phase 6**: Build and test mobile app
3. **Phase 7**: Deploy to production

See [FIREBASE_MIGRATION_STATUS.md](./FIREBASE_MIGRATION_STATUS.md) for detailed next steps.

---

## 🔗 Useful Commands

```bash
# Start emulators
cd metainflu/backend
firebase emulators:start

# Start frontend
cd metainflu/frontend/client-app
npm run dev

# View function logs
firebase functions:log

# Clear emulator data
firebase emulators:start --import=./data --export-on-exit
```

---

## 📚 Resources

- **Firebase Console**: https://console.firebase.google.com/project/test1-50da1
- **Setup Guide**: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Pricing Info**: [FIREBASE_PRICING_BREAKDOWN.md](./FIREBASE_PRICING_BREAKDOWN.md)
- **Firebase Docs**: https://firebase.google.com/docs

---

**Ready to start testing! 🎉**

**Last Updated:** November 10, 2025, 8:56 PM IST
