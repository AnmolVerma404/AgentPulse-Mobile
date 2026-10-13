# AgentPulse Mobile (`agentpulse-mobile`)

> Modern, privacy-first mobile companion for supervising and steering AI coding assistants (**Google Antigravity**, **GitHub Copilot**, **Cursor**) while away from your desk (AFK).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-57-black.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61dafb.svg)](https://reactnative.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📱 Overview

When developers fire off long-running prompts in modern AI coding agents, they frequently step away from their desks. **AgentPulse Mobile** bridges your phone directly to your desktop development session:

* **Live Stream Chat & Reasoning:** Read the agent's real-time thoughts, status changes, and code diff summaries.
* **Lock-Screen Push Alerts:** Instant high-priority alerts when tasks complete, errors occur, or interactive permissions are required.
* **One-Tap Approvals:** Approve or deny command executions (`npm test`, `git push`, file edits) right from your phone.
* **Direct Follow-Up Prompts:** Steer the next iteration via text or native voice dictation.
* **Zero Cloud Storage:** Standalone client architecture. Sensitive tokens are stored in your device's hardware enclave (iOS Keychain / Android Keystore); no chats or code are ever sent to third-party databases.

---

## 🛠️ Tech Stack

* **Framework:** React Native 0.86+ with Expo 57+
* **Language:** TypeScript (Strict Mode)
* **Storage:** `expo-secure-store` (Hardware Keychain / Keystore)
* **Networking:** Native WebSockets (Direct LAN / Tunnel)
* **Testing:** Jest + `@testing-library/react-native` + `jest-expo`

---

## 🚀 Getting Started

### Prerequisites
* Node.js 20+ installed
* Android phone (or emulator) or iPhone with **Expo Go** installed (free on App Store)

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Running the Development Server
```bash
# Start Metro bundler
npx expo start
```

### 3. Launching on Devices
* **Android:** Press <kbd>a</kbd> in terminal or run `npx expo start --android`.
* **iOS (Development):** Open the **Expo Go** app on your iPhone and scan the terminal QR code, or run via iOS Developer Mode.
* **Web:** Press <kbd>w</kbd> in terminal or run `npx expo start --web`.

---

## 🧪 Testing & Quality Assurance

QA is built into the development cycle from day one:

```bash
# Run unit and component test suite
npm test

# Run TypeScript type check
npx tsc --noEmit
```

---

## 📁 Repository Structure

```
./
├── assets/                  # App icons, splash screens, assets
├── src/
│   ├── components/          # Reusable UI widgets (ChatBubble, ActionButton, StatusBar)
│   ├── hooks/               # Custom hooks (useAgentSocket, useSession)
│   ├── screens/             # App screens (ChatScreen, PairingScreen, SettingsScreen)
│   ├── services/            # SecureStoreService, WebSocketClient
│   ├── theme/               # Dark mode color palette, typography, spacing
│   └── types/               # TypeScript models (AgentEvent, SessionState)
├── __tests__/               # Test suite
├── App.tsx                  # Root app entrypoint
├── app.json                 # Expo configuration
├── AGENTS.md                # AI Agent guidelines & context cache
└── package.json
```

---

## 🔒 Security Architecture

1. **Hardware Enclave:** All authentication tokens and pairing keys are encrypted at rest using `expo-secure-store`.
2. **Zero CORS:** Mobile apps use OS-level sockets (`NSURLSession` / `OkHttp`), eliminating the browser CORS barrier and allowing direct client-to-API communication without an intermediate proxy.
3. **No Codebase Exposure:** The app only receives chat messages and tool descriptions; full repository source files are never downloaded to the phone.

---

## 🗺️ Platform & Distribution Roadmap

* **Android:** Initial open-source release with standalone APKs and Google Play Store distribution.
* **iOS:** Accessible during development via **Expo Go** and **iOS Developer Mode**; an official Apple App Store release is planned as the project matures.
* **Web:** Can be exported as a standalone web app via `npx expo export -p web`.

---

## 🤝 Contributing

We welcome open-source contributions! Before opening a pull request:
1. Run `npm test` and ensure all tests pass.
2. Ensure new features are documented and tested.
3. Follow the guidelines in [AGENTS.md](AGENTS.md) and [.agents/rules/coding-standards.md](.agents/rules/coding-standards.md).

---

## ⚡ TL;DR

* **What it is:** React Native + Expo mobile app to monitor, approve, and steer desktop AI coding agents while AFK.
* **iOS Support:** Available via Expo Go and iOS Developer Mode for local testing, with an official App Store release planned as the project matures.
* **Security:** Zero server data storage; tokens stored strictly in hardware Keychain / Keystore.
* **Run:** `npm install && npx expo start`. Run tests with `npm test`.

