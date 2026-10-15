import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface ConnectionModalProps {
  visible: boolean;
  currentUrl: string;
  currentToken: string;
  onSave: (url: string, token: string) => void;
  onClose: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  visible,
  currentUrl,
  currentToken,
  onSave,
  onClose,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [token, setToken] = useState(currentToken);

  const handleSave = () => {
    onSave(url.trim(), token.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Pair with Desktop</Text>
          <Text style={styles.subtitle}>
            Enter the AgentPulse connection URI or host details from your VS Code extension.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Server WebSocket URI</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. ws://192.168.1.100:49152"
              placeholderTextColor="#6b7280"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Session Token</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste 256-bit ephemeral token"
              placeholderTextColor="#6b7280"
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
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
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  cancelText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  connectBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  connectText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

