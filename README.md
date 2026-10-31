# AgentPulse Mobile (`agentpulse-mobile`)

> Modern, privacy-first mobile companion for supervising AI coding assistants (**Google Antigravity**) while away from your desk (AFK) on your local Wi-Fi network.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-57-black.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61dafb.svg)](https://reactnative.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📱 Overview

When developers fire off long-running prompts in modern AI coding agents, they frequently step away from their desks. **AgentPulse Mobile** bridges your phone directly to your desktop development session over local Wi-Fi:

* **Live Stream Chat & Reasoning:** Read the agent's real-time thoughts, stream chunks, and executing tool calls.
* **Instant Completion Alerts:** Receive haptic pulses, vibration patterns, and a prominent banner when the agent completes its turn (`status: 'done'`), signaling that it is time to return to your desk.
* **Screen Keep-Awake:** Prevents iOS and Android from sleeping the display and suspending the WebSocket connection while the agent is actively `'thinking'` or `'running_tool'`.
* **Persistent Hardware Security:** Uses `expo-secure-store` to safely remember your LAN server URL, pairing token, and settings in your device's hardware enclave (iOS Keychain / Android Keystore) so you never need to re-type pairing details on every launch.
* **Automatic History Hydration:** Pulls recent conversation history on initial handshake (`INIT_SESSION`) so reconnecting never leaves you with an empty screen.
* **Zero Cloud Storage:** Direct device-to-workstation architecture over LAN. No prompts, code, or tokens are ever uploaded to cloud servers.

---

## 🛠️ Tech Stack

* **Framework:** React Native 0.86+ with Expo 57+
* **Language:** TypeScript (Strict Mode)
* **Storage:** `expo-secure-store` (Hardware Keychain / Keystore)
* **Display & Alerts:** `expo-keep-awake`, `expo-haptics`
* **Networking:** Native WebSockets
* **Testing:** Jest + `@testing-library/react-native` + `jest-expo`

---

## 🚀 Getting Started

### Prerequisites
* Node.js 20+ installed
* Workstation and mobile phone connected to the **same local Wi-Fi router**
* Android phone (or emulator) or iPhone with **Expo Go** installed (free on App Store / Google Play)

### 1. Installation
```bash
# Navigate to mobile app directory
cd app

# Install dependencies
npm install
```

### 2. Running the Development Server
```bash
# Start Metro bundler
npx expo start
```

### 3. Launching on Devices
* **Physical iPhone / Android:** Open camera or the **Expo Go** app and scan the QR code displayed in your terminal.
* **Android Emulator:** Press <kbd>a</kbd> in terminal or run `npx expo start --android`.
* **iOS Simulator:** Press <kbd>i</kbd> in terminal or run `npx expo start --ios`.
* **Web (Testing):** Press <kbd>w</kbd> in terminal.

### 4. Pairing with Desktop
1. In the mobile app, tap **Pair** (or **Settings**) in the top-right corner.
2. Enter your workstation's LAN WebSocket URI (e.g., `ws://192.168.1.104:49152`) and the session token shown in your VS Code extension.
3. Tap **Connect**. The app saves your credentials to hardware secure storage and immediately displays live session status and recent history.

---

## 🧪 Testing & Quality Assurance

```bash
# Run unit and component test suites (22 tests)
npm test -- --watchAll=false

# Run TypeScript type check
npx tsc --noEmit
```

---

## 📁 Repository Structure

```
./
├── assets/                  # App icons and splash screens
├── src/
│   ├── components/          # AgentStatusBar, ChatMessageBubble, CompletionBanner, ConnectionModal, PromptBar, ToolApprovalCard
│   ├── hooks/               # useAgentSocket, useAgentKeepAwake, useCompletionAlert
│   ├── services/            # storage.ts (expo-secure-store wrapper)
│   └── types/               # TypeScript models (AgentExecutionStatus, ChatMessage, ToolCallRequest)
├── __tests__/               # Jest test suites (App, Components, KeepAwake, CompletionAlert, Storage)
├── App.tsx                  # Root application entrypoint
├── app.json                 # Expo configuration & plugins
├── AGENTS.md                # AI Agent guidelines & context cache
└── plan.md                  # Development roadmap and step checklist
```

---

## 🔒 Security Architecture

1. **Hardware Enclave:** All pairing tokens and host configurations are stored securely with `expo-secure-store`.
2. **Read-Only Inspection:** The mobile app acts strictly as an observation monitor. It cannot inject arbitrary commands or delete files on your workstation.
3. **No External Cloud:** All communication is direct peer-to-workstation over your private local area network (LAN).
