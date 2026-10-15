import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const [showThinking, setShowThinking] = useState(false);
  const isUser = message.sender === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.agentContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.agentBubble,
        ]}
      >
        {message.thinking && (
          <View style={styles.thinkingWrapper}>
            <TouchableOpacity
              onPress={() => setShowThinking(!showThinking)}
              style={styles.thinkingHeader}
              activeOpacity={0.7}
            >
              <Text style={styles.thinkingTitle}>
                {showThinking ? '▼ Hide Agent Reasoning' : '▶ View Agent Reasoning'}
              </Text>
            </TouchableOpacity>

            {showThinking && (
              <View style={styles.thinkingContent}>
                <Text style={styles.thinkingText}>{message.thinking}</Text>
              </View>
            )}
          </View>
        )}

        {message.content ? (
          <Text style={isUser ? styles.userText : styles.agentText}>
            {message.content}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  agentContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: '#1f2937',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
  },
  agentText: {
    color: '#f3f4f6',
    fontSize: 15,
    lineHeight: 22,
  },
  thinkingWrapper: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 6,
  },
  thinkingHeader: {
    paddingVertical: 2,
  },
  thinkingTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  thinkingContent: {
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  thinkingText: {
    color: '#9ca3af',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

