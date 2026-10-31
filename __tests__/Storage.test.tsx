import * as SecureStore from 'expo-secure-store';
import { saveConnectionSettings, loadConnectionSettings } from '../src/services/storage';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));

describe('Storage service (expo-secure-store)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves connection settings to SecureStore correctly', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

    await saveConnectionSettings('ws://192.168.1.100:49152', 'token-12345', true);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('agentpulse_server_url', 'ws://192.168.1.100:49152');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('agentpulse_session_token', 'token-12345');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('agentpulse_keep_awake', 'true');
  });

  it('loads saved connection settings from SecureStore', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
      if (key === 'agentpulse_server_url') return Promise.resolve('ws://192.168.1.100:49152');
      if (key === 'agentpulse_session_token') return Promise.resolve('token-12345');
      if (key === 'agentpulse_keep_awake') return Promise.resolve('false');
      return Promise.resolve(null);
    });

    const settings = await loadConnectionSettings();

    expect(settings).toEqual({
      serverUrl: 'ws://192.168.1.100:49152',
      sessionToken: 'token-12345',
      keepAwakeEnabled: false,
    });
  });

  it('defaults keepAwakeEnabled to true when null or unconfigured', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const settings = await loadConnectionSettings();

    expect(settings).toEqual({
      serverUrl: null,
      sessionToken: null,
      keepAwakeEnabled: true,
    });
  });

  it('handles SecureStore exceptions gracefully on load', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Hardware Keystore unavailable'));

    const settings = await loadConnectionSettings();

    expect(settings).toEqual({
      serverUrl: null,
      sessionToken: null,
      keepAwakeEnabled: true,
    });
  });

  it('handles SecureStore exceptions gracefully on save', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('Write permission denied'));

    await expect(saveConnectionSettings('ws://localhost:49152', 'tok', false)).resolves.not.toThrow();
  });
});
