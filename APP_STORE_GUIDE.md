# ClearHead App Store Publishing Guide

## Prerequisites & Requirements

### 1. Apple Developer Account
- **Cost**: $99/year
- **Sign up**: https://developer.apple.com/programs/
- **Time**: 1-2 days for approval
- **Required**: Valid Apple ID, payment method, legal entity info

### 2. Development Environment
- **macOS**: Required for iOS app submission
- **Xcode**: Latest version from Mac App Store
- **Expo CLI**: Already installed ✅

## Step-by-Step Publishing Process

### Phase 1: App Preparation

#### 1.1 Configure App Metadata
First, let's check and update your `app.json` configuration:

```bash
# Check current app.json
cat app.json
```

Required updates for App Store:
- App name and slug
- Version number
- Bundle identifier
- Privacy policy URL
- App description
- Keywords for App Store search

#### 1.2 Create App Icons
**Required sizes** (all square, no transparency):
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 120x120 (iPhone)
- 87x87 (iPhone)
- 58x58 (iPhone)
- 76x76 (iPad)
- 152x152 (iPad)
- 167x167 (iPad Pro)

**Design guidelines:**
- Simple, recognizable design
- Avoid text in icons
- High contrast
- Test at small sizes

#### 1.3 App Store Screenshots
**Required screenshots** (iPhone):
- 6.7" Display (iPhone 14 Pro Max): 1290x2796
- 6.5" Display (iPhone 11 Pro Max): 1242x2688
- 5.5" Display (iPhone 8 Plus): 1242x2208

**Screenshot content ideas:**
1. Main task view with sample tasks
2. Task creation modal
3. AI recommendations modal
4. All tasks view with completed items
5. Settings/tutorial screen

### Phase 2: App Store Connect Setup

#### 2.1 Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in app information:
   - **Name**: ClearHead
   - **Primary Language**: English
   - **Bundle ID**: Create new (e.g., com.anudeepnayak.clearhead)
   - **SKU**: Unique identifier (e.g., clearhead-2024)

#### 2.2 App Information
- **App Name**: ClearHead
- **Subtitle**: ADHD-Friendly Task Manager
- **Category**: Productivity
- **Content Rating**: 4+ (All Ages)

#### 2.3 App Description
**Suggested App Store description:**

```
🎯 ClearHead - The ADHD-Friendly Task Manager

Stay organized and focused with ClearHead, designed specifically for people with ADHD and anyone who struggles with task management.

✨ KEY FEATURES:
• Simple, distraction-free interface
• Top 3 priority focus system
• AI-powered task recommendations
• ADHD-optimized timing suggestions
• Swipe gestures for quick actions
• No ads, no tracking, completely private

🧠 ADHD-OPTIMIZED AI:
Get personalized task recommendations based on:
• Your energy levels throughout the day
• Task complexity and estimated time
• Interest-driven categories
• Optimal focus periods
• Success probability scoring

📱 INTUITIVE GESTURES:
• Swipe right to complete tasks
• Swipe left to delete
• Swipe up to see all tasks
• Swipe left on main screen for AI recommendations

🔒 PRIVACY FIRST:
• All data stays on your device
• No account required
• No internet connection needed
• AI analysis runs locally

Perfect for people with ADHD, executive dysfunction, or anyone who wants a simpler way to stay productive. ClearHead focuses on what matters most - helping you get things done.

Free to use with optional support via Buy Me A Coffee.
```

### Phase 3: Build Configuration

#### 3.1 Update app.json for Production
```json
{
  "expo": {
    "name": "ClearHead",
    "slug": "clearhead",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F8F8F8"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.anudeepnayak.clearhead",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F8F8F8"
      },
      "package": "com.anudeepnayak.clearhead"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

#### 3.2 Install EAS CLI
```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
```

#### 3.3 Configure EAS Build (eas.json)
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "your-app-id-here",
        "appleId": "your-apple-id@email.com",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

### Phase 4: Build & Submit

#### 4.1 Create Production Build
```bash
# Build for iOS App Store
eas build --platform ios --profile production

# This will:
# - Create signed IPA file
# - Upload to Expo servers
# - Provide download link
```

#### 4.2 Upload to App Store Connect
```bash
# Option 1: Use EAS Submit
eas submit --platform ios --profile production

# Option 2: Manual upload via Xcode
# Download IPA from EAS dashboard
# Use Transporter app or Xcode Organizer
```

#### 4.3 Configure Release in App Store Connect
1. Upload screenshots and app preview video
2. Fill in app review information
3. Set pricing (Free)
4. Configure App Review Information:
   - Contact info
   - Demo account (if needed)
   - Notes to reviewer

### Phase 5: App Review Process

#### 5.1 Common Rejection Reasons & Solutions
**Metadata Issues:**
- Ensure description matches app functionality
- No mention of other platforms
- Proper category selection

**Design Issues:**
- App must work on all supported devices
- No placeholder content
- Intuitive navigation

**Functionality Issues:**
- App must not crash
- All features must work as described
- Test on various iOS versions

#### 5.2 Review Timeline
- **Initial Review**: 24-48 hours (Apple's current average)
- **Rejections**: Address issues and resubmit
- **Approval**: App goes live automatically or on your scheduled date

### Phase 6: Post-Launch

#### 6.1 Monitor Performance
- Download stats in App Store Connect
- User reviews and ratings
- Crash reports and analytics

#### 6.2 Updates
- Bug fixes can be submitted anytime
- New features require app review
- Version updates follow same process

## Quick Start Commands

```bash
# 1. Install EAS CLI
npm install -g @expo/eas-cli

# 2. Login and configure
eas login
eas build:configure

# 3. Build for production
eas build --platform ios --profile production

# 4. Submit to App Store
eas submit --platform ios --profile production
```

## App Store Optimization (ASO)

### Keywords for ClearHead
- ADHD
- task manager
- productivity
- focus
- organization
- todo list
- executive function
- attention deficit
- time management
- simple tasks

### App Store Categories
- **Primary**: Productivity
- **Secondary**: Medical (if emphasizing ADHD features)

## Costs Summary
- **Apple Developer Program**: $99/year
- **EAS Build**: Free tier available, paid plans for more builds
- **App Store**: No additional fees for free apps

## Support Resources
- **Apple Developer Documentation**: https://developer.apple.com/documentation/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Expo EAS Documentation**: https://docs.expo.dev/eas/
- **App Store Connect Help**: https://developer.apple.com/support/app-store-connect/

## Next Steps Checklist
- [ ] Sign up for Apple Developer account
- [ ] Create app icons and screenshots
- [ ] Update app.json with production settings
- [ ] Set up EAS CLI and build configuration
- [ ] Create App Store Connect listing
- [ ] Build and test production version
- [ ] Submit for review
- [ ] Monitor for approval/rejection

Let me know if you need help with any specific step!