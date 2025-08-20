import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { getCategoryColor } from '@/constants/categories';

interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
}

interface SwipeableTaskProps {
  item: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function SwipeableTask({ item, onEdit, onDelete, onToggle }: SwipeableTaskProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startX?: number }) => {
      context.startX = translateX.value;
    },
    onActive: (event, context: { startX?: number }) => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        translateX.value = (context.startX || 0) + event.translationX;
      }
    },
    onEnd: (event) => {
      const shouldDelete = translateX.value < -60;
      const shouldComplete = translateX.value > 60;
      
      if (shouldDelete) {
        opacity.value = withTiming(0, { duration: 150 });
        runOnJS(onDelete)(item.id);
      } else if (shouldComplete) {
        runOnJS(onToggle)(item.id);
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const rightActionStyle = useAnimatedStyle(() => {
    const scale = translateX.value > 30 ? withSpring(1) : withSpring(0.8);
    return {
      transform: [{ scale }],
      opacity: translateX.value > 30 ? 1 : 0.5,
    };
  });

  const leftActionStyle = useAnimatedStyle(() => {
    const scale = translateX.value < -30 ? withSpring(1) : withSpring(0.8);
    return {
      transform: [{ scale }],
      opacity: translateX.value < -30 ? 1 : 0.5,
    };
  });

  return (
    <View style={styles.swipeContainer}>
      <Animated.View style={[styles.rightAction, rightActionStyle]}>
        <Text style={styles.actionText}>✓</Text>
      </Animated.View>
      
      <Animated.View style={[styles.leftAction, leftActionStyle]}>
        <Text style={styles.actionText}>✕</Text>
      </Animated.View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity 
            style={[styles.todoItem, item.completed && styles.todoItemCompleted]}
            onPress={() => onEdit(item)}
          >
            <View style={styles.todoContent}>
              <View style={styles.todoHeader}>
                <Text style={[styles.todoTitle, item.completed && styles.todoTitleCompleted]}>
                  {item.text}
                </Text>
                <View style={styles.todoMeta}>
                  {item.category && (
                    <View style={[styles.categoryPill, { backgroundColor: getCategoryColor(item.category) }]}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                  )}
                  <View style={[styles.priorityDot, { 
                    backgroundColor: item.priority === 'high' ? '#B85450' : 
                                  item.priority === 'medium' ? '#D4A574' : '#A8A8A8' 
                  }]} />
                </View>
              </View>
              {item.description ? (
                <Text style={[styles.todoDescription, item.completed && styles.todoDescriptionCompleted]}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  rightAction: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#A8A8A8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  leftAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  actionText: {
    color: '#FEFCFC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  todoItem: {
    backgroundColor: '#FEFCFC',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  todoContent: {
    flex: 1,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    flex: 1,
  },
  todoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#FEFCFC',
    fontWeight: '500',
  },
  todoDescription: {
    fontSize: 14,
    color: '#A8A8A8',
    lineHeight: 20,
    marginBottom: 4,
  },
  todoItemCompleted: {
    opacity: 0.6,
    backgroundColor: '#F0F0F0',
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#A8A8A8',
  },
  todoDescriptionCompleted: {
    textDecorationLine: 'line-through',
    color: '#C0C0C0',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});