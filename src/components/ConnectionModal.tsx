import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';

interface ConnectionModalProps {
  visible: boolean;
  currentUrl: string;
  currentToken: string;
  keepAwakeEnabled?: boolean;
  onSave: (url: string, token: string, keepAwake: boolean) => void;
  onClose: () => void;
}

/**
 * Parses a combined connection URI (e.g. ws://192.168.0.104:49152?token=abcdef)
 * into its base WebSocket URL and session token components.
 */
export function parseConnectionUri(rawUri: string): { url: string; token: string } {
  const trimmed = rawUri.trim();
  if (!trimmed) {
    return { url: '', token: '' };
  }

  if (trimmed.includes('?token=')) {
    const [baseUrl, queryToken] = trimmed.split('?token=');
    return {
      url: baseUrl.trim(),
      token: (queryToken || '').trim(),
    };
  }

  return {
    url: trimmed,
    token: '',
  };
}

/**
 * Combines URL and token into a single connection URI string.
 */
export function formatConnectionUri(url: string, token: string): string {
  const cleanUrl = url.trim();
  const cleanToken = token.trim();
  if (!cleanUrl) return '';
  if (cleanUrl.includes('?token=')) return cleanUrl;
  if (!cleanToken) return cleanUrl;
  return `${cleanUrl}?token=${cleanToken}`;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  visible,
  currentUrl,
  currentToken,
  keepAwakeEnabled = true,
  onSave,
  onClose,
}) => {
  const [connectionUri, setConnectionUri] = useState(
    formatConnectionUri(currentUrl, currentToken)
  );
  const [keepAwake, setKeepAwake] = useState(keepAwakeEnabled);

  useEffect(() => {
    setConnectionUri(formatConnectionUri(currentUrl, currentToken));
    setKeepAwake(keepAwakeEnabled);
  }, [currentUrl, currentToken, keepAwakeEnabled, visible]);

  const handleSave = () => {
    const { url, token } = parseConnectionUri(connectionUri);
    onSave(url, token, keepAwake);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Pair with Desktop</Text>
          <Text style={styles.subtitle}>
            Paste the single connection URI copied from your desktop extension.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Connection URI</Text>
            <TextInput
              style={styles.input}
              placeholder="ws://192.168.x.x:49152?token=..."
              placeholderTextColor="#6b7280"
              value={connectionUri}
              onChangeText={setConnectionUri}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              selectTextOnFocus={true}
            />
            <Text style={styles.helperText}>
              Includes both workstation IP and ephemeral pairing token in one string.
            </Text>
          </View>

          <View style={styles.switchGroup}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Keep Screen Awake</Text>
              <Text style={styles.switchDescription}>
                Prevents display sleep while agent is actively working
              </Text>
            </View>
            <Switch
              value={keepAwake}
              onValueChange={setKeepAwake}
              trackColor={{ false: '#374151', true: '#2563eb' }}
              thumbColor={keepAwake ? '#60a5fa' : '#9ca3af'}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.connectBtn} onPress={handleSave}>
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    lineHeight: 16,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cancelText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  connectBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  connectText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
