import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToolCallRequest } from '../types';

interface ToolApprovalCardProps {
  tool: ToolCallRequest;
}

export const ToolApprovalCard: React.FC<ToolApprovalCardProps> = ({ tool }) => {
  const isApproval = !!tool.requiresApproval;

  return (
    <View style={[styles.card, isApproval ? styles.cardApproval : styles.cardExecuting]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isApproval ? styles.textApproval : styles.textExecuting]}>
          {isApproval ? '⚠️ Requires Desk Approval' : '⚙️ Tool Executing'}
        </Text>
      </View>

      <Text style={styles.toolName}>{tool.toolName}</Text>
      <Text style={styles.commandPreview} numberOfLines={4}>
        {tool.commandOrArgs}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>
          {isApproval
            ? 'Confirm or deny this action directly at your workstation.'
            : 'Running on desktop agent session...'}
        </Text>
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
    elevation: 3,
  },
  cardApproval: {
    borderColor: '#f59e0b',
  },
  cardExecuting: {
    borderColor: '#3b82f6',
  },
  header: {
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textApproval: {
    color: '#f59e0b',
  },
  textExecuting: {
    color: '#60a5fa',
  },
  toolName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  commandPreview: {
    color: '#d1d5db',
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  footer: {
    marginTop: 2,
  },
  footerNote: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
