import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onClearAllTasks: () => void;
  onShowTutorial?: () => void;
}

export default function SettingsModal({ visible, onClose, onClearAllTasks, onShowTutorial }: SettingsModalProps) {
  const handleClearAllTasks = () => {
    onClearAllTasks();
    onClose();
  };

  const handleShowTutorial = () => {
    if (onShowTutorial) {
      onShowTutorial();
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created by</Text>
                <Text style={styles.infoValue}>ClearHead Team</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Actions</Text>
              {onShowTutorial && (
                <TouchableOpacity style={styles.tutorialButton} onPress={handleShowTutorial}>
                  <Text style={styles.tutorialButtonText}>View Tutorial</Text>
                  <Text style={styles.actionButtonSubtext}>Learn about swipe gestures</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionButton} onPress={handleClearAllTasks}>
                <Text style={styles.actionButtonText}>Clear All Tasks</Text>
                <Text style={styles.actionButtonSubtext}>This action cannot be undone</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Usage Tips</Text>
              <View style={styles.tipContainer}>
                <Text style={styles.tipText}>• Swipe right on home screen to open settings</Text>
                <Text style={styles.tipText}>• Swipe up on home screen to see all tasks</Text>
                <Text style={styles.tipText}>• Swipe right on tasks to mark as complete</Text>
                <Text style={styles.tipText}>• Swipe left on tasks to delete</Text>
                <Text style={styles.tipText}>• Tap tasks to edit them</Text>
                <Text style={styles.tipText}>• In all tasks view, drag tasks up/down to change priority</Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    marginLeft: 60,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#424242',
  },
  infoValue: {
    fontSize: 16,
    color: '#A8A8A8',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#FEFCFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#B85450',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B85450',
    textAlign: 'center',
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#A8A8A8',
    textAlign: 'center',
    marginTop: 4,
  },
  tutorialButton: {
    backgroundColor: '#FEFCFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#424242',
  },
  tutorialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
  },
  tipContainer: {
    backgroundColor: '#FEFCFC',
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
    marginBottom: 8,
  },
});