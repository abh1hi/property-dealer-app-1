# Firebase Phone Authentication - Setup & Testing Guide

## 📱 Overview
This project implements Firebase Phone Authentication with OTP (One-Time Password) for the Property Dealer App. Users can sign up and log in using their Indian phone numbers (+91).

## �� Files Created

### Frontend Files
1. **`metainflu/frontend/client-app/src/composables/usePhoneAuth.js`**
   - Vue 3 composable for phone authentication
   - Handles OTP sending and verification
   - Manages auth state

2. **`metainflu/frontend/client-app/src/pages/PhoneAuth.vue`**
   - Login/Signup UI component
   - Phone number input with validation
   - OTP verification interface
   - Beautiful gradient design

3. **`metainflu/frontend/client-app/src/utils/phoneValidation.js`**
   - Indian phone number validation (10 digits, starts with 6-9)
   - Phone number formatting (+91 prefix)
   - Phone number masking for display

4. **`metainflu/frontend/client-app/src/utils/authGuard.js`**
   - Authentication state helpers
   - Route protection middleware
   - User data management

5. **`metainflu/frontend/client-app/src/router/index.js`**
   - Updated with auth routes
   - `/auth` - Main login/signup page
   - `/login` & `/signup` - Redirects to /auth

### Backend Files
1. **`metainflu/backend/functions/auth.js`**
   - Firebase Cloud Functions for authentication
   - User profile management
   - Token verification
   - Account deletion

2. **`metainflu/backend/functions/index.js`**
   - Updated to export auth functions
   - Main entry point for Cloud Functions

---

## 🚀 Setup Instructions

### 1. Firebase Console Configuration

✅ **Already Completed:**
- Firebase project: `apnaashiyanaa-app`
- Phone Authentication enabled
- Test phone numbers configured
- Firestore Database created
- Storage enabled

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd metainflu/frontend/client-app

# Install dependencies (if not already installed)
npm install

# Install Firebase packages
npm install firebase

# Start development server
npm run dev
```

### 3. Backend Setup

```bash
# Navigate to backend functions directory
cd metainflu/backend/functions

# Install dependencies
npm install

# Install Firebase packages (if not already installed)
npm install firebase-admin firebase-functions

# Deploy Cloud Functions to Firebase
firebase deploy --only functions
```

---

## 🧪 Testing Instructions

### Manual Testing (Development)

#### Test 1: Access Authentication Page
1. Start the frontend development server
2. Navigate to: `http://localhost:3000/auth`
3. Verify the phone authentication UI loads correctly

#### Test 2: Phone Number Validation
1. Try entering invalid phone numbers:
   - Less than 10 digits
   - Starting with 0-5
   - Non-numeric characters
2. Verify error messages appear
3. Enter valid number: `9876543210`
4. Verify "+91" prefix is added automatically

#### Test 3: Send OTP (Test Mode)
**Using Test Phone Number:**
1. Enter test number: `9876543210` (configured in Firebase)
2. Click "Send OTP"
3. Verify reCAPTCHA appears
4. Complete reCAPTCHA
5. Use test OTP: `123456` (configured in Firebase Console)
6. Click "Verify OTP"
7. Should successfully authenticate

#### Test 4: Send OTP (Real Phone)
**⚠️ Only test with your own phone number:**
1. Enter your real Indian phone number
2. Click "Send OTP"
3. Complete reCAPTCHA
4. Check your phone for SMS with OTP
5. Enter the 6-digit OTP received
6. Click "Verify OTP"
7. Verify successful authentication

#### Test 5: Resend OTP
1. After sending OTP, wait for 60-second timer
2. Click "Resend OTP" after timer expires
3. Verify new OTP is sent
4. Verify timer resets to 60 seconds

#### Test 6: Auth State Persistence
1. Successfully log in with phone
2. Refresh the page
3. Verify user remains logged in
4. Check browser console: `firebase.auth().currentUser`
5. Should show user object with phone number

#### Test 7: Protected Routes
1. While logged out, try accessing protected route
2. Should redirect to `/auth`
3. Log in successfully
4. Should redirect to intended protected route

#### Test 8: Sign Out
1. Log in successfully
2. Call sign out function: `signOut()`
3. Verify user is logged out
4. Verify redirect to login page

### Backend Cloud Functions Testing

#### Test 9: User Profile Creation
```javascript
// In browser console after login
const functions = firebase.functions();
const getUserProfile = functions.httpsCallable('getUserProfile');

getUserProfile()
  .then(result => console.log('Profile:', result.data))
  .catch(error => console.error('Error:', error));
```

#### Test 10: Update User Profile
```javascript
const updateUserProfile = functions.httpsCallable('updateUserProfile');

updateUserProfile({
  name: 'Test User',
  email: 'test@example.com'
})
  .then(result => console.log('Updated:', result.data))
  .catch(error => console.error('Error:', error));
```

---

## 📝 Environment Configuration

### Firebase Config (Already in `firebase.js`)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDdJ1M3yVXJ3FslxsI2CjLUvg7uwhBvMa4",
  authDomain: "apnaashiyanaa-app.firebaseapp.com",
  projectId: "apnaashiyanaa-app",
  storageBucket: "apnaashiyanaa-app.firebasestorage.app",
  messagingSenderId: "568844683903",
  appId: "1:568844683903:web:7eadc69db2c9c4f26cd34c"
};
```

### Test Phone Numbers (Configured in Firebase Console)
- Phone: `+919876543210`
- Test OTP: `123456`

---

## 🐛 Troubleshooting

### Issue 1: reCAPTCHA not showing
**Solution:**
- Check if `recaptcha-container` div exists in DOM
- Verify Firebase Auth domain is whitelisted
- Clear browser cache
- Try in incognito mode

### Issue 2: SMS not received
**Solution:**
- Verify phone number format is correct (+91XXXXXXXXXX)
- Check Firebase Console > Authentication > Sign-in method > Phone
- Ensure billing is enabled (Firebase requires Blaze plan for SMS)
- Use test phone numbers for development

### Issue 3: OTP verification fails
**Solution:**
- Verify OTP is entered correctly (6 digits)
- Check if OTP has expired (valid for 5 minutes)
- Try requesting new OTP
- Check browser console for error messages

### Issue 4: "auth/too-many-requests"
**Solution:**
- Wait 1-2 hours before retrying
- Use test phone numbers for development
- Implement rate limiting in production

### Issue 5: "auth/invalid-phone-number"
**Solution:**
- Ensure phone number includes country code (+91)
- Remove spaces and special characters
- Use format: +919876543210

---

## 🔒 Security Best Practices

1. **Never commit Firebase config to public repos**
   - Use environment variables
   - Add to `.gitignore`

2. **Implement rate limiting**
   - Limit OTP requests per phone number
   - Use Firebase App Check

3. **Validate on backend**
   - Always verify tokens on server side
   - Don't trust client-side validation alone

4. **Use Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. **Monitor authentication events**
   - Set up Firebase Analytics
   - Monitor failed login attempts

---

## 📢 Production Deployment Checklist

- [ ] Remove test phone numbers from Firebase Console
- [ ] Enable Firebase App Check
- [ ] Set up proper Firestore security rules
- [ ] Configure Firebase hosting or your production domain
- [ ] Add domain to Firebase authorized domains
- [ ] Set up monitoring and logging
- [ ] Enable billing (Blaze plan) for SMS
- [ ] Test on multiple devices and browsers
- [ ] Implement error tracking (Sentry, LogRocket, etc.)
- [ ] Set up backup authentication methods
- [ ] Configure session timeout
- [ ] Add terms of service and privacy policy

---

## 📊 Usage Analytics

### Track Authentication Events
```javascript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

// On OTP sent
logEvent(analytics, 'otp_sent', {
  phone_prefix: '+91'
});

// On successful login
logEvent(analytics, 'login', {
  method: 'phone'
});
```

---

## 📞 API Reference

### Frontend Composable: `usePhoneAuth()`

```javascript
const {
  user,              // Current user object
  loading,           // Loading state
  error,             // Error message
  isOtpSent,         // OTP sent status
  initRecaptcha,     // Initialize reCAPTCHA
  sendOTP,           // Send OTP to phone
  verifyOTP,         // Verify OTP code
  signOut            // Sign out user
} = usePhoneAuth();
```

### Backend Cloud Functions

1. **`getUserProfile()`** - Get or create user profile
2. **`updateUserProfile(data)`** - Update user profile
3. **`getUserByPhone(phoneNumber)`** - Get user by phone
4. **`createCustomToken()`** - Create custom auth token
5. **`deleteUserAccount()`** - Delete user account

---

## �� Support

For issues or questions:
1. Check Firebase Console logs
2. Review browser console errors
3. Check Cloud Functions logs: `firebase functions:log`
4. Review this documentation

---

## 📝 License

This implementation is part of the Property Dealer App project.

---

**Last Updated:** 2024-11-14
**Firebase Project:** apnaashiyanaa-app
**Region:** asia-south1 (Mumbai)
