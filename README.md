# 🏠 Property Dealer App - Firebase Edition

**Modern property listing and management platform built with Vue.js, Capacitor, and Firebase**

[![Firebase](https://img.shields.io/badge/Firebase-v10.14-orange?logo=firebase)](https://firebase.google.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-v3.4-green?logo=vue.js)](https://vuejs.org)
[![Node.js](https://img.shields.io/badge/Node.js-v22-brightgreen?logo=node.js)](https://nodejs.org)
[![Capacitor](https://img.shields.io/badge/Capacitor-v7.4-blue?logo=capacitor)](https://capacitorjs.com)

---

## 📱 **NEW: Phone Authentication Live Testing Available!**

**Branch:** `phone-auth-live-testing` ✨

Test phone authentication with Firebase on the **LIVE backend** (not emulators)!

### Quick Start for Phone Auth Testing:

```bash
# Clone and checkout the live testing branch
git clone https://github.com/abh1hi/property-dealer-app-1.git
cd property-dealer-app-1
git checkout phone-auth-live-testing

# Run automated setup (Linux/Mac)
chmod +x setup-live-testing.sh
./setup-live-testing.sh

# Or for Windows
setup-live-testing.bat
```

**📚 Full Testing Guide:** [LIVE_TESTING_GUIDE.md](./LIVE_TESTING_GUIDE.md)

**📞 Test Credentials:**
- Test Phone: `+919876543210`
- Test OTP: `123456`
- Or use your own phone number for real SMS testing

---

## 🚀 Quick Start

### Prerequisites
- Node.js v22+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project: `apnaashiyanaa-app`

### Choose Your Path:

#### Option 1: Phone Auth Live Testing (Recommended)
```bash
git checkout phone-auth-live-testing
./setup-live-testing.sh  # or setup-live-testing.bat on Windows
# Follow prompts, then see LIVE_TESTING_GUIDE.md
```

#### Option 2: Full Development Setup
```bash
git checkout main
cat SETUP_INSTRUCTIONS.md
```

---

## 🎯 Project Status

### Phone Authentication: ✅ **READY FOR TESTING**

**What's Working:**
- ✅ Firebase Phone Auth with OTP
- ✅ Test phone number configuration
- ✅ Real SMS integration
- ✅ Cloud Functions for user management
- ✅ Session persistence
- ✅ reCAPTCHA protection
- ✅ Resend OTP functionality
- ✅ Error handling
- ✅ Live backend deployment

### Migration Progress: 35% Complete

| Phase | Status | Description |
|-------|--------|-------------|
| ✅ Phase 1 | **Complete** | Legacy MongoDB code removed |
| ✅ Phase 2 | **Complete** | Firebase SDK integrated |
| ✅ Phase 3 | **Complete** | Firebase project setup |
| ✅ Phase 4 | **Complete** | Phone authentication implemented |
| 🟡 Phase 5 | **In Progress** | Live testing & validation |
| 🔄 Phase 6 | Pending | Mobile app testing |
| 🔄 Phase 7 | Pending | Production deployment |

**📊 Track progress:** [FIREBASE_MIGRATION_STATUS.md](./FIREBASE_MIGRATION_STATUS.md)

---

## 📚 Documentation

### 🆕 **Start Here:**

1. **[LIVE_TESTING_GUIDE.md](./LIVE_TESTING_GUIDE.md)** ⭐  
   **Complete guide for testing phone authentication on live Firebase**

2. **[PHONE_AUTH_README.md](./PHONE_AUTH_README.md)**  
   Phone authentication setup and implementation details

### Essential Guides:

3. **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)**  
   Complete step-by-step setup guide for developers

4. **[FIREBASE_MIGRATION_STATUS.md](./FIREBASE_MIGRATION_STATUS.md)**  
   Migration progress tracking and next steps

5. **[FIREBASE_IMPLEMENTATION_GUIDE.md](./FIREBASE_IMPLEMENTATION_GUIDE.md)**  
   Detailed Firebase implementation guide

6. **[FIREBASE_PRICING_BREAKDOWN.md](./FIREBASE_PRICING_BREAKDOWN.md)**  
   Cost analysis and optimization strategies

---

## 🏛️ Architecture

### Backend - Firebase Cloud Functions

```
metainflu/backend/functions/
├── index.js              # Main Cloud Function entry
├── auth.js               # Phone auth functions ✨
├── config/
│   └── firestore.js      # Firestore configuration
├── models/
│   ├── User.js           # User Firestore model
│   └── Property.js       # Property Firestore model
├── controllers/          # Business logic
├── routes/               # API endpoints
└── middleware/           # Auth & validation
```

### Frontend - Vue.js + Capacitor

```
metainflu/frontend/client-app/
├── src/
│   ├── config/
│   │   └── firebase.js   # Firebase SDK setup (with env support) ✨
│   ├── composables/
│   │   └── usePhoneAuth.js # Phone auth composable ✨
│   ├── pages/
│   │   └── PhoneAuth.vue  # Phone auth UI ✨
│   ├── utils/
│   │   ├── phoneValidation.js # Phone validation ✨
│   │   └── authGuard.js  # Route protection ✨
│   ├── services/         # API & Firebase services
│   ├── components/       # Vue components
│   └── store/            # Pinia store
└── android/              # Capacitor Android
```

---

## ✨ Features

### ✅ Implemented

- **Authentication** 🔥
  - **Phone OTP (Firebase Phone Auth)** ⭐ **NEW - LIVE TESTING READY**
  - Aadhaar + Password
  - Dual authentication system
  - Role-based access (buyer/seller/admin)
  - Session persistence
  - reCAPTCHA protection

- **Property Management**
  - Create listings with multiple images
  - Edit and delete properties
  - Search and filter
  - Property details with map

- **User Features**
  - User profiles
  - Favorites/wishlist
  - Real-time chat (framework ready)

- **Mobile App**
  - Cross-platform (Android/iOS)
  - Native features via Capacitor
  - Camera integration
  - Location services

### 🔄 Firebase Migration

- **Backend**
  - ✅ Cloud Functions for API
  - ✅ Firestore for database
  - ✅ Firebase Auth (Phone + Aadhaar)
  - ✅ Firebase Storage
  - ✅ Security rules configured
  - ✅ Phone auth Cloud Functions deployed

- **Frontend**
  - ✅ Firebase SDK integrated
  - ✅ Environment variables support
  - ✅ Phone auth UI implemented
  - ✅ Live/Emulator switching

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Vue.js 3.4
- **Mobile:** Capacitor 7.4
- **State:** Pinia
- **Routing:** Vue Router
- **Styling:** TailwindCSS
- **Maps:** Leaflet
- **Build:** Vite

### Backend
- **Runtime:** Node.js 22
- **Platform:** Firebase Cloud Functions
- **Database:** Cloud Firestore
- **Storage:** Firebase Storage
- **Auth:** Firebase Authentication (Phone + Custom)

### DevOps
- **Hosting:** Firebase Hosting
- **CI/CD:** Firebase CLI
- **Testing:** Firebase Emulators + Live Backend
- **Monitoring:** Firebase Console

---

## 💰 Cost Estimate

### Development/Testing (Phone Auth)
- **Test Phone Numbers:** FREE (no SMS sent)
- **Real SMS Testing:** ~₹0.01-0.02 per OTP
- **Cloud Functions:** FREE tier (125K invocations/month)
- **Firestore:** FREE tier (50K reads/day)

### Production (1K-10K users)
**~₹1,296/month** (with optimizations)
- Phone Auth SMS: ₹150/month
- Firestore: ₹496/month
- Storage: ₹470/month
- Cloud Functions: ₹180/month

**See full breakdown:** [FIREBASE_PRICING_BREAKDOWN.md](./FIREBASE_PRICING_BREAKDOWN.md)

---

## 🧪 Testing Phone Authentication

### Quick Test (2 minutes):

```bash
# 1. Checkout testing branch
git checkout phone-auth-live-testing

# 2. Run setup script
./setup-live-testing.sh  # Linux/Mac
# or
setup-live-testing.bat  # Windows

# 3. Deploy functions (first time only)
cd metainflu/backend
firebase deploy --only functions

# 4. Start frontend
cd ../frontend/client-app
npm run dev

# 5. Open browser
# http://localhost:5173/auth

# 6. Test login
# Phone: 9876543210
# OTP: 123456
```

**📖 Detailed instructions:** [LIVE_TESTING_GUIDE.md](./LIVE_TESTING_GUIDE.md)

---

## 🖥️ Local Development

### With Live Firebase Backend:

```bash
# 1. Setup environment
cd metainflu/frontend/client-app
cp .env.example .env
# Edit .env: Set VITE_USE_EMULATORS=false

# 2. Install & start
npm install
npm run dev
```

### With Firebase Emulators:

```bash
# 1. Setup environment  
cp .env.example .env
# Edit .env: Set VITE_USE_EMULATORS=true

# 2. Start emulators
cd metainflu/backend
firebase emulators:start

# 3. Start frontend (new terminal)
cd metainflu/frontend/client-app
npm run dev
```

---

## 📦 Deployment

### Deploy Backend Functions:

```bash
cd metainflu/backend
firebase login
firebase use apnaashiyanaa-app
firebase deploy --only functions
```

### Deploy Frontend:

```bash
cd metainflu/frontend/client-app
npm run build
cd ../../backend
firebase deploy --only hosting
```

### Deploy Everything:

```bash
cd metainflu/backend
firebase deploy
```

---

## 📱 Mobile App

### Android

```bash
cd metainflu/frontend/client-app
npm run build
npx cap sync android
npx cap open android
```

### iOS

```bash
npm run build
npx cap sync ios
npx cap open ios
```

---

## 🔗 Important Links

- **Firebase Console:** https://console.firebase.google.com/project/apnaashiyanaa-app
- **Firebase Docs:** https://firebase.google.com/docs
- **Phone Auth Docs:** https://firebase.google.com/docs/auth/web/phone-auth
- **Vue.js Docs:** https://vuejs.org
- **Capacitor Docs:** https://capacitorjs.com/docs
- **Repository:** https://github.com/abh1hi/property-dealer-app-1

---

## 👥 Team

**Developer:** [@abh1hi](https://github.com/abh1hi)

---

## 📝 License

This project is private and proprietary.

---

## 🎯 Next Steps

### For Phone Auth Testing:
1. ✅ **Checkout testing branch:** `git checkout phone-auth-live-testing`
2. ✅ **Run setup script:** `./setup-live-testing.sh`
3. ✅ **Deploy functions:** `firebase deploy --only functions`
4. ✅ **Start testing:** See [LIVE_TESTING_GUIDE.md](./LIVE_TESTING_GUIDE.md)

### For Full Development:
1. **Configure Environment:** Copy `.env.example` to `.env`
2. **Install Dependencies:** `npm install` in frontend and backend
3. **Start Development:** Follow [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
4. **Test Features:** Authentication, properties, user profiles
5. **Deploy:** When ready, deploy to Firebase

---

**Status:** 🟢 **Phone Auth Ready for Live Testing!**  
**Testing Branch:** `phone-auth-live-testing`  
**Main Branch:** `main`  
**Last Updated:** November 14, 2025

---

**🎉 Start Testing Phone Auth Now!**

```bash
git checkout phone-auth-live-testing
./setup-live-testing.sh
```

See [LIVE_TESTING_GUIDE.md](./LIVE_TESTING_GUIDE.md) for detailed instructions.
