---
name: expo-mobile-dev
description: Specialized engineering guidelines and quick patterns for building the React Native + Expo mobile companion.
---

# Expo & React Native Mobile Engineering Skill

## 1. Core Principles
* **Design System:** Mobile-first, dark-mode default, touch-optimized ergonomics.
* **Component Architecture:** Small, reusable components in `src/components/`. Business logic in custom hooks under `src/hooks/`.
* **Zero CORS & Zero Backend:** Network calls happen directly over native WebSockets or direct HTTPS calls to official OAuth providers.
* **Storage:** NEVER store authentication tokens in `AsyncStorage`. ALWAYS use `expo-secure-store` for tokens and keys.

## 2. Standard Directory Layout
```
./
├── assets/                  # Icons, splash screens, fonts
├── src/
│   ├── components/          # Reusable UI widgets (ChatBubble, StatusBar, ActionButton)
│   ├── hooks/               # useAgentSocket, useSession, useKeepAwake
│   ├── screens/             # ChatScreen, PairingScreen, SettingsScreen
│   ├── services/            # SecureStoreService, WebSocketClient
│   ├── theme/               # Colors, typography, spacing
│   └── types/               # AgentEvent, SessionState, ToolApproval
├── __tests__/               # Unit and component tests
├── App.tsx                  # Root app component with providers
├── app.json                 # Expo configuration
└── package.json
```

## 3. Testing Standard
* All UI components must have snapshot/render tests using `@testing-library/react-native`.
* All hooks (e.g. `useAgentSocket`) must have unit tests mocking WebSocket connections.
* Run tests with `npm test`.

## 4. Key Patterns

### Secure Token Storage Pattern
```typescript
import * as SecureStore from 'expo-secure-store';

export async function saveAuthToken(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getAuthToken(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}
```

### Direct Native WebSocket Hook Pattern
```typescript
import { useEffect, useRef, useState, useCallback } from 'react';

export function useAgentSocket(url: string, token: string) {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!url || !token) return;
    setStatus('connecting');
    const ws = new WebSocket(`${url}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setStatus('connected');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };
    ws.onclose = () => setStatus('disconnected');
    ws.onerror = () => setStatus('disconnected');
  }, [url, token]);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  return { status, messages, send: (data: any) => wsRef.current?.send(JSON.stringify(data)) };
}
```

---

## ⚡ TL;DR

* Use `expo-secure-store` for all credentials (never `AsyncStorage`).
* Direct native WebSockets for real-time streaming; no CORS restrictions.
* Test all components and hooks with `@testing-library/react-native` and Jest.

