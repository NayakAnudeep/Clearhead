import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { defaultCategories } from '@/constants/categories';

interface TaskModalProps {
  visible: boolean;
  title: string;
  buttonText: string;
  inputText: string;
  inputDescText: string;
  selectedPriority: 'high' | 'medium' | 'low';
  selectedCategory: string;
  warningMessage: string;
  showCategoryDropdown: boolean;
  onTextChange: (text: string) => void;
  onDescChange: (text: string) => void;
  onPriorityChange: (priority: 'high' | 'medium' | 'low') => void;
  onCategoryChange: (category: string) => void;
  onToggleCategoryDropdown: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function TaskModal({ 
  visible, 
  title, 
  buttonText, 
  inputText, 
  inputDescText, 
  selectedPriority,
  selectedCategory,
  warningMessage,
  showCategoryDropdown,
  onTextChange, 
  onDescChange, 
  onPriorityChange,
  onCategoryChange,
  onToggleCategoryDropdown,
  onSubmit, 
  onCancel 
}: TaskModalProps) {

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <Animated.View entering={SlideInDown} exiting={SlideOutUp} style={styles.modalContent}>
          <TextInput
            style={styles.modalInput}
            placeholder="Task"
            placeholderTextColor="#A8A8A8"
            value={inputText}
            onChangeText={onTextChange}
          />

          {warningMessage ? (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.warningPill}>
              <Text style={styles.warningText}>{warningMessage}</Text>
            </Animated.View>
          ) : null}

          <TextInput
            style={styles.modalInputDescription}
            placeholder="Description"
            placeholderTextColor="#A8A8A8"
            value={inputDescText}
            onChangeText={onDescChange}
            multiline
          />

          <Text style={styles.modalLabel}>Priority</Text>
          <View style={styles.priorityContainer}>
            {['high', 'medium', 'low'].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton, 
                  selectedPriority === priority && styles.priorityButtonSelected
                ]}
                onPress={() => onPriorityChange(priority as 'high' | 'medium' | 'low')}
              >
                <View style={[styles.priorityDot, {
                  backgroundColor: priority === 'high' ? '#B85450' : 
                                 priority === 'medium' ? '#D4A574' : '#A8A8A8' 
                }]} />
                <Text style={[
                  styles.priorityText,
                  selectedPriority === priority && styles.priorityTextSelected
                ]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalLabel}>Category</Text>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={onToggleCategoryDropdown}
          >
            <Text style={styles.dropdownText}>
              {selectedCategory || 'Select category'}
            </Text>
            <Text style={styles.dropdownArrow}>{showCategoryDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.dropdown}>
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  onCategoryChange('');
                  onToggleCategoryDropdown();
                }}
              >
                <Text style={styles.dropdownItemText}>None</Text>
              </TouchableOpacity>
              {defaultCategories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onCategoryChange(category.name);
                    onToggleCategoryDropdown();
                  }}
                >
                  <View style={styles.categoryOptionContainer}>
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text style={styles.dropdownItemText}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
              <Text style={styles.addButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  modalLabel: {
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
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A8A8A8',
    marginLeft: 6,
  },
  priorityTextSelected: {
    color: '#FEFCFC',
    fontWeight: '600',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  dropdownButton: {
    backgroundColor: '#FEFCFC',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#424242',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#A8A8A8',
  },
  dropdown: {
    backgroundColor: '#FEFCFC',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#424242',
  },
  categoryOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
});