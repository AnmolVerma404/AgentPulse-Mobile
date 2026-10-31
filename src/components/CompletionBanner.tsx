import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CompletionBannerProps {
  visible: boolean;
  onDismiss: () => void;
}

export const CompletionBanner: React.FC<CompletionBannerProps> = ({
  visible,
  onDismiss,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>🎉</Text>
          <Text style={styles.title}>Task Completed</Text>
        </View>
        <Text style={styles.description}>
          The agent has finished this turn. Return to your workstation to review results and steer the next task.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.dismissButton}
        onPress={onDismiss}
        activeOpacity={0.7}
      >
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#064e3b',
    borderWidth: 1,
    borderColor: '#10b981',
    flexDirection: 'column',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#34d399',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 13,
    color: '#d1fae5',
    lineHeight: 18,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#047857',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  dismissText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

