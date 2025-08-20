import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_COMPLETED_KEY = '@clearhead_tutorial_completed';

export const useTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkTutorialStatus();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const tutorialCompleted = await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY);
      
      if (tutorialCompleted === null) {
        // First time user - show tutorial
        setShowTutorial(true);
      } else {
        setShowTutorial(false);
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
      // If error, assume first time user
      setShowTutorial(true);
    } finally {
      setIsLoading(false);
    }
  };

  const completeTutorial = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
      setShowTutorial(false);
    } catch (error) {
      console.error('Error saving tutorial completion:', error);
    }
  };

  const resetTutorial = async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_COMPLETED_KEY);
      setShowTutorial(true);
    } catch (error) {
      console.error('Error resetting tutorial:', error);
    }
  };

  return {
    showTutorial,
    isLoading,
    completeTutorial,
    resetTutorial
  };
};