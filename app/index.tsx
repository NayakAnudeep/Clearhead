import AIRecommendationsModal from '@/components/AIRecommendationsModal';
import AllTasksModal from '@/components/AllTasksModal';
import SettingsModal from '@/components/SettingsModal';
import SwipeableTask from '@/components/SwipeableTask';
import TaskModal from '@/components/TaskModal';
import TutorialModal from '@/components/TutorialModal';
import { getRandomQuote } from '@/constants/quotes';
import { useTodoStorage } from '@/hooks/useTodoStorage';
import { useTutorial } from '@/hooks/useTutorial';
import { useAI } from '@/hooks/useAI';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedGestureHandler
} from 'react-native-reanimated';

export default function HomeScreen() {
  const {
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    getTopThreeTodos,
    todos,
    setError
  } = useTodoStorage();

  const { showTutorial, isLoading: tutorialLoading, completeTutorial, resetTutorial } = useTutorial();
  
  const {
    isAnalyzing,
    lastAnalysis,
    error: aiError,
    runAIAnalysis,
    getRecommendedTodos,
    getTaskRecommendation,
    hasRecommendations
  } = useAI(todos);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [allTasksVisible, setAllTasksVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [inputDescText, setInputDescText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('low');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [warningMessage, setWarningMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  const handleAddTodo = () => {
    if (inputText.trim() === '') {
      setWarningMessage('Please enter a task title!');
      return;
    }
    
    setWarningMessage('');
    addTodo(
      inputText, 
      inputDescText, 
      selectedPriority, 
      selectedCategory || undefined
    );
    clearForm();
    setModalVisible(false);
    setCurrentQuote(getRandomQuote());
  };

  const openEditModal = (todo: any) => {
    setEditingTodo(todo);
    setInputText(todo.text);
    setInputDescText(todo.description);
    setSelectedPriority(todo.priority);
    setSelectedCategory(todo.category || '');
    setEditModalVisible(true);
  };

  const handleUpdateTodo = () => {
    if (inputText.trim() === '') {
      setWarningMessage('Please enter a task title!');
      return;
    }
    
    setWarningMessage('');
    updateTodo(editingTodo.id, {
      text: inputText.trim(),
      description: inputDescText.trim(),
      priority: selectedPriority,
      category: selectedCategory || undefined
    });
    
    clearForm();
    setEditModalVisible(false);
    setEditingTodo(null);
  };

  const clearForm = () => {
    setInputText('');
    setInputDescText('');
    setSelectedPriority('low');
    setSelectedCategory('');
    setWarningMessage('');
    setShowCategoryDropdown(false);
  };

  const clearError = () => {
    setError(null);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentQuote(getRandomQuote());
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSwipeUp = () => {
    setAllTasksVisible(true);
  };

  const handleSwipeRight = () => {
    setSettingsVisible(true);
  };

  const handleSwipeLeft = () => {
    setAiModalVisible(true);
  };

  const handleClearAllTasks = () => {
    todos.forEach(todo => deleteTodo(todo.id));
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
  };

  const containerGestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      if (event.velocityX > 500) {
        runOnJS(handleSwipeRight)();
      } else if (event.velocityX < -500) {
        runOnJS(handleSwipeLeft)();
      } else if (event.velocityY < -500) {
        runOnJS(handleSwipeUp)();
      }
    },
  });

  if (isLoading || tutorialLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="small" color="#A8A8A8" />
      </View>
    );
  }

  const topTodos = getTopThreeTodos();

  return (
    <PanGestureHandler onGestureEvent={containerGestureHandler}>
      <View style={styles.container}>
        {error && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity onPress={clearError} style={styles.errorText}>
              <Text style={styles.errorMessage}>Storage error - tap to dismiss</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <FlatList
          data={topTodos}
          renderItem={({ item }) => (
            <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut}>
              <SwipeableTask 
                item={item} 
                onEdit={openEditModal} 
                onDelete={deleteTodo} 
                onToggle={handleToggleTodo}
              />
            </Animated.View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.todoList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A8A8A8" />
          }
          onScroll={(event) => {
            const { velocity } = event.nativeEvent;
            if (velocity && velocity.y < -2) {
              handleSwipeUp();
            }
          }}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Ready to get organized?</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to add your first task.{'\n'}
                ClearHead will show your top 3 priorities to keep you focused.{'\n\n'}
                Swipe up to see all tasks • Swipe right for settings{'\n'}
                Swipe left for AI task organization
              </Text>
            </View>
          }
          ListFooterComponent={
            topTodos.length > 0 ? (
              <Animated.View entering={FadeIn.delay(300)} style={styles.quoteContainer}>
                <Text style={styles.quote}>{currentQuote}</Text>
              </Animated.View>
            ) : null
          }
        />

        <Animated.View entering={FadeIn.delay(500)}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>
        </Animated.View>

        <TaskModal
          visible={modalVisible}
          title="Add Task"
          buttonText="Add Task"
          inputText={inputText}
          inputDescText={inputDescText}
          selectedPriority={selectedPriority}
          selectedCategory={selectedCategory}
          warningMessage={warningMessage}
          showCategoryDropdown={showCategoryDropdown}
          onTextChange={setInputText}
          onDescChange={setInputDescText}
          onPriorityChange={setSelectedPriority}
          onCategoryChange={setSelectedCategory}
          onToggleCategoryDropdown={() => setShowCategoryDropdown(!showCategoryDropdown)}
          onSubmit={handleAddTodo}
          onCancel={() => {
            setModalVisible(false);
            clearForm();
          }}
        />

        <TaskModal
          visible={editModalVisible}
          title="Edit Task"
          buttonText="Update Task"
          inputText={inputText}
          inputDescText={inputDescText}
          selectedPriority={selectedPriority}
          selectedCategory={selectedCategory}
          warningMessage={warningMessage}
          showCategoryDropdown={showCategoryDropdown}
          onTextChange={setInputText}
          onDescChange={setInputDescText}
          onPriorityChange={setSelectedPriority}
          onCategoryChange={setSelectedCategory}
          onToggleCategoryDropdown={() => setShowCategoryDropdown(!showCategoryDropdown)}
          onSubmit={handleUpdateTodo}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingTodo(null);
            clearForm();
          }}
        />

        <AllTasksModal
          visible={allTasksVisible}
          todos={todos}
          onClose={() => setAllTasksVisible(false)}
          onUpdateTodos={updateTodo}
        />

        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          onClearAllTasks={handleClearAllTasks}
          onShowTutorial={resetTutorial}
        />

        <TutorialModal
          visible={showTutorial}
          onComplete={completeTutorial}
        />

        <AIRecommendationsModal
          visible={aiModalVisible}
          onClose={() => setAiModalVisible(false)}
          onRunAnalysis={runAIAnalysis}
          onTaskPress={openEditModal}
          isAnalyzing={isAnalyzing}
          analysis={lastAnalysis}
          recommendedTodos={getRecommendedTodos()}
          getTaskRecommendation={getTaskRecommendation}
        />
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
    paddingTop: 60,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 12,
    color: '#B85450',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#A8A8A8',
    textAlign: 'center',
    lineHeight: 24,
  },
  quoteContainer: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    color: '#A8A8A8',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  todoList: {
    flex: 1,
    marginBottom: 100,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingButtonText: {
    fontSize: 30,
    color: '#FEFCFC',
    fontWeight: 'bold',
  },
});