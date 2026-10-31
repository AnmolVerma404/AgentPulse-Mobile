# Graph Report - app  (2026-10-24)

## Corpus Check
- Corpus is ~23,365 words - fits in a single context window. You may not need a graph.

## Summary
- 116 nodes · 163 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- UI Components & Agent Supervision
- App Shell & React Native Views
- Core Dependencies & Runtime
- Expo Project Manifest
- Android Adaptive Icon Config
- Test Suite & Tooling
- Security, Storage & Guidelines
- TypeScript Configuration
- NPM Scripts & Build Tasks
- Visual Brand Assets

## God Nodes (most connected - your core abstractions)
1. `expo` - 10 edges
2. `App()` - 9 edges
3. `react` - 9 edges
4. `react-native` - 7 edges
5. `scripts` - 6 edges
6. `ChatMessage` - 6 edges
7. `adaptiveIcon` - 5 edges
8. `AgentExecutionStatus` - 5 edges
9. `ToolCallRequest` - 5 edges
10. `AgentStatusBar()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Code Privacy Policy` --rationale_for--> `ChatMessage`  [INFERRED]
  .agents/rules/security.md → src/types/index.ts
- `icon` --references--> `App Icon`  [EXTRACTED]
  app.json → assets/icon.png
- `foregroundImage` --references--> `Android Adaptive Icon Foreground`  [EXTRACTED]
  app.json → assets/android-icon-foreground.png
- `backgroundImage` --references--> `Android Adaptive Icon Background`  [EXTRACTED]
  app.json → assets/android-icon-background.png
- `monochromeImage` --references--> `Android Adaptive Icon Monochrome`  [EXTRACTED]
  app.json → assets/android-icon-monochrome.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AgentPulse Mobile UI Components** — src_components_agentstatusbar, src_components_chatmessagebubble, src_components_toolapprovalcard, src_components_promptbar [INFERRED 0.85]

## Communities (12 total, 3 thin omitted)

### Community 0 - "UI Components & Agent Supervision"
Cohesion: 0.13
Nodes (19): Component Modularity Standard, TLS/WSS Transport Security, AFK Agent Supervision, AgentPulse Mobile Overview, Live Stream Chat & Reasoning, One-Tap Tool Approvals, AgentStatusBarProps, styles (+11 more)

### Community 1 - "App Shell & React Native Views"
Cohesion: 0.19
Nodes (14): App(), styles, react, react-native, AgentStatusBar(), ChatMessageBubble(), ConnectionModal(), ConnectionModalProps (+6 more)

### Community 2 - "Core Dependencies & Runtime"
Cohesion: 0.11
Nodes (17): dependencies, expo, expo-status-bar, react, react-native, main, name, private (+9 more)

### Community 3 - "Expo Project Manifest"
Cohesion: 0.14
Nodes (13): expo, icon, ios, name, orientation, slug, userInterfaceStyle, version (+5 more)

### Community 4 - "Android Adaptive Icon Config"
Cohesion: 0.20
Nodes (10): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, android, Android Adaptive Icon Background (+2 more)

### Community 5 - "Test Suite & Tooling"
Cohesion: 0.29
Nodes (7): devDependencies, jest, jest-expo, @testing-library/react-native, @types/jest, @types/react, typescript

### Community 6 - "Security, Storage & Guidelines"
Cohesion: 0.33
Nodes (5): Hardware Enclave Security, Mobile App Context Cache, Expo SecureStore Policy, Expo Mobile Dev Guidelines, SecureStore Token Pattern

### Community 7 - "TypeScript Configuration"
Cohesion: 0.33
Nodes (5): TypeScript Strictness Rule, expo/tsconfig.base, compilerOptions, strict, extends

### Community 8 - "NPM Scripts & Build Tasks"
Cohesion: 0.33
Nodes (6): scripts, android, ios, start, test, web

## Knowledge Gaps
- **17 isolated node(s):** `expo-status-bar`, `@testing-library/react-native`, `@types/jest`, `@types/react`, `jest` (+12 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 62 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Shell & React Native Views` to `UI Components & Agent Supervision`, `Core Dependencies & Runtime`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `App()` (e.g. with `index.ts` and `App.test.tsx`) actually correct?**
  _`App()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `expo-status-bar`, `@testing-library/react-native`, `@types/jest` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Agent Supervision` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `App Shell & React Native Views` to `UI Components & Agent Supervision`, `Core Dependencies & Runtime`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `Core Dependencies & Runtime` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Test Suite & Tooling` to `Core Dependencies & Runtime`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._