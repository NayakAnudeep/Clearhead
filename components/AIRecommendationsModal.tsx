import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { Todo } from '@/hooks/useTodoStorage';
import { AIRecommendation, AIAnalysisResult } from '@/services/aiService';
import { getCategoryColor } from '@/constants/categories';

interface AIRecommendationsModalProps {
  visible: boolean;
  onClose: () => void;
  onRunAnalysis: () => void;
  onTaskPress: (todo: Todo) => void;
  isAnalyzing: boolean;
  analysis: AIAnalysisResult | null;
  recommendedTodos: Todo[];
  getTaskRecommendation: (todoId: string) => AIRecommendation | null;
}

export default function AIRecommendationsModal({
  visible,
  onClose,
  onRunAnalysis,
  onTaskPress,
  isAnalyzing,
  analysis,
  recommendedTodos,
  getTaskRecommendation
}: AIRecommendationsModalProps) {

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#424242" />
      <Text style={styles.loadingText}>🧠 AI is analyzing your tasks...</Text>
      <Text style={styles.loadingSubtext}>
        Using ADHD-optimized patterns to find your best next tasks
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyEmoji}>🤖</Text>
      <Text style={styles.emptyTitle}>Ready for AI-Powered Organization?</Text>
      <Text style={styles.emptyText}>
        Get personalized task recommendations based on ADHD-friendly patterns:
        {'\n\n'}• Best times for your focus{'\n'}
        • Task complexity matching{'\n'}
        • Energy level optimization{'\n'}
        • Completion probability scoring
      </Text>
      <TouchableOpacity style={styles.analyzeButton} onPress={onRunAnalysis}>
        <Text style={styles.analyzeButtonText}>🧠 Analyze My Tasks</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={styles.errorTitle}>Analysis Not Available</Text>
      <Text style={styles.errorText}>
        {analysis?.message || 'AI analysis failed'}
        {'\n\n'}Using built-in ADHD-friendly suggestions instead.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRunAnalysis}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecommendations = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View entering={FadeIn} style={styles.headerContainer}>
        <Text style={styles.headerTitle}>🧠 AI Recommendations</Text>
        <Text style={styles.headerSubtitle}>
          {analysis?.modelInfo?.type || 'ADHD-Optimized Analysis'}
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRunAnalysis}>
          <Text style={styles.refreshButtonText}>🔄 Re-analyze</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Recommendations */}
      {recommendedTodos.map((todo, index) => {
        const recommendation = getTaskRecommendation(todo.id);
        if (!recommendation) return null;

        return (
          <Animated.View 
            key={todo.id}
            entering={FadeIn.delay(index * 100)}
            style={styles.recommendationCard}
          >
            <TouchableOpacity onPress={() => onTaskPress(todo)} style={styles.taskHeader}>
              <View style={styles.taskInfo}>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderText}>{recommendation.suggestedOrder}</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{todo.text}</Text>
                  {todo.description ? (
                    <Text style={styles.taskDescription}>{todo.description}</Text>
                  ) : null}
                </View>
                <View style={styles.taskMeta}>
                  {todo.category && (
                    <View style={[styles.categoryPill, { backgroundColor: getCategoryColor(todo.category) }]}>
                      <Text style={styles.categoryText}>{todo.category}</Text>
                    </View>
                  )}
                  <View style={[styles.priorityDot, { 
                    backgroundColor: todo.priority === 'high' ? '#B85450' : 
                                   todo.priority === 'medium' ? '#D4A574' : '#A8A8A8' 
                  }]} />
                </View>
              </View>
            </TouchableOpacity>

            {/* AI Insights */}
            <View style={styles.aiInsights}>
              <View style={styles.scoreContainer}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Success Rate</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreBarFill, {
                      width: `${recommendation.completionProbability * 100}%`,
                      backgroundColor: recommendation.completionProbability > 0.7 ? '#9CAF88' : 
                                     recommendation.completionProbability > 0.4 ? '#D4A574' : '#B85450'
                    }]} />
                  </View>
                  <Text style={styles.scoreValue}>
                    {Math.round(recommendation.completionProbability * 100)}%
                  </Text>
                </View>

                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>ADHD Match</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreBarFill, {
                      width: `${recommendation.adhdScore * 100}%`,
                      backgroundColor: recommendation.adhdScore > 0.7 ? '#9CAF88' : 
                                     recommendation.adhdScore > 0.4 ? '#D4A574' : '#B85450'
                    }]} />
                  </View>
                  <Text style={styles.scoreValue}>
                    {Math.round(recommendation.adhdScore * 100)}%
                  </Text>
                </View>
              </View>

              {/* Reasoning */}
              <View style={styles.reasoningContainer}>
                <Text style={styles.reasoningTitle}>Why this task now?</Text>
                {recommendation.reasoning.map((reason, reasonIndex) => (
                  <Text key={reasonIndex} style={styles.reasoningItem}>
                    • {reason}
                  </Text>
                ))}
              </View>
            </View>
          </Animated.View>
        );
      })}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🏠 Analysis runs locally on your device{'\n'}
          🔒 No data is sent to external servers
        </Text>
        {analysis?.timestamp && (
          <Text style={styles.timestampText}>
            Last analyzed: {new Date(analysis.timestamp).toLocaleTimeString()}
          </Text>
        )}
      </View>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <Animated.View 
          entering={SlideInUp} 
          exiting={SlideOutDown}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Task Organizer</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {isAnalyzing ? renderLoadingState() :
           !analysis ? renderEmptyState() :
           !analysis.success ? renderErrorState() :
           recommendedTodos.length === 0 ? renderEmptyState() :
           renderRecommendations()}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#424242',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  analyzeButton: {
    backgroundColor: '#424242',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEFCFC',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B85450',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#B85450',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FEFCFC',
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A8A8A8',
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: '#FEFCFC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#424242',
  },
  refreshButtonText: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '500',
  },
  recommendationCard: {
    backgroundColor: '#FEFCFC',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskHeader: {
    padding: 16,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FEFCFC',
  },
  taskContent: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  taskMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: '#FEFCFC',
    fontWeight: '500',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  aiInsights: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  scoreContainer: {
    marginBottom: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#424242',
    width: 80,
  },
  scoreBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginHorizontal: 12,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
    width: 35,
    textAlign: 'right',
  },
  reasoningContainer: {
    marginTop: 8,
  },
  reasoningTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  reasoningItem: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#A8A8A8',
    textAlign: 'center',
    lineHeight: 16,
  },
  timestampText: {
    fontSize: 10,
    color: '#C0C0C0',
    marginTop: 8,
  },
});