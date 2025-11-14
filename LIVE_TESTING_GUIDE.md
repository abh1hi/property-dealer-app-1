# 📱 Phone Authentication - Live Testing Guide

## 🚀 Quick Start for Live Testing

This guide will help you test the phone authentication feature on the **LIVE Firebase backend** (not emulators).

### Prerequisites
- ✅ Firebase project: `apnaashiyanaa-app` 
- ✅ Phone Authentication enabled in Firebase Console
- ✅ Test phone number configured: `+919876543210` with OTP: `123456`
- ✅ Node.js 22+ installed
- ✅ Firebase CLI installed: `npm install -g firebase-tools`

---

## 📋 Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/abh1hi/property-dealer-app-1.git
cd property-dealer-app-1

# Checkout the live testing branch
git checkout phone-auth-live-testing

# Navigate to frontend
cd metainflu/frontend/client-app
```

---

## 🔧 Step 2: Configure Environment for Live Testing

### Create .env file from template:

```bash
cp .env.example .env
```

### Verify .env contents:

```env
# Should look like this for LIVE TESTING:
VITE_FIREBASE_API_KEY=AIzaSyAS8phqV1SjtjsF7jZmxeZBg8cUbKdQVZA
VITE_FIREBASE_AUTH_DOMAIN=apnaashiyanaa-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=apnaashiyanaa-app
VITE_FIREBASE_STORAGE_BUCKET=apnaashiyanaa-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=920496133974
VITE_FIREBASE_APP_ID=1:920496133974:web:31ed935fab1f72d6d5a8f7
VITE_FIREBASE_MEASUREMENT_ID=G-XEB52QYP1F

# IMPORTANT: Set these for live testing
VITE_USE_EMULATORS=false
VITE_ENV=production
```

---

## 📦 Step 3: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Firebase packages (if not already installed)
npm install firebase
```

---

## 🎯 Step 4: Deploy Backend Functions (First Time Only)

```bash
# Navigate to backend
cd ../../../metainflu/backend

# Install backend dependencies
cd functions
npm install
cd ..

# Login to Firebase (if not already logged in)
firebase login

# Select the correct project
firebase use apnaashiyanaa-app

# Deploy Cloud Functions
firebase deploy --only functions

# Note: This may take 2-3 minutes
```

**Expected Output:**
```
✔ functions[getUserProfile(us-central1)] Successful create operation.
✔ functions[updateUserProfile(us-central1)] Successful create operation.
✔ functions[getUserByPhone(us-central1)] Successful create operation.
...
```

---

## 🖥️ Step 5: Start Frontend Development Server

```bash
# Go back to frontend directory
cd ../../frontend/client-app

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## 🧪 Step 6: Test Phone Authentication

### Open the application:
```
http://localhost:5173/auth
```

### Testing Scenarios:

#### **Test 1: Using Test Phone Number (Recommended First)**

1. **Enter phone number:** `9876543210`
2. **Click "Send OTP"**
3. **Complete reCAPTCHA** (invisible or visible depending on usage)
4. **Enter test OTP:** `123456`
5. **Click "Verify OTP"**
6. ✅ **Should successfully authenticate**

**Why use test number first?**
- No SMS charges
- Instant testing
- No rate limits
- Consistent OTP code

---

#### **Test 2: Using Real Phone Number**

⚠️ **Important Notes:**
- This will send a REAL SMS (costs apply)
- Use only YOUR OWN phone number
- SMS costs approximately ₹0.01-0.02 per message

**Steps:**
1. **Enter your phone number:** `98XXXXXXXX` (10 digits, no +91)
2. **Click "Send OTP"**
3. **Complete reCAPTCHA**
4. **Check your phone for SMS** (should arrive in 5-30 seconds)
5. **Enter the 6-digit OTP** from SMS
6. **Click "Verify OTP"**
7. ✅ **Should successfully authenticate**

---

#### **Test 3: OTP Expiration**

1. Send OTP to any number
2. **Wait 5+ minutes** (OTP expires after 5 minutes)
3. Try to verify with the old OTP
4. ❌ **Should show:** "OTP expired. Request a new one."

---

#### **Test 4: Invalid OTP**

1. Send OTP
2. Enter wrong OTP: `000000`
3. Click "Verify OTP"
4. ❌ **Should show:** "Invalid OTP code."

---

#### **Test 5: Resend OTP**

1. Send OTP
2. Wait for 60-second timer to complete
3. Click "Resend OTP"
4. ✅ **Should send new OTP**
5. Verify with the new OTP

---

#### **Test 6: Session Persistence**

1. Log in successfully
2. **Refresh the page** (F5 or Ctrl+R)
3. ✅ **Should remain logged in**
4. Check browser console: Type `firebase.auth().currentUser`
5. Should display user object with phone number

---

#### **Test 7: Sign Out**

1. After logging in, open browser console
2. Import and call: 
```javascript
import { usePhoneAuth } from './composables/usePhoneAuth';
const { signOut } = usePhoneAuth();
await signOut();
```
3. ✅ **Should log out and clear user data**

---

## 🔍 Debugging & Troubleshooting

### Check Console Logs

Open browser DevTools (F12) and check the console. You should see:

```
🔥 Using LIVE Firebase backend
Firebase Config: {
  projectId: "apnaashiyanaa-app",
  authDomain: "apnaashiyanaa-app.firebaseapp.com",
  useEmulators: false
}
```

### Common Issues:

#### Issue 1: "reCAPTCHA not showing"
**Solutions:**
- Clear browser cache
- Try incognito/private mode
- Check if `recaptcha-container` div exists in DOM
- Verify Firebase Auth domain is whitelisted in Firebase Console

#### Issue 2: "SMS not received"
**Solutions:**
- Wait up to 60 seconds (SMS can be delayed)
- Check phone number format (should be +91XXXXXXXXXX)
- Verify Firebase project has billing enabled (Blaze plan)
- Check Firebase Console > Authentication > Usage for errors
- Try with test phone number first

#### Issue 3: "auth/too-many-requests"
**Solutions:**
- Wait 1-2 hours before retrying
- Use test phone numbers for repeated testing
- This is Firebase's rate limiting protection

#### Issue 4: "auth/invalid-phone-number"
**Solutions:**
- Ensure format is correct: +919876543210
- Remove spaces and special characters
- Verify country code is included

#### Issue 5: "Functions not deployed"
**Solutions:**
```bash
# Check deployed functions
firebase functions:list

# Redeploy if needed
firebase deploy --only functions

# Check function logs
firebase functions:log
```

---

## 📊 Monitor in Firebase Console

### 1. Authentication Activity
```
https://console.firebase.google.com/project/apnaashiyanaa-app/authentication/users
```
View:
- New user sign-ups
- Phone numbers
- Last sign-in times

### 2. Cloud Functions Logs
```
https://console.firebase.google.com/project/apnaashiyanaa-app/functions
```
Monitor:
- Function executions
- Errors and warnings
- Performance metrics

### 3. Firestore Database
```
https://console.firebase.google.com/project/apnaashiyanaa-app/firestore
```
Check:
- User profiles created
- Data structure
- Security rules

---

## 🎨 UI/UX Features Implemented

- ✅ **Material Design** gradient background
- ✅ **Phone input validation** (Indian numbers only)
- ✅ **Auto +91 prefix** addition
- ✅ **OTP countdown timer** (60 seconds)
- ✅ **Resend OTP** functionality
- ✅ **Loading states** with spinners
- ✅ **Error handling** with user-friendly messages
- ✅ **Responsive design** (mobile & desktop)
- ✅ **Invisible reCAPTCHA** (less intrusive)
- ✅ **Session persistence** (stays logged in after refresh)

---

## 📱 Mobile App Testing (Optional)

### Build Android APK:

```bash
# Build the frontend
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

# Build APK from Android Studio
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### Test on Physical Device:
1. Enable USB debugging on your Android phone
2. Connect via USB
3. Run from Android Studio
4. Test phone authentication with your actual phone number

---

## 🔒 Security Checklist

- ✅ **Environment variables** used for sensitive config
- ✅ **.env file** is gitignored
- ✅ **Firebase Security Rules** configured
- ✅ **Token verification** on backend
- ✅ **Rate limiting** via Firebase
- ✅ **reCAPTCHA** protection against bots
- ⚠️ **Remove test phone numbers** before full production deploy

---

## 💰 Cost Estimation (Live Testing)

### During Development/Testing:
- **Phone Auth (SMS):** ₹0.01-0.02 per OTP
- **Cloud Functions:** Free tier (125K invocations/month)
- **Firestore:** Free tier (50K reads/day)
- **Hosting:** Free tier

### Expected Testing Cost:
- **10 SMS tests:** ~₹0.20
- **50 SMS tests:** ~₹1.00
- **100 SMS tests:** ~₹2.00

**Tip:** Use test phone numbers for most testing to minimize costs!

---

## 📝 API Testing (Optional)

### Test Cloud Functions:

```javascript
// Open browser console after login

// Get current user profile
const getUserProfile = firebase.functions().httpsCallable('getUserProfile');
const result = await getUserProfile();
console.log('Profile:', result.data);

// Update user profile
const updateUserProfile = firebase.functions().httpsCallable('updateUserProfile');
const updated = await updateUserProfile({
  name: 'Test User',
  email: 'test@example.com'
});
console.log('Updated:', updated.data);
```

---

## 🚀 Production Deployment (Next Steps)

Once testing is complete:

### 1. Remove Test Phone Numbers
```
Firebase Console > Authentication > Sign-in method > Phone > Test phone numbers
Delete: +919876543210
```

### 2. Enable App Check (Recommended)
```bash
firebase deploy --only appcheck
```

### 3. Deploy to Firebase Hosting
```bash
# Build production bundle
npm run build

# Deploy hosting + functions
cd ../../../metainflu/backend
firebase deploy
```

### 4. Configure Custom Domain (Optional)
```
Firebase Console > Hosting > Add custom domain
```

---

## 📞 Support & Resources

- **Firebase Console:** https://console.firebase.google.com/project/apnaashiyanaa-app
- **Firebase Phone Auth Docs:** https://firebase.google.com/docs/auth/web/phone-auth
- **Firebase Functions Docs:** https://firebase.google.com/docs/functions
- **Repository Issues:** https://github.com/abh1hi/property-dealer-app-1/issues

---

## ✅ Testing Checklist

- [ ] Environment variables configured (.env file created)
- [ ] Backend functions deployed successfully
- [ ] Frontend dev server running
- [ ] Test phone authentication works (test number)
- [ ] Real phone authentication works (your number)
- [ ] OTP expiration handled correctly
- [ ] Invalid OTP shows error
- [ ] Resend OTP functionality works
- [ ] Session persists after page refresh
- [ ] Sign out functionality works
- [ ] User profile created in Firestore
- [ ] Console logs show "LIVE Firebase backend"
- [ ] No errors in browser console
- [ ] No errors in Firebase function logs

---

## 🎉 Success Indicators

You've successfully set up live testing when:

1. ✅ Console shows: **"🔥 Using LIVE Firebase backend"**
2. ✅ Test phone login works with OTP `123456`
3. ✅ Real phone receives SMS with OTP
4. ✅ User appears in Firebase Console > Authentication
5. ✅ User profile created in Firestore > users collection
6. ✅ No errors in browser console or Firebase logs
7. ✅ Session persists across page refreshes

---

**Last Updated:** November 14, 2025  
**Branch:** `phone-auth-live-testing`  
**Status:** ✅ Ready for Live Testing  
**Firebase Project:** `apnaashiyanaa-app`  
**Region:** us-central1

---

**Happy Testing! 🎉**

For issues or questions, check the Troubleshooting section above or create an issue on GitHub.
