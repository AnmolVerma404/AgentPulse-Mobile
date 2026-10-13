# Coding Standards & Quality Guidelines (Mobile App)

1. **TypeScript Strictness:** Strict mode (`"strict": true`) is enforced. Avoid `any`; use strongly-typed contracts for all components, hooks, and services.
2. **Component Modularity:**
   - Keep files small and focused (< 250 lines).
   - Separate UI presentation (`src/components/`) from state and business logic (`src/hooks/`).
3. **Automated Testing:**
   - Every screen, hook, and core service must have corresponding tests in `__tests__/`.
   - Never commit code that breaks `npm test`.
4. **Offline & Connection Resilience:**
   - Always handle disconnected and reconnecting WebSocket states gracefully with clear user feedback.
5. **No Telemetry / No Tracking:**
   - Never inject analytics or remote logging libraries that could capture user prompts, tokens, or chat content.

---

## ⚡ TL;DR

* Strict TypeScript, modular components (< 250 lines), zero `any`.
* Tests required for all hooks and screens (`npm test`).
* Zero telemetry or external analytics; full offline/reconnect resiliency.

