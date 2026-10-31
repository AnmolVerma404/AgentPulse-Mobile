/**
 * Core type definitions for AgentPulse Mobile (Read-Only Monitor).
 */

export type AgentType = 'antigravity' | 'copilot' | 'claude_code' | 'cursor';

export type AgentExecutionStatus =
  | 'idle'
  | 'thinking'
  | 'running_tool'
  | 'waiting_approval'
  | 'done'
  | 'error';

export interface ToolCallRequest {
  id: string;
  toolName: string;
  commandOrArgs: string;
  description?: string;
  requiresApproval?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  thinking?: string;
  timestamp: number;
  toolCall?: ToolCallRequest;
}

export interface SessionState {
  sessionId: string;
  agentType: AgentType;
  status: AgentExecutionStatus;
  messages: ChatMessage[];
  activeTool?: ToolCallRequest;
}
