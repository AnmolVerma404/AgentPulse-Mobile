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
import { useAgentKeepAwake } from './src/hooks/useAgentKeepAwake';
import { useCompletionAlert } from './src/hooks/useCompletionAlert';
import { AgentStatusBar } from './src/components/AgentStatusBar';
import { ChatMessageBubble } from './src/components/ChatMessageBubble';
import { ToolApprovalCard } from './src/components/ToolApprovalCard';
import { CompletionBanner } from './src/components/CompletionBanner';
import { PromptBar } from './src/components/PromptBar';
import { ConnectionModal } from './src/components/ConnectionModal';
import { loadConnectionSettings, saveConnectionSettings } from './src/services/storage';

export default function App() {
  const [serverUrl, setServerUrl] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [keepAwakeEnabled, setKeepAwakeEnabled] = useState(true);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Load saved pairing credentials on initial mount
  useEffect(() => {
    async function initSettings() {
      const saved = await loadConnectionSettings();
      if (saved.serverUrl) {
        setServerUrl(saved.serverUrl);
      }
      if (saved.sessionToken) {
        setSessionToken(saved.sessionToken);
      }
      setKeepAwakeEnabled(saved.keepAwakeEnabled);
    }
    initSettings();
  }, []);

  const {
    isConnected,
    isConnecting,
    status,
    messages,
    pendingApproval,
    connect,
  } = useAgentSocket({
    url: serverUrl,
    token: sessionToken,
    autoConnect: false,
  });

  // Activate screen keep-awake assertions while agent is actively working
  useAgentKeepAwake({ status, enabled: keepAwakeEnabled });

  // Trigger haptic and vibration alert when agent completes turn
  useCompletionAlert({
    status,
    onDone: () => setShowCompletionBanner(true),
  });

  const handleSaveConnection = (newUrl: string, newToken: string, keepAwake: boolean) => {
    setServerUrl(newUrl);
    setSessionToken(newToken);
    setKeepAwakeEnabled(keepAwake);
    saveConnectionSettings(newUrl, newToken, keepAwake);
  };

  useEffect(() => {
    if (serverUrl && sessionToken) {
      connect();
    }
  }, [serverUrl, sessionToken, connect]);

  useEffect(() => {
    if (status === 'thinking' || status === 'running_tool') {
      setShowCompletionBanner(false);
    }
  }, [status]);

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

      {/* Task Completion Alert Banner */}
      <CompletionBanner
        visible={showCompletionBanner}
        onDismiss={() => setShowCompletionBanner(false)}
      />

      {/* Read-Only Tool Execution Indicator */}
      {pendingApproval && (
        <ToolApprovalCard tool={pendingApproval} />
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

      {/* Read-Only Status Footer */}
      <PromptBar isConnected={isConnected} />

      {/* Connection & Pairing Configuration Modal */}
      <ConnectionModal
        visible={isModalOpen}
        currentUrl={serverUrl}
        currentToken={sessionToken}
        keepAwakeEnabled={keepAwakeEnabled}
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
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
