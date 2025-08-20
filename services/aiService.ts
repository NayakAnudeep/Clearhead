import { Todo } from '@/hooks/useTodoStorage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface AIRecommendation {
  taskId: string;
  completionProbability: number;
  adhdScore: number;
  reasoning: string[];
  suggestedOrder: number;
}

export interface AIAnalysisResult {
  success: boolean;
  message: string;
  recommendations: AIRecommendation[];
  timestamp?: string;
  modelInfo?: {
    type: string;
    features: number;
    trainedLocally: boolean;
  };
}

class AIService {
  async analyzeTasksWithAI(todos: Todo[]): Promise<AIAnalysisResult> {
    // In Expo/React Native, we can't use child_process, so use fallback analysis
    console.log('🤖 Using built-in ADHD-friendly analysis (Python not available in mobile environment)...');
    
    return this.getBuiltInAnalysis(todos);
  }
  
  private getBuiltInAnalysis(todos: Todo[]): AIAnalysisResult {
    const incompleteTodos = todos.filter(todo => !todo.completed);
    const currentHour = new Date().getHours();
    
    if (incompleteTodos.length === 0) {
      return {
        success: true,
        message: 'No incomplete tasks to analyze',
        recommendations: [],
        timestamp: new Date().toISOString(),
        modelInfo: {
          type: 'Built-in ADHD Analysis',
          features: 5,
          trainedLocally: true
        }
      };
    }
    
    // Simple ADHD-friendly scoring
    const scoredTasks = incompleteTodos.map(todo => {
      let score = 0.5; // Base score
      
      // Time-based scoring (ADHD focus patterns)
      if ([9, 10, 11, 20, 21, 22].includes(currentHour)) {
        score += 0.2; // Good focus hours
      } else if ([13, 14, 15, 16].includes(currentHour)) {
        score -= 0.2; // Post-lunch dip
      }
      
      // Priority scoring
      if (todo.priority === 'high') score += 0.15;
      else if (todo.priority === 'low') score -= 0.1;
      
      // Category scoring (interest-driven)
      if (['Personal', 'Learning'].includes(todo.category || '')) {
        score += 0.2;
      } else if (['Finance', 'Errands'].includes(todo.category || '')) {
        score -= 0.15;
      }
      
      // Task length estimation (shorter is better for ADHD)
      const textLength = (todo.text + ' ' + todo.description).length;
      if (textLength < 50) score += 0.1;
      else if (textLength > 150) score -= 0.2;
      
      // Generate simple reasoning
      const reasoning = [];
      if ([9, 10, 11, 20, 21, 22].includes(currentHour)) {
        reasoning.push("Good time for focus and concentration");
      }
      
      if (['Personal', 'Learning'].includes(todo.category || '')) {
        reasoning.push("Interest-driven category - natural motivation");
      }
      
      if (textLength < 50) {
        reasoning.push("Short task fits ADHD attention span");
      }
      
      if (todo.priority === 'high') {
        reasoning.push("High priority task");
      }
      
      return {
        todo,
        score: Math.max(0.1, Math.min(0.9, score)),
        reasoning: reasoning.length > 0 ? reasoning : ["Task ready for completion"]
      };
    });
    
    // Sort by score and take top 3
    const topTasks = scoredTasks
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    const recommendations: AIRecommendation[] = topTasks.map((task, index) => ({
      taskId: task.todo.id,
      completionProbability: task.score,
      adhdScore: task.score,
      reasoning: task.reasoning,
      suggestedOrder: index + 1
    }));
    
    return {
      success: true,
      message: `Analyzed ${incompleteTodos.length} tasks with built-in ADHD patterns`,
      recommendations,
      timestamp: new Date().toISOString(),
      modelInfo: {
        type: 'Built-in ADHD Analysis',
        features: 5,
        trainedLocally: true
      }
    };
  }
  
  async checkPythonSetup() {
    return {
      available: false,
      dependencies: ['Python not available in mobile environment'],
      missingDependencies: []
    };
  }
  
  getSetupInstructions(): string[] {
    return [
      "Using built-in ADHD-friendly task analysis.",
      "",
      "This provides smart recommendations based on:",
      "• Current time and ADHD focus patterns",
      "• Task priorities and categories", 
      "• Estimated task complexity",
      "• Interest-driven motivation",
      "",
      "The analysis runs instantly on your device with no setup required!"
    ];
  }
}

export const aiService = new AIService();
export default aiService;