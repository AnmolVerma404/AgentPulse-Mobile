# AGENTS.md - Mobile App Context Cache & Engineering Guidelines

> **Repository:** AgentPulse Mobile (`agentpulse-mobile`)  
> **Tech Stack:** React Native 0.86+ | Expo 57+ | TypeScript (strict) | Jest + RTL

---

## 1. Core Principles & Non-Negotiables

* **Zero-Server / Standalone:** We do NOT run a central database or store user chats, prompts, or code on our servers. The app communicates directly with the desktop daemon or official OAuth APIs.
* **Security & Privacy First:** Tokens (GitHub, Google, pairing keys) are stored in the device's hardware enclave (`expo-secure-store` / iOS Keychain / Android Keystore) and never logged or exfiltrated.
* **Token Optimization for AI Agents:**
  * Read existing skills in `.agents/skills/expo-mobile-dev/SKILL.md` before writing code.
  * Keep files modular and concise (< 250 lines per file).
  * Run tests (`npm test`) before declaring tasks done.

---

## 2. Directory Layout

```
./
├── .agents/                      # AI Agent Skills & Rules
│   ├── rules/
│   │   ├── coding-standards.md   # TypeScript & React Native standards
│   │   └── security.md           # SecureStore & privacy rules
│   └── skills/
│       └── expo-mobile-dev/      # Expo & React Native engineering skill
├── assets/                       # App icons, splash screens, fonts
├── src/
│   ├── components/               # Reusable UI components
│   ├── hooks/                    # Custom React hooks (useAgentSocket, etc.)
│   ├── screens/                  # App screens (ChatScreen, PairingScreen, SettingsScreen)
│   ├── services/                 # SecureStoreService, WebSocketClient
│   ├── theme/                    # Colors, typography, spacing
│   └── types/                    # Core TypeScript domain models (AgentEvent, SessionState)
├── __tests__/                    # Unit and component tests
├── App.tsx                       # Root application component
├── app.json                      # Expo application manifest
├── package.json
└── tsconfig.json
```

---

## 3. Expo & React Native Commands

```bash
npx expo start              # Start the local Metro dev server
npx expo start --android    # Launch on Android emulator / connected device
npx expo start --ios        # Launch on iOS simulator
npx expo start --web        # Launch in web browser
npm test                    # Run Jest test suite
npx tsc --noEmit            # Typecheck
```

---

## 4. Skills & Fast Reference

* **Expo Development Playbook:** See `.agents/skills/expo-mobile-dev/SKILL.md`
* **Coding Standards:** See `.agents/rules/coding-standards.md`
* **Security & Token Storage:** See `.agents/rules/security.md`

---

## ⚡ TL;DR

* Standalone mobile client connecting directly via WebSocket / OAuth; zero server storage.
* Tokens stored strictly in `expo-secure-store` (Keychain / Keystore).
* React Native 0.86 + Expo 57 with TypeScript strict mode and Jest tests.
