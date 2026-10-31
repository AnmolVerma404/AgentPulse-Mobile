import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PromptBarProps {
  isConnected?: boolean;
}

export const PromptBar: React.FC<PromptBarProps> = ({ isConnected = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={[styles.dot, isConnected ? styles.dotConnected : styles.dotDisconnected]} />
        <Text style={styles.statusText}>
          {isConnected
            ? 'Monitoring active session · Return to desk to steer'
            : 'Disconnected · Tap "Pair" in header to connect'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dotConnected: {
    backgroundColor: '#10b981',
  },
  dotDisconnected: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
});
