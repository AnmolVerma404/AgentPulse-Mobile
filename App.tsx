import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useAgentSocket } from './src/hooks/useAgentSocket';
import { AgentStatusBar } from './src/components/AgentStatusBar';
import { ChatMessageBubble } from './src/components/ChatMessageBubble';
import { ToolApprovalCard } from './src/components/ToolApprovalCard';
import { PromptBar } from './src/components/PromptBar';
import { ConnectionModal } from './src/components/ConnectionModal';

export default function App() {
  const [serverUrl, setServerUrl] = useState('ws://127.0.0.1:49152');
  const [sessionToken, setSessionToken] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const {
    isConnected,
    isConnecting,
    status,
    messages,
    pendingApproval,
    connect,
    approveTool,
    denyTool,
    sendPrompt,
  } = useAgentSocket({
    url: serverUrl,
    token: sessionToken,
    autoConnect: false,
  });

  const handleSaveConnection = (newUrl: string, newToken: string) => {
    setServerUrl(newUrl);
    setSessionToken(newToken);
  };

  useEffect(() => {
    if (serverUrl && sessionToken) {
      connect();
    }
  }, [serverUrl, sessionToken, connect]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>AgentPulse</Text>
          <Text style={styles.brandSubtitle}>Mobile Companion</Text>
        </View>

        <TouchableOpacity
          style={styles.pairButton}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.pairButtonText}>
            {isConnected ? 'Settings' : 'Pair'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Agent & Connection Status */}
      <AgentStatusBar
        status={status}
        isConnected={isConnected}
        isConnecting={isConnecting}
      />

      {/* Interactive Tool Approval Card */}
      {pendingApproval && (
        <ToolApprovalCard
          tool={pendingApproval}
          onApprove={approveTool}
          onDeny={denyTool}
        />
      )}

      {/* Chat Transcript Feed */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatMessageBubble message={item} />}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {isConnected ? 'Awaiting Agent Activity' : 'Not Connected'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isConnected
                ? 'Prompts and responses from your desktop will stream here live.'
                : 'Tap "Pair" in the top-right corner to connect to your desktop session.'}
            </Text>
          </View>
        }
      />

      {/* Prompt Input Bar */}
      <PromptBar onSend={sendPrompt} disabled={!isConnected} />

      {/* Connection & Pairing Configuration Modal */}
      <ConnectionModal
        visible={isModalOpen}
        currentUrl={serverUrl}
        currentToken={sessionToken}
        onSave={handleSaveConnection}
        onClose={() => setIsModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  pairButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pairButtonText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '600',
  },
  chatList: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 120,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
