#!/bin/bash

# ClearHead App Store Publishing Script
# This script helps automate the publishing process

set -e

echo "🚀 ClearHead App Store Publishing Helper"
echo "======================================="

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
else
    echo "✅ EAS CLI is already installed"
fi

# Check if user is logged in
echo "🔐 Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo "Please log in to EAS:"
    eas login
fi

echo "✅ EAS login confirmed"

# Configure project if needed
if [ ! -f "eas.json" ]; then
    echo "⚙️ Configuring EAS build..."
    eas build:configure
fi

echo ""
echo "🎯 Next steps:"
echo "1. Make sure you have an Apple Developer account ($99/year)"
echo "2. Create app icons and screenshots"
echo "3. Set up your app in App Store Connect"
echo "4. Update eas.json with your App Store Connect details"
echo ""
echo "When ready to build:"
echo "  eas build --platform ios --profile production"
echo ""
echo "When ready to submit:"
echo "  eas submit --platform ios --profile production"
echo ""
echo "📋 See APP_STORE_GUIDE.md for detailed instructions"