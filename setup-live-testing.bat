@echo off
REM Phone Auth Live Testing Setup Script for Windows
REM This script automates the setup process for live testing

echo.
echo 🚀 Property Dealer App - Live Testing Setup
echo =============================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo ✅ Step 1: Checking Prerequisites
echo -----------------------------------
echo.

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js 22+ from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo ✓ Node.js: %NODE_VERSION%

REM Check npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
echo ✓ npm: %NPM_VERSION%

REM Check Firebase CLI
where firebase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Firebase CLI not found. Installing...
    call npm install -g firebase-tools
) else (
    for /f "tokens=*" %%a in ('firebase --version') do set FIREBASE_VERSION=%%a
    echo ✓ Firebase CLI: %FIREBASE_VERSION%
)

echo.
echo ✅ Step 2: Setting up Frontend
echo -------------------------------
echo.

cd metainflu\frontend\client-app

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env
    echo ✓ Created .env file
) else (
    echo ✓ .env file already exists
)

REM Verify .env configuration
echo.
echo Checking .env configuration...
findstr /C:"VITE_USE_EMULATORS=false" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Emulators disabled ^(Live mode^)
) else (
    echo ⚠️  Warning: VITE_USE_EMULATORS not set to false
    echo    For live testing, set VITE_USE_EMULATORS=false in .env
)

findstr /C:"VITE_FIREBASE_PROJECT_ID=apnaashiyanaa-app" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Using apnaashiyanaa-app project
) else (
    echo ⚠️  Warning: Check Firebase project ID in .env
)

echo.
echo Installing frontend dependencies...
call npm install

echo.
echo ✅ Step 3: Setting up Backend
echo ------------------------------
echo.

cd ..\..\..\metainflu\backend\functions

echo Installing backend dependencies...
call npm install

cd ..

echo.
echo ✅ Step 4: Firebase Login ^& Project Selection
echo ----------------------------------------------
echo.

REM Check if already logged in
firebase projects:list >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Already logged in to Firebase
) else (
    echo Please login to Firebase...
    call firebase login
)

REM Select project
echo.
echo Selecting Firebase project: apnaashiyanaa-app
call firebase use apnaashiyanaa-app
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to select project
    echo Available projects:
    firebase projects:list
    pause
    exit /b 1
)

echo.
echo ✅ Setup Complete!
echo ==================
echo.
echo Next steps:
echo.
echo 1. Deploy backend functions ^(first time only^):
echo    cd metainflu\backend
echo    firebase deploy --only functions
echo.
echo 2. Start the frontend development server:
echo    cd metainflu\frontend\client-app
echo    npm run dev
echo.
echo 3. Open in browser:
echo    http://localhost:5173/auth
echo.
echo 4. Test with:
echo    - Test phone: +919876543210 ^(OTP: 123456^)
echo    - Your phone: +91XXXXXXXXXX ^(Real SMS^)
echo.
echo For detailed testing instructions, see: LIVE_TESTING_GUIDE.md
echo.
echo 🎉 Happy Testing!
echo.
pause
