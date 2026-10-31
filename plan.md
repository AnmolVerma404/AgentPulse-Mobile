# Implementation Plan - AgentPulse Mobile App (Read-Only Monitor)

> **Goal:** Transform the mobile companion into a clean, read-only session monitor and notification receiver that alerts developers when their desktop coding agent has completed a task.

---

## Technical Context & Scope
- **Pure Observation & Notification:** The mobile app displays agent progress, thoughts, and alerts when done. The developer returns to the desk to input new prompts or approve permissions.
- **Connection Scope (Case 1):** Directly connects via WebSocket to the workstation's local IP (`ws://192.168.x.x:49152?token=...`) on the home Wi-Fi.
- **Mobile OS Sleep Strategy:** Provide a "Keep Screen Awake" toggle to prevent iOS/Android from turning off the display and suspending the WebSocket connection while the agent is running.

---

## Proposed Phases & Steps

### Phase 1: Clean Up & Remove Legacy Write UI
* [x] **Step 1.1:** Deprecate interactive approval buttons in [`src/components/ToolApprovalCard.tsx`](file:///d:/Code/Personal_Projects/AI_Chat_To_App/app/src/components/ToolApprovalCard.tsx). Transform into a clean, read-only `ToolActivityCard` displaying currently executing tools (e.g., `Running command: pytest`).
* [x] **Step 1.2:** In [`src/components/PromptBar.tsx`](file:///d:/Code/Personal_Projects/AI_Chat_To_App/app/src/components/PromptBar.tsx) and [`App.tsx`](file:///d:/Code/Personal_Projects/AI_Chat_To_App/app/App.tsx), remove the interactive prompt submission input. Replace with a minimal status footer (e.g., *"Monitoring agent · Return to desk to steer"*).
* [x] **Step 1.3:** In [`src/hooks/useAgentSocket.ts`](file:///d:/Code/Personal_Projects/AI_Chat_To_App/app/src/hooks/useAgentSocket.ts), remove write action functions (`approveTool`, `denyTool`, `sendPrompt`), simplifying the hook into a robust state receiver.

---

### Phase 2: Screen Keep-Awake for Mobile OS Sleep
* [x] **Step 2.1:** Utilize `expo-keep-awake` in [`App.tsx`](file:///d:/Code/Personal_Projects/AI_Chat_To_App/app/App.tsx): activate keep-awake while the agent status is `'thinking'` or `'running_tool'` so the screen stays active on your counter/desk.
* [x] **Step 2.2:** Add a toggle in settings/header allowing the user to turn on/off the keep-awake feature.

---

### Phase 3: Completion Alerts (Audio & Haptics)
* [x] **Step 3.1:** Trigger haptic feedback (via `expo-haptics`) when agent transitions to `'done'`.
* [x] **Step 3.2:** Play an audible notification chime / vibration when task completion arrives.
* [x] **Step 3.3:** Display a prominent "Task Completed — Ready for Next Step" banner in the UI.

---

### Phase 4: History Loading & Chat Stream Improvements
* [ ] **Step 4.1:** In [`src/hooks/useAgentSocket.ts`](file:///d:/Code/Personal_Projects/AI_Chat_To_App/app/src/hooks/useAgentSocket.ts), handle the `INIT_SESSION` event from the extension to load existing conversation messages upon connection.
* [ ] **Step 4.2:** Correctly render messages by sender:
  - User messages: formatted cleanly on the right with user styling.
  - Agent messages: formatted on the left with markdown and collapsible reasoning.

---

### Phase 5: Pairing UI Refinements
* [ ] **Step 5.1:** Update [`src/components/ConnectionModal.tsx`](file:///d:/Code/Personal_Projects/AI_Chat_To_App/app/src/components/ConnectionModal.tsx) to provide clear guidance for LAN IP input (`ws://192.168.x.x:49152`).
* [ ] **Step 5.2:** Store paired host and token persistently using `expo-secure-store` so the developer does not need to re-pair every time the app opens.

---

### Phase 6: Verification & Tests
* [ ] **Step 6.1:** Update existing unit tests in `__tests__/` to reflect the read-only UI components.
* [ ] **Step 6.2:** Verify all tests pass cleanly (`npm test`).

