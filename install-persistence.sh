#!/bin/bash

echo "🧠 ClearHead - Installing AsyncStorage for data persistence..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the ClearHead project root."
    exit 1
fi

# Install the dependency
echo "📦 Installing @react-native-async-storage/async-storage..."
npx expo install @react-native-async-storage/async-storage

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Run: npx expo start"
    echo "2. Test by adding some tasks"
    echo "3. Close and reopen the app to verify persistence"
    echo ""
    echo "💡 Your tasks will now save automatically between app sessions!"
else
    echo ""
    echo "❌ Installation failed. Please try running manually:"
    echo "   npx expo install @react-native-async-storage/async-storage"
fi
