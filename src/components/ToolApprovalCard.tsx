import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ToolCallRequest } from '../types';

interface ToolApprovalCardProps {
  tool: ToolCallRequest;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

export const ToolApprovalCard: React.FC<ToolApprovalCardProps> = ({
  tool,
  onApprove,
  onDeny,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚠️ Tool Permission Required</Text>
      </View>

      <Text style={styles.toolName}>{tool.toolName}</Text>
      <Text style={styles.commandPreview} numberOfLines={4}>
        {tool.commandOrArgs}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.denyButton]}
          onPress={() => onDeny(tool.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.denyText}>Deny</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => onApprove(tool.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  toolName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  commandPreview: {
    color: '#d1d5db',
    fontSize: 13,
    fontFamily: 'monospace',
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  denyButton: {
    backgroundColor: '#374151',
  },
  approveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  denyText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
});

