import { useState, useCallback } from 'react';
import { Todo } from './useTodoStorage';
import aiService, { AIAnalysisResult, AIRecommendation } from '@/services/aiService';

export const useAI = (todos: Todo[]) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pythonSetup, setPythonSetup] = useState<{
    available: boolean;
    pythonVersion?: string;
    dependencies: string[];
    missingDependencies: string[];
  } | null>(null);

  const runAIAnalysis = useCallback(async () => {
    if (todos.length === 0) {
      setError('No tasks to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🧠 Starting AI analysis...');
      const result = await aiService.analyzeTasksWithAI(todos);
      
      setLastAnalysis(result);
      
      if (!result.success) {
        setError(result.message);
      }
      
      console.log('✅ AI analysis complete');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown AI error';
      setError(errorMessage);
      console.error('❌ AI analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [todos]);

  const checkPythonSetup = useCallback(async () => {
    try {
      const setup = await aiService.checkPythonSetup();
      setPythonSetup(setup);
      return setup;
    } catch (err) {
      console.error('Failed to check Python setup:', err);
      return null;
    }
  }, []);

  const getRecommendedTodos = useCallback((): Todo[] => {
    if (!lastAnalysis || !lastAnalysis.success || lastAnalysis.recommendations.length === 0) {
      return [];
    }

    return lastAnalysis.recommendations
      .map(rec => todos.find(todo => todo.id === rec.taskId))
      .filter((todo): todo is Todo => todo !== undefined);
  }, [lastAnalysis, todos]);

  const getTaskRecommendation = useCallback((todoId: string): AIRecommendation | null => {
    if (!lastAnalysis || !lastAnalysis.success) {
      return null;
    }

    return lastAnalysis.recommendations.find(rec => rec.taskId === todoId) || null;
  }, [lastAnalysis]);

  const getSetupInstructions = useCallback(() => {
    return aiService.getSetupInstructions();
  }, []);

  const clearAnalysis = useCallback(() => {
    setLastAnalysis(null);
    setError(null);
  }, []);

  return {
    // Analysis state
    isAnalyzing,
    lastAnalysis,
    error,
    pythonSetup,

    // Actions
    runAIAnalysis,
    checkPythonSetup,
    clearAnalysis,

    // Getters
    getRecommendedTodos,
    getTaskRecommendation,
    getSetupInstructions,

    // Computed values
    hasRecommendations: lastAnalysis?.success && lastAnalysis.recommendations.length > 0,
    recommendationCount: lastAnalysis?.recommendations.length || 0,
    analysisTimestamp: lastAnalysis?.timestamp,
    modelInfo: lastAnalysis?.modelInfo
  };
};