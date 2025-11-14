# Production Setup Guide - Property Dealer Backend

## 🚀 Overview

This guide walks you through deploying the Property Dealer backend to Firebase Cloud Functions for production.

## 📋 Pre-Deployment Checklist

### Environment Configuration
- [ ] Copy `.env.example` to `.env` in production environment
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Generate strong JWT secrets (minimum 32 characters)
- [ ] Configure Firebase credentials
- [ ] Set appropriate CORS origins for your production domains
- [ ] Configure database connection URI (MongoDB Atlas)

### Security
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure Firestore security rules (already updated)
- [ ] Set up Cloud Functions authentication
- [ ] Configure IAM roles for service accounts
- [ ] Set up secrets in Google Cloud Secrets Manager

### Dependencies
- [ ] Run `npm install` to install all dependencies
- [ ] Review security audit: `npm audit`
- [ ] Update vulnerable packages if any

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
cd metainflu/backend
npm install
```

This will install:
- **Security**: helmet, express-rate-limit
- **Validation**: express-validator
- **Logging**: winston, morgan
- **Firebase**: firebase-admin, firebase-functions
- **Database**: mongoose, mongodb
- **Authentication**: jsonwebtoken, bcryptjs
- **Utilities**: cors, dotenv, compression, multer, sharp

### 2. Configure Environment Variables

Create `.env` file in `metainflu/backend/`:

```bash
cp .env.example .env
```

Edit `.env` and set all variables:

```env
NODE_ENV=production
PORT=5001
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_random_secret_min_32_chars
JWT_REFRESH_SECRET=your_random_secret_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FIREBASE_PROJECT_ID=apnaashiyanaa-app
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=5
OTP_RATE_LIMIT_MAX=2
LOG_LEVEL=info
```

⚠️ **Never commit `.env` to git!** Add to `.gitignore`

### 3. Verify Firestore Rules

The Firestore security rules have been updated. Deploy them:

```bash
firebase deploy --only firestore:rules
```

Verify the rules in Firebase Console:
- Users can only access their own profile
- Properties are readable by all authenticated users
- Chat messages are only accessible to participants
- Favorites are user-specific

### 4. Deploy to Firebase

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Cloud Functions
firebase deploy --only functions
```

### 5. Deploy Firestore and Storage Rules

```bash
# Deploy all Firebase resources
firebase deploy
```

## 🔒 Security Configuration

### Authentication Middleware
- ✅ JWT verification enabled
- ✅ Role-based access control active
- ✅ Token expiration: 15 minutes (access), 7 days (refresh)
- ✅ Account lockout after 5 failed attempts
- ✅ Password complexity requirements enforced

### Input Validation
- ✅ Mobile number validation (Indian format)
- ✅ Aadhaar number validation (12 digits)
- ✅ Password strength validation
- ✅ Name length validation (2-50 chars)

### Rate Limiting
- ✅ General API: 100 requests per 15 minutes
- ✅ Auth endpoints: 5 attempts per 15 minutes
- ✅ Phone auth: 2 attempts per 1 minute
- ✅ Property creation: 50 per hour
- ✅ Message sending: 10 per minute

### Database Security
- ✅ Firestore rules with proper authentication
- ✅ Storage rules with file validation
- ✅ User-specific data access

## 📊 Monitoring & Logging

### Log Files
Logs are written to `logs/` directory:
- `error.log` - Error-level logs only
- `combined.log` - All logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

### Cloud Logging
Enable Cloud Logging in Firebase Console:
1. Go to Cloud Functions
2. Click on a function
3. View logs in Cloud Logging

### Health Check

```bash
# Check API health
curl https://your-api-url/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-11-15T...",
  "uptime": 1234.56,
  "version": "1.0.0"
}
```

## 🧪 Testing Before Deployment

### API Testing

```bash
# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "mobile": "9876543210", "phoneAuthToken": "token"}'

# Login with phone
curl -X POST http://localhost:5001/api/auth/login/phone \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9876543210", "phoneAuthToken": "token"}'

# Refresh token
curl -X POST http://localhost:5001/api/auth/refresh \
  -H "Cookie: refreshToken=your_refresh_token"
```

### Rate Limiting Test

```bash
# Make 6 requests quickly to auth endpoint (should fail on 6th)
for i in {1..6}; do
  echo "Request $i"
  curl -X POST http://localhost:5001/api/auth/login/phone \
    -H "Content-Type: application/json" \
    -d '{"mobile": "9876543210", "phoneAuthToken": "token"}'
done
```

Expected: Request 6 returns 429 (Too Many Requests)

## 🚨 Troubleshooting

### Firebase Deployment Issues

```bash
# Clear Firebase cache
firebase logout
firebase login

# Deploy with verbose output
firebase deploy --debug
```

### Database Connection Issues

```bash
# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('Connected'))"
```

### JWT Token Issues

```bash
# Decode JWT token
node -e "console.log(require('jsonwebtoken').decode('your_token'))"
```

### Rate Limiting Issues

- Check IP address in headers
- Verify rate limiter configuration in `.env`
- Review logs for rate limit events

## 📈 Performance Optimization

### Database
- Indexes are configured on key fields
- Connection pooling: maxPoolSize=50
- Enable query caching in future versions

### Caching
- Implement Redis for response caching
- Cache property listings
- Cache category data

### Compression
- gzip compression enabled
- Reduces response size by 70%+

## 🔄 Deployment Process

### Development → Production

1. **Development**
   - Local testing with `.env.local`
   - Test with Firebase emulator

2. **Staging**
   - Deploy to staging Firebase project
   - Test with production data
   - Performance testing

3. **Production**
   - Code review and approval
   - Deploy to production Firebase project
   - Monitor logs and metrics
   - Prepare rollback plan

### Rollback Plan

If issues occur in production:

```bash
# View deployment history
firebase functions:list

# Deploy previous version (git revert)
git revert <commit-hash>
firebase deploy --only functions
```

## 📞 Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Node.js Security**: https://nodejs.org/en/docs/guides/security/
- **Express.js Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

## ✅ Post-Deployment

- [ ] Verify all endpoints working
- [ ] Check logs for errors
- [ ] Monitor CPU and memory usage
- [ ] Verify database backups
- [ ] Test email notifications (when implemented)
- [ ] Monitor API response times
- [ ] Check security headers
- [ ] Verify CORS configuration

## 🎯 Next Steps

1. Set up monitoring alerts
2. Configure automated backups
3. Implement API rate limiting dashboards
4. Set up CI/CD pipeline with GitHub Actions
5. Implement automated security scanning
6. Add comprehensive test suite

---

**Last Updated:** November 15, 2025  
**Version:** 1.0.0  
**Status:** Production Ready