# Security & Privacy Rules (Mobile App)

1. **Zero-Server / Standalone:**
   - The mobile app communicates directly with the local desktop daemon or official OAuth APIs.
   - We do not run any central database storing user chats, prompts, or code.
2. **Credential Storage:**
   - Tokens (GitHub, Google, pairing keys) must STRICTLY be stored using `expo-secure-store` (backed by iOS Keychain and Android Keystore).
   - NEVER store tokens or sensitive data in `AsyncStorage`, `localStorage`, or unencrypted files.
3. **Network Security:**
   - All external connections must use TLS/WSS.
   - For local connections, validate session tokens on every WebSocket handshake.
4. **Code Privacy:**
   - The app only renders chat streams, diff summaries, and tool approval banners. It never requests or stores full codebase repository files.

---

## ⚡ TL;DR

* Credentials stored strictly in `expo-secure-store` (Hardware Keychain / Keystore).
* Zero custom backend database; zero chat storage.
* TLS/WSS only; no full repo files downloaded.

