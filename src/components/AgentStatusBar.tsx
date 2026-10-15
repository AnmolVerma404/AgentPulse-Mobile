import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AgentExecutionStatus } from '../types';

interface AgentStatusBarProps {
  status: AgentExecutionStatus;
  isConnected: boolean;
  isConnecting: boolean;
}

export const AgentStatusBar: React.FC<AgentStatusBarProps> = ({
  status,
  isConnected,
  isConnecting,
}) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'thinking':
        return { label: 'Thinking...', bg: '#3b82f6', text: '#ffffff' };
      case 'running_tool':
        return { label: 'Running Tool', bg: '#8b5cf6', text: '#ffffff' };
      case 'waiting_approval':
        return { label: 'Approval Required', bg: '#f59e0b', text: '#000000' };
      case 'done':
        return { label: 'Task Complete', bg: '#10b981', text: '#ffffff' };
      case 'error':
        return { label: 'Error Occurred', bg: '#ef4444', text: '#ffffff' };
      case 'idle':
      default:
        return { label: 'Agent Idle', bg: '#374151', text: '#d1d5db' };
    }
  };

  const statusConfig = getStatusDetails();

  return (
    <View style={styles.container}>
      <View style={styles.connectionWrapper}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isConnected
                ? '#10b981'
                : isConnecting
                ? '#f59e0b'
                : '#ef4444',
            },
          ]}
        />
        <Text style={styles.connectionText}>
          {isConnected
            ? 'Connected'
            : isConnecting
            ? 'Connecting...'
            : 'Disconnected'}
        </Text>
      </View>

      <View style={[styles.badge, { backgroundColor: statusConfig.bg }]}>
        <Text style={[styles.badgeText, { color: statusConfig.text }]}>
          {statusConfig.label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  connectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

