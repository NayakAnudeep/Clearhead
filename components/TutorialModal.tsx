import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

interface TutorialModalProps {
  visible: boolean;
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to ClearHead! 👋",
    content: "A simple, focused task manager designed for productivity.\n\nLet's learn the basics in just a few swipes.",
    emoji: "🎯"
  },
  {
    title: "Add Your First Task",
    content: "Tap the + button to create a new task.\n\nSet priorities, add descriptions, and organize with categories.",
    emoji: "➕"
  },
  {
    title: "Swipe to Complete ✓",
    content: "Swipe RIGHT on any task to mark it as completed.\n\nQuick and satisfying!",
    emoji: "👉"
  },
  {
    title: "Swipe to Delete ✕",
    content: "Swipe LEFT on any task to delete it.\n\nBe careful - this can't be undone!",
    emoji: "👈"
  },
  {
    title: "View All Tasks",
    content: "SWIPE UP anywhere on the home screen to see all your tasks.\n\nIncomplete tasks are shown first.",
    emoji: "👆"
  },
  {
    title: "Access Settings",
    content: "SWIPE RIGHT anywhere on the home screen to open settings.\n\nCustomize your experience and manage data.",
    emoji: "⚙️"
  },
  {
    title: "AI Task Organization 🤖",
    content: "SWIPE LEFT anywhere to get AI-powered task recommendations.\n\nGet ADHD-friendly suggestions based on your patterns and optimal focus times.",
    emoji: "🧠"
  },
  {
    title: "Support ClearHead ☕",
    content: "This app is completely free with no ads or tracking.\n\nAny support is greatly appreciated! You can:\n• Buy me a coffee ☕\n• Give us a 5-star rating ⭐\n• Share with friends who need focus help",
    emoji: "❤️",
    showDonation: true
  }
];

export default function TutorialModal({ visible, onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skip = () => {
    onComplete();
  };

  const openDonationLink = () => {
    Linking.openURL('https://www.buymeacoffee.com/anudeepnayak');
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <Animated.View 
          key={currentStep}
          entering={SlideInRight} 
          exiting={SlideOutLeft}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.stepCounter}>
              {currentStep + 1} of {tutorialSteps.length}
            </Text>
            <TouchableOpacity onPress={skip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.emoji}>{currentTutorial.emoji}</Text>
            <Text style={styles.title}>{currentTutorial.title}</Text>
            <Text style={styles.description}>{currentTutorial.content}</Text>

            {/* Donation Button */}
            {currentTutorial.showDonation && (
              <Animated.View entering={FadeIn.delay(500)} style={styles.donationContainer}>
                <TouchableOpacity style={styles.donationButton} onPress={openDonationLink}>
                  <Text style={styles.donationButtonText}>☕ Buy Me a Coffee</Text>
                </TouchableOpacity>
                <Text style={styles.donationSubtext}>Thank you for your support! 🙏</Text>
              </Animated.View>
            )}
          </View>

          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive
                ]}
              />
            ))}
          </View>

          {/* Navigation */}
          <View style={styles.navigation}>
            <TouchableOpacity 
              onPress={prevStep}
              style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              disabled={currentStep === 0}
            >
              <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>
                {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepCounter: {
    fontSize: 14,
    color: '#A8A8A8',
    fontWeight: '500',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  donationContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  donationButton: {
    backgroundColor: '#FFDD00',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  donationButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  donationSubtext: {
    fontSize: 14,
    color: '#A8A8A8',
    marginTop: 10,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
  },
  progressDotActive: {
    backgroundColor: '#424242',
    width: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#A8A8A8',
  },
  nextButton: {
    backgroundColor: '#424242',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FEFCFC',
    fontWeight: '600',
  },
});