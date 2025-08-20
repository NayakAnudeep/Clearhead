# ClearHead AI Setup Guide

## Overview
ClearHead includes a built-in AI-powered task organizer that suggests the best tasks to work on based on ADHD-friendly patterns. The AI runs completely locally on your device with no internet connection required.

**📱 Mobile App**: Uses built-in ADHD analysis (no setup required!)
**💻 Desktop/Advanced**: Can optionally use Python ML model for enhanced recommendations

## Built-in AI Features (No Setup Required)

The mobile app includes intelligent ADHD-friendly analysis that works out of the box:

✅ **Instant Analysis** - No installation or configuration needed
✅ **ADHD-Optimized** - Focus time detection, energy level matching
✅ **Smart Scoring** - Priority, category, and task length optimization  
✅ **Personalized Reasoning** - Explains why each task is recommended
✅ **Completely Private** - All processing happens on your device

Simply **swipe left** anywhere in the app to get instant task recommendations!

## Advanced Setup (Optional - Desktop/Development)

For enhanced ML capabilities using the full Python RandomForest model:

### Prerequisites
- Python 3.7 or higher
- Required Python packages: `scikit-learn`, `pandas`, `numpy`, `joblib`

### Setup Instructions

### 1. Install Python
Choose your operating system:

**macOS:**
```bash
# Using Homebrew (recommended)
brew install python3

# Or download from python.org
```

**Windows:**
- Download Python from [python.org](https://python.org/downloads/)
- During installation, make sure to check "Add Python to PATH"

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip
```

### 2. Install Required Packages
```bash
pip3 install scikit-learn pandas numpy joblib
```

Or install all at once:
```bash
pip3 install -r ai-local/requirements.txt
```

### 3. Verify Installation
Run this command to test if everything is working:
```bash
python3 -c "import sklearn, pandas, numpy, joblib; print('✅ All AI dependencies installed successfully!')"
```

## How It Works

### ADHD-Optimized Features
The AI analyzes your tasks using these ADHD-specific patterns:
- **Hyperfocus Hours**: Peak concentration times (9-11 AM, 8-10 PM)
- **Energy Dips**: Lower performance periods (1-4 PM)
- **Task Complexity**: Preference for manageable task sizes
- **Interest-Driven**: Higher completion rates for personally engaging categories
- **Routine Benefits**: Structure helps with ADHD task completion

### Machine Learning Model
- **Algorithm**: RandomForest Classifier
- **Training Data**: 2000+ simulated ADHD behavior patterns
- **Features**: 19 different task and timing characteristics
- **Output**: Top 3 task recommendations with completion probabilities

### Privacy & Security
- ✅ Runs completely offline on your device
- ✅ No data sent to external servers
- ✅ All analysis is local and private
- ✅ Model trains on your personal patterns over time

## Usage

### In the ClearHead App
1. **Swipe left** anywhere on the home screen to open AI Task Organizer
2. Tap **"Analyze My Tasks"** to get recommendations
3. View personalized suggestions with completion probabilities
4. See ADHD-specific reasoning for each recommendation

### Manual Testing (Developer)
You can test the AI directly:
```bash
cd ai-local
python3 clearhead_ai.py input_sample.json output_sample.json
```

## Troubleshooting

### "Python not found" error
- Make sure Python is installed and added to your system PATH
- Try `python` instead of `python3` on some systems

### Permission errors
- On macOS/Linux, you might need: `sudo pip3 install ...`
- Or use: `pip3 install --user ...`

### Import errors
- Make sure all packages installed correctly
- Try upgrading pip: `pip3 install --upgrade pip`

### Still not working?
The app includes a fallback rule-based analysis that works without Python installation. You'll still get ADHD-friendly task recommendations based on time patterns and task characteristics.

## Advanced Configuration

### Custom Model Training
The AI can be retrained with your personal task completion patterns. Edit `ai-local/clearhead_ai.py` to adjust:
- ADHD behavior patterns
- Optimal task lengths
- Focus hour preferences
- Category preferences

### Performance Tuning
- Model saves to `clearhead_model.joblib` for faster subsequent runs
- First analysis takes ~5-10 seconds, later analyses are under 2 seconds
- Memory usage: ~50MB during analysis

## Support
If you need help with setup, please:
1. Check this guide first
2. Try the troubleshooting steps
3. The app works fine without AI - it's an optional enhancement

Remember: The AI learns from your patterns, so the more you use ClearHead, the better the recommendations become!