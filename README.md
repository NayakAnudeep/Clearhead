# ClearHead 🧠✨

**A Smart Todo App Designed for People with ADHD**

ClearHead is a thoughtfully designed todo application that addresses the unique challenges faced by people with ADHD. Built with React Native and Expo, it provides an intuitive interface with features specifically tailored to help users with attention difficulties stay organized and focused.

## 🎯 About This Project

This app recognizes that traditional todo lists often don't work well for people with ADHD. ClearHead aims to solve common issues like task overwhelm, priority confusion, and lack of visual feedback by providing a clean, focused interface with smart task management features.

## ✨ Features

### Current Features
- **📱 Cross-Platform Support**: Runs on iOS, Android, and Web
- **➕ Quick Task Addition**: Floating action button for easy task creation
- **📝 Detailed Task Input**: Add titles, descriptions, and priority levels
- **🎨 Priority System**: Visual priority indicators (High, Medium, Low) with color coding
- **⚠️ Input Validation**: Clear warning messages for empty task titles
- **🌙 Dark/Light Mode Support**: Automatic theme switching based on system preferences
- **🎭 Smooth Modal Interface**: Elegant task creation experience

### ADHD-Focused Design Elements
- **Minimal Distractions**: Clean, uncluttered interface
- **Visual Priority Cues**: Color-coded priority dots for quick recognition
- **Clear Visual Feedback**: Warning pills and validation messages
- **Focus-Friendly Colors**: Calming color palette to reduce overwhelm

## 🛠️ Technologies Used

### Core Framework
- **React Native** (0.79.5) - Cross-platform mobile development
- **Expo** (~53.0.20) - Development platform and build tools
- **TypeScript** (~5.8.3) - Type-safe development
- **Expo Router** (~5.1.4) - File-based navigation

### UI & Interaction
- **React Native Gesture Handler** (~2.24.0) - Gesture handling
- **React Native Reanimated** (~3.17.4) - Smooth animations
- **React Native Screens** (~4.11.1) - Native screen management
- **Expo Haptics** (~14.1.4) - Tactile feedback

### Navigation & Layout
- **@react-navigation/native** (^7.1.6) - Navigation library
- **@react-navigation/bottom-tabs** (^7.3.10) - Tab navigation
- **React Native Safe Area Context** (5.4.0) - Safe area handling

### Visual Elements
- **@expo/vector-icons** (^14.1.0) - Icon library
- **Expo Symbols** (~0.4.5) - iOS-style symbols
- **Expo Blur** (~14.1.5) - Blur effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ClearHead.git
   cd ClearHead
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser
   - Scan the QR code with Expo Go app on your phone

### Development Commands
```bash
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
```

## 📱 Current Progress

### ✅ Completed Features
- [x] **Cross-platform Setup**: React Native + Expo + TypeScript foundation
- [x] **Task Creation Modal**: Floating + button with fade-in modal
- [x] **Priority System**: High/Medium/Low selection with colored dots and pill-style UI
- [x] **Form Validation**: Clean warning pills for empty task validation
- [x] **Task Display**: List view showing tasks with priority indicators
- [x] **Task Interactions**: Mark complete/incomplete, delete functionality  
- [x] **Smart Filtering**: Show only top 3 highest priority incomplete tasks
- [x] **ADHD-Friendly Design**: Minimal, clean interface with muted color palette
- [x] **Task Structure**: Title, description, priority, completion status

### 🎯 Core ADHD Features Working
- **Reduced Overwhelm**: Maximum 3 tasks shown at once
- **Priority-Based Sorting**: High → Medium → Low automatic ordering
- **Visual Priority Cues**: Color-coded dots (muted red, yellow, grey)
- **Clean Completion**: Completed tasks disappear from main view
- **Minimal Interface**: No headers or extra text - just essential tasks

### 🚧 Current Status
**Fully functional MVP** with core todo functionality and ADHD-specific features. App successfully:
- Creates tasks with priority levels
- Displays only top 3 priorities
- Handles task completion and deletion
- Provides clean, distraction-free interface

## 🔮 Future Plans

### Phase 1: Core Enhancements
- [ ] **Local Data Persistence**: Save tasks between app sessions
- [ ] **Task Editing**: Modify existing tasks and priorities
- [ ] **Better Empty States**: Helpful messages when no tasks exist
- [ ] **Improved Animations**: Smooth transitions for task actions

### Phase 2: Smart AI Integration 🤖
**The game-changer feature**: Local AI that learns from user behavior and provides intelligent task management.

#### **Hybrid AI Approach**
- **Pre-trained Foundation Model**: Lightweight neural network with ADHD-specific domain knowledge
- **Adaptive Learning Layer**: Personalizes based on user's actual completion patterns
- **Privacy-First**: All AI processing happens locally - no data leaves the device

#### **Pre-trained Knowledge Base**
- ⏰ **Time Estimation Patterns**: ADHD users typically underestimate by 2-3x
- 🌅 **Energy Management**: High-focus tasks work better in morning hours
- 🔄 **Task Switching Costs**: Group similar tasks to reduce cognitive load
- 🎆 **Dopamine-Driven Completion**: Quick wins boost motivation for larger tasks

#### **Adaptive Learning Features**
- **Personal Completion Times**: Learn how long tasks actually take vs estimates
- **Productivity Patterns**: Identify optimal times of day for different task types
- **Procrastination Detection**: Recognize which tasks tend to get delayed
- **Priority Accuracy**: Track when users change priorities and learn preferences

#### **AI-Powered Suggestions**
- 📅 **Daily Planning**: "Based on your energy patterns, tackle the high-priority task at 9 AM"
- ✂️ **Task Breakdown**: "This looks complex - want me to suggest smaller steps?"
- ⏱️ **Realistic Scheduling**: "You usually take 45 min for tasks like this, not 20 min"
- 🎯 **Smart Prioritization**: "This deadline is approaching and matches your high-energy time"

#### **Technical Implementation**
- **Model Architecture**: 2-3 layer neural network + rule-based heuristics
- **Local Processing**: TensorFlow.js or similar for browser/mobile ML
- **Training Data**: Synthetic ADHD productivity data + general task patterns
- **Continuous Learning**: Model updates based on user interactions

### Phase 3: Advanced Features
- 📊 **Insights Dashboard**: Personal productivity analytics
- 🔔 **Smart Notifications**: Context-aware, non-overwhelming reminders
- 🎨 **Customization**: Themes and layouts optimized for individual ADHD presentations
- 📱 **Widget Support**: Quick task viewing from home screen

### Long-term Vision
**ClearHead as an ADHD Productivity Companion**: An AI-powered assistant that understands the unique challenges of ADHD and provides personalized, actionable guidance for better task management and daily planning.

## 🎨 Design Philosophy

ClearHead is built with the understanding that people with ADHD benefit from:
- **Reduced visual clutter** to minimize distractions
- **Clear visual hierarchies** to help with prioritization
- **Immediate feedback** to maintain engagement
- **Simplified workflows** to reduce cognitive load
- **Consistent patterns** to build muscle memory



## 🙏 Acknowledgments

- Built with love for the ADHD community
- Inspired by research on ADHD productivity patterns
- Thanks to the React Native and Expo communities

---

**Made with 💙 for better focus and productivity**
