import * as SecureStore from 'expo-secure-store';

const KEY_SERVER_URL = 'agentpulse_server_url';
const KEY_SESSION_TOKEN = 'agentpulse_session_token';
const KEY_KEEP_AWAKE = 'agentpulse_keep_awake';

export interface SavedConnectionSettings {
  serverUrl: string | null;
  sessionToken: string | null;
  keepAwakeEnabled: boolean;
}

/**
 * Persists pairing credentials and settings in device hardware keychain / keystore.
 */
export async function saveConnectionSettings(
  serverUrl: string,
  sessionToken: string,
  keepAwakeEnabled: boolean
): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY_SERVER_URL, serverUrl);
    await SecureStore.setItemAsync(KEY_SESSION_TOKEN, sessionToken);
    await SecureStore.setItemAsync(KEY_KEEP_AWAKE, keepAwakeEnabled ? 'true' : 'false');
  } catch {
    // Graceful fallback for environments where SecureStore is unavailable
  }
}

/**
 * Retrieves previously saved pairing credentials and settings from secure storage.
 */
export async function loadConnectionSettings(): Promise<SavedConnectionSettings> {
  try {
    const serverUrl = await SecureStore.getItemAsync(KEY_SERVER_URL);
    const sessionToken = await SecureStore.getItemAsync(KEY_SESSION_TOKEN);
    const keepAwakeVal = await SecureStore.getItemAsync(KEY_KEEP_AWAKE);

    return {
      serverUrl: serverUrl || null,
      sessionToken: sessionToken || null,
      keepAwakeEnabled: keepAwakeVal === null ? true : keepAwakeVal === 'true',
    };
  } catch {
    return {
      serverUrl: null,
      sessionToken: null,
      keepAwakeEnabled: true,
    };
  }
}
