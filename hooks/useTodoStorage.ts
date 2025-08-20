import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  completedAt?: number;
  category?: string;
}

const TODO_STORAGE_KEY = '@clearhead_todos';

export const useTodoStorage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos from storage on app start
  useEffect(() => {
    loadTodos();
  }, []);

  // Save todos to storage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const storedTodos = await AsyncStorage.getItem(TODO_STORAGE_KEY);
      
      if (storedTodos) {
        const parsedTodos: Todo[] = JSON.parse(storedTodos);
        setTodos(parsedTodos);
      }
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load your tasks. They may not appear until the app is restarted.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodos = async (todosToSave: Todo[]) => {
    try {
      await AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todosToSave));
    } catch (err) {
      console.error('Error saving todos:', err);
      setError('Failed to save your tasks. Changes may not persist.');
    }
  };

  const addTodo = (text: string, description: string, priority: 'high' | 'medium' | 'low', category?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      description: description.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
      category,
    };

    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              completed: !todo.completed,
              completedAt: !todo.completed ? Date.now() : undefined
            } 
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, ...updates }
          : todo
      )
    );
  };

  const clearAllTodos = async () => {
    try {
      await AsyncStorage.removeItem(TODO_STORAGE_KEY);
      setTodos([]);
    } catch (err) {
      console.error('Error clearing todos:', err);
      setError('Failed to clear tasks.');
    }
  };

  // Helper functions for filtering
  const getTopThreeTodos = () => {
    const incompleteTodos = todos.filter(todo => !todo.completed);
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    
    const sortedTodos = incompleteTodos.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by creation date (newest first)
      return b.createdAt - a.createdAt;
    });
    
    return sortedTodos.slice(0, 3);
  };

  const getCompletedTodos = () => {
    return todos
      .filter(todo => todo.completed)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  };

  // Statistics
  const getStats = () => {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  return {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearAllTodos,
    getTopThreeTodos,
    getCompletedTodos,
    getStats,
    setError // Allow manual error clearing
  };
};
