#!/bin/bash

# Phone Auth Live Testing Setup Script
# This script automates the setup process for live testing

set -e  # Exit on error

echo "🚀 Property Dealer App - Live Testing Setup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${GREEN}✅ Step 1: Checking Prerequisites${NC}"
echo "-----------------------------------"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 22+ from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
else
    echo -e "${GREEN}✓ Firebase CLI: $(firebase --version)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Step 2: Setting up Frontend${NC}"
echo "-------------------------------"

cd metainflu/frontend/client-app

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Verify .env configuration
echo ""
echo "Checking .env configuration..."
if grep -q "VITE_USE_EMULATORS=false" .env; then
    echo -e "${GREEN}✓ Emulators disabled (Live mode)${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: VITE_USE_EMULATORS not set to false${NC}"
    echo "   For live testing, set VITE_USE_EMULATORS=false in .env"
fi

if grep -q "VITE_FIREBASE_PROJECT_ID=apnaashiyanaa-app" .env; then
    echo -e "${GREEN}✓ Using apnaashiyanaa-app project${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: Check Firebase project ID in .env${NC}"
fi

echo ""
echo "Installing frontend dependencies..."
npm install

echo ""
echo -e "${GREEN}✅ Step 3: Setting up Backend${NC}"
echo "------------------------------"

cd ../../../metainflu/backend/functions

echo "Installing backend dependencies..."
npm install

cd ..

echo ""
echo -e "${GREEN}✅ Step 4: Firebase Login & Project Selection${NC}"
echo "----------------------------------------------"

# Check if already logged in
if firebase projects:list &> /dev/null; then
    echo -e "${GREEN}✓ Already logged in to Firebase${NC}"
else
    echo -e "${YELLOW}Please login to Firebase...${NC}"
    firebase login
fi

# Select project
echo ""
echo "Selecting Firebase project: apnaashiyanaa-app"
firebase use apnaashiyanaa-app || {
    echo -e "${RED}❌ Failed to select project${NC}"
    echo "Available projects:"
    firebase projects:list
    exit 1
}

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=================="
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo ""
echo "1. Deploy backend functions (first time only):"
echo "   ${YELLOW}cd metainflu/backend${NC}"
echo "   ${YELLOW}firebase deploy --only functions${NC}"
echo ""
echo "2. Start the frontend development server:"
echo "   ${YELLOW}cd metainflu/frontend/client-app${NC}"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Open in browser:"
echo "   ${YELLOW}http://localhost:5173/auth${NC}"
echo ""
echo "4. Test with:"
echo "   - Test phone: ${GREEN}+919876543210${NC} (OTP: ${GREEN}123456${NC})"
echo "   - Your phone: ${GREEN}+91XXXXXXXXXX${NC} (Real SMS)"
echo ""
echo -e "${GREEN}For detailed testing instructions, see: LIVE_TESTING_GUIDE.md${NC}"
echo ""
echo -e "${GREEN}🎉 Happy Testing!${NC}"
