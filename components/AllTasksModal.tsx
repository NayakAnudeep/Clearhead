import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, Linking } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  completedAt?: number;
  category?: string;
}

interface AllTasksModalProps {
  visible: boolean;
  todos: Todo[];
  onClose: () => void;
  onUpdateTodos: (id: string, updates: Partial<Todo>) => void;
}

type SectionItem = {
  type: 'section';
  title: string;
  id?: undefined;
};

type TaskItem = {
  type: 'incomplete' | 'completed';
} & Todo;

type DonationItem = {
  type: 'donation';
  id: string;
};

type ListItem = SectionItem | TaskItem | DonationItem;

export default function AllTasksModal({ visible, todos, onClose, onUpdateTodos }: AllTasksModalProps) {
  const [localTodos, setLocalTodos] = useState(todos);

  React.useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  const updatePriority = (id: string, newPriority: 'high' | 'medium' | 'low') => {
    onUpdateTodos(id, { priority: newPriority });
    setLocalTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, priority: newPriority } : todo
    ));
  };

  const incompleteTodos = localTodos.filter(todo => !todo.completed);
  const completedTodos = localTodos.filter(todo => todo.completed);

  const openDonationLink = () => {
    Linking.openURL('https://www.buymeacoffee.com/anudeepnayak');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>All Tasks</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={[
            ...(incompleteTodos.length > 0 ? [{ type: 'section' as const, title: `Pending (${incompleteTodos.length})` }] : []),
            ...incompleteTodos.map(todo => ({ type: 'incomplete' as const, ...todo })),
            ...(completedTodos.length > 0 ? [{ type: 'section' as const, title: `Completed (${completedTodos.length})` }] : []),
            ...completedTodos.map(todo => ({ type: 'completed' as const, ...todo })),
            { type: 'donation' as const, id: 'donation' }
          ]}
          renderItem={({ item }: { item: ListItem }) => {
            if (item.type === 'section') {
              return <Text style={styles.sectionTitle}>{item.title}</Text>;
            } else if (item.type === 'incomplete') {
              return <DraggableTask item={item as TaskItem} onUpdatePriority={updatePriority} />;
            } else if (item.type === 'donation') {
              return (
                <View style={styles.donationContainer}>
                  <Text style={styles.donationTitle}>Enjoying ClearHead? ☕</Text>
                  <Text style={styles.donationText}>
                    This app is completely free with no ads or tracking.{'\n'}
                    Any support is greatly appreciated!
                  </Text>
                  <TouchableOpacity style={styles.donationButton} onPress={openDonationLink}>
                    <Text style={styles.donationButtonText}>☕ Buy Me a Coffee</Text>
                  </TouchableOpacity>
                  <Text style={styles.donationSubtext}>Thank you for using ClearHead! 🙏</Text>
                </View>
              );
            } else {
              return <TaskItem item={item as TaskItem} />;
            }
          }}
          keyExtractor={(item: ListItem) => item.type === 'section' ? item.title : item.id}
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
}

function DraggableTask({ item, onUpdatePriority }: { item: Todo; onUpdatePriority: (id: string, priority: 'high' | 'medium' | 'low') => void }) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.05);
    },
    onActive: (event) => {
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      translateY.value = withSpring(0);
      
      // Determine priority based on drag direction
      if (event.translationY < -50) {
        // Dragged up - increase priority
        const newPriority = item.priority === 'low' ? 'medium' : 
                           item.priority === 'medium' ? 'high' : 'high';
        runOnJS(onUpdatePriority)(item.id, newPriority);
      } else if (event.translationY > 50) {
        // Dragged down - decrease priority
        const newPriority = item.priority === 'high' ? 'medium' : 
                           item.priority === 'medium' ? 'low' : 'low';
        runOnJS(onUpdatePriority)(item.id, newPriority);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <View style={styles.taskItem}>
          <View style={styles.taskContent}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{item.text}</Text>
              <View style={styles.priorityContainer}>
                {item.category && (
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                )}
                <View style={[styles.priorityDot, { 
                  backgroundColor: item.priority === 'high' ? '#B85450' : 
                                 item.priority === 'medium' ? '#D4A574' : '#A8A8A8' 
                }]} />
                <Text style={styles.priorityText}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </Text>
              </View>
            </View>
            {item.description ? (
              <Text style={styles.taskDescription}>{item.description}</Text>
            ) : null}
            <Text style={styles.dragHint}>Drag up/down to change priority</Text>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

function TaskItem({ item }: { item: Todo }) {
  return (
    <View style={[styles.taskItem, styles.completedTask]}>
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, styles.completedTitle]}>{item.text}</Text>
          <View style={[styles.priorityDot, { 
            backgroundColor: item.priority === 'high' ? '#B85450' : 
                           item.priority === 'medium' ? '#D4A574' : '#A8A8A8' 
          }]} />
        </View>
        {item.description ? (
          <Text style={[styles.taskDescription, styles.completedDescription]}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  completedList: {
    maxHeight: 200,
    paddingHorizontal: 20,
  },
  taskItem: {
    backgroundColor: '#FEFCFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedTask: {
    opacity: 0.6,
    backgroundColor: '#F0F0F0',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#A8A8A8',
  },
  taskDescription: {
    fontSize: 14,
    color: '#A8A8A8',
    lineHeight: 20,
    marginBottom: 8,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#C0C0C0',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    color: '#A8A8A8',
    fontWeight: '500',
  },
  dragHint: {
    fontSize: 11,
    color: '#C0C0C0',
    fontStyle: 'italic',
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#A8A8A8',
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#FEFCFC',
    fontWeight: '500',
  },
  donationContainer: {
    backgroundColor: '#FEFCFC',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
    textAlign: 'center',
  },
  donationText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  donationButton: {
    backgroundColor: '#FFDD00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 12,
  },
  donationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  donationSubtext: {
    fontSize: 12,
    color: '#A8A8A8',
    textAlign: 'center',
  },
});
