import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';

interface Todo {
    id: string;
    text: string;
    description: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input_text, setInputText] = useState("");
  const [modal_visible, setModalVisible] = useState(false);
  const [input_text_desc, setInputDescText] = useState("");
  const [selected_priority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('low');
  const addTodo = () => {
    // Validation: Check if title is not empty
    if (input_text.trim() === '') {
      setWarningMessage('Please enter a task title!');
      return;
    }
    
    setWarningMessage('');

    // Create new todo
    const newTodo: Todo = {
      id: Date.now().toString(), // Simple unique ID
      text: input_text.trim(),
      description: input_text_desc.trim(),
      completed: false,
      priority: selected_priority,
    };

    // Add to todos array
    setTodos([...todos, newTodo]);

    // Clear form
    setInputText('');
    setInputDescText('');
    setSelectedPriority('low');

    // Close modal
    setModalVisible(false);
  };
  const [warningMessage, setWarningMessage] = useState('');

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getTopThreeTodos = () => {
    // Filter out completed todos first
    const incompleteTodos = todos.filter(todo => !todo.completed);
    
    // Sort by priority: high > medium > low
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    const sortedTodos = incompleteTodos.sort((a, b) => 
      priorityOrder[b.priority] - priorityOrder[a.priority]
    );
    
    // Return only top 3
    return sortedTodos.slice(0, 3);
  };

  const completedTodos = todos.filter(todo => todo.completed);

  return(
  <View style = {styles.container}>
    <FlatList
      data={getTopThreeTodos()}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={[styles.todoItem, item.completed && styles.todoItemCompleted]}
          onPress={() => toggleTodo(item.id)}
        >
          <View style={styles.todoContent}>
            <View style={styles.todoHeader}>
              <Text style={[styles.todoTitle, item.completed && styles.todoTitleCompleted]}>{item.text}</Text>
              <View style={styles.todoActions}>
                <View style={[styles.priorityDot, { 
                  backgroundColor: item.priority === 'high' ? '#B85450' : 
                                item.priority === 'medium' ? '#D4A574' : '#A8A8A8' 
                }]} />
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteTodo(item.id)}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            {item.description ? (
              <Text style={[styles.todoDescription, item.completed && styles.todoDescriptionCompleted]}>{item.description}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
      style={styles.todoList}
      showsVerticalScrollIndicator={false}
    />

    {/* Floating Button */}
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.floatingButtonText}>+</Text>
    </TouchableOpacity>
      <Modal
        visible = {modal_visible}
        animationType = "fade"
        transparent = {true}
      >
        <View style = {styles.modalOverlay}>
          <View style = {styles.modalContent}>
            <TextInput
              style = {styles.modalInput}
              placeholder = "Task"
              placeholderTextColor = "#A8A8A8"
              value = {input_text}
              onChangeText = {setInputText}
            />

            {warningMessage ?(
              <View style = {styles.warningPill}>
                <Text style = {styles.warningText}>{warningMessage}</Text>
              </View>
            ): null}

            <TextInput
              style = {styles.modalInputDescription}
              placeholder = "Description"
              placeholderTextColor = "#A8A8A8"
              value = {input_text_desc}
              onChangeText = {setInputDescText}
            />

            <Text style = {styles.modalPriority}>Priority</Text>
            <View style = {styles.priorityContainer}>
              <TouchableOpacity
                style={[
                  styles.priorityButton, 
                  selected_priority == 'high' && styles.priorityButtonSelected
                ]}
                onPress = {() => setSelectedPriority('high')}
              >
                <View style = {[styles.priorityDot, {backgroundColor: '#B85450'}]} />
                <Text style = {[
                  styles.priorityText,
                  selected_priority == 'high' && styles.priorityTextSelected
                ]}>High</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton, 
                  selected_priority == 'medium' && styles.priorityButtonSelected
                ]}
                onPress = {() => setSelectedPriority('medium')}
              >
                <View style = {[styles.priorityDot, {backgroundColor: '#D4A574'}]} />
                <Text style = {[
                  styles.priorityText,
                  selected_priority == 'medium' && styles.priorityTextSelected
                ]}>Medium</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.priorityButton, 
                  selected_priority == 'low' && styles.priorityButtonSelected
                ]}
                onPress = {() => setSelectedPriority('low')}
              >
                <View style = {[styles.priorityDot, {backgroundColor: '#A8A8A8'}]} />
                <Text style = {[
                  styles.priorityText,
                  selected_priority == 'low' && styles.priorityTextSelected
                ]}>Low</Text>
              </TouchableOpacity>

            </View>

            <View style = {styles.modalButtons}>
              <TouchableOpacity
                style = {styles.cancelButton}
                onPress = {() => setModalVisible(false)}
              >
                <Text style = {styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style = {styles.addButton}
                onPress = {addTodo}
              >
                <Text style = {styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  </View>
  )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#A8A8A8',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputSection: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#A8A8A8',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#424242',
    backgroundColor: '#FEFCFC'
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
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  },
  modalContent: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalInput: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#424242',
    backgroundColor: '#FEFCFC',
    marginBottom: 15,
  },
  modalInputDescription: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#424242',
    backgroundColor: '#FEFCFC',
    marginBottom: 25,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#FEFCFC',
  },
  cancelButtonText: {
    color: '#A8A8A8',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#424242',
    borderRadius: 12,
    padding: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FEFCFC',
    fontSize: 16,
    fontWeight: '600',
  },
  modalPriority: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#FEFCFC',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 40,
  },
  priorityButtonSelected: {
    backgroundColor: '#424242',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A8A8A8',
  },
  priorityTextSelected: {
    color: '#FEFCFC',
    fontWeight: '600',
  },
  warningPill: {
    backgroundColor: '#B85450',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 15,
  },
  warningText: {
    color: '#FEFCFC',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  todoList: {
    flex: 1,
    marginBottom: 100, // Space for floating button
  },
  todoItem: {
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
  todoDescription: {
    fontSize: 14,
    color: '#A8A8A8',
    lineHeight: 20,
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
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    color: '#B85450',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
