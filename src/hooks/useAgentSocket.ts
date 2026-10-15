import { useState, useEffect, useRef, useCallback } from 'react';
import { AgentExecutionStatus, ChatMessage, ToolCallRequest } from '../types';

export interface UseAgentSocketOptions {
  url: string;
  token: string;
  autoConnect?: boolean;
}

export interface UseAgentSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  status: AgentExecutionStatus;
  messages: ChatMessage[];
  pendingApproval: ToolCallRequest | null;
  connect: () => void;
  disconnect: () => void;
  approveTool: (toolId: string) => void;
  denyTool: (toolId: string) => void;
  sendPrompt: (prompt: string) => void;
  clearMessages: () => void;
}

export function useAgentSocket({
  url,
  token,
  autoConnect = true,
}: UseAgentSocketOptions): UseAgentSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<AgentExecutionStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingApproval, setPendingApproval] = useState<ToolCallRequest | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const connect = useCallback(() => {
    if (!url) return;
    disconnect();
    setIsConnecting(true);

    try {
      const fullUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;
      const ws = new WebSocket(fullUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.event === 'AGENT_STATUS') {
            if (data.status) {
              setStatus(data.status);
            }
          } else if (data.event === 'STREAM_CHUNK') {
            const chunkType = data.type || 'content';
            const delta = data.delta || '';

            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'agent' && last.id === currentMessageIdRef.current) {
                // Update active message in-place
                const updated = { ...last };
                if (chunkType === 'thinking') {
                  updated.thinking = (updated.thinking || '') + delta;
                } else {
                  updated.content = (updated.content || '') + delta;
                }
                return [...prev.slice(0, -1), updated];
              } else {
                // Start a new agent message
                const newId = `msg-${Date.now()}`;
                currentMessageIdRef.current = newId;
                const newMessage: ChatMessage = {
                  id: newId,
                  sender: 'agent',
                  content: chunkType === 'content' ? delta : '',
                  thinking: chunkType === 'thinking' ? delta : undefined,
                  timestamp: Date.now(),
                };
                return [...prev, newMessage];
              }
            });
          } else if (data.event === 'TOOL_CALL') {
            if (data.tool) {
              const toolReq: ToolCallRequest = {
                id: data.tool.id,
                toolName: data.tool.name,
                commandOrArgs: JSON.stringify(data.tool.args || {}),
                requiresApproval: !!data.tool.requiresApproval,
              };

              if (toolReq.requiresApproval) {
                setPendingApproval(toolReq);
                setStatus('waiting_approval');
              }
            }
          }
        } catch {
          // Ignore invalid frames
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        socketRef.current = null;
      };

      ws.onerror = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
    } catch {
      setIsConnecting(false);
    }
  }, [url, token, disconnect]);

  useEffect(() => {
    if (autoConnect && url) {
      connect();
    }
    return () => disconnect();
  }, [autoConnect, url, connect, disconnect]);

  const approveTool = useCallback((toolId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'TOOL_ACTION',
          decision: 'approve',
          toolId,
        })
      );
    }
    setPendingApproval(null);
    setStatus('running_tool');
  }, []);

  const denyTool = useCallback((toolId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'TOOL_ACTION',
          decision: 'deny',
          toolId,
        })
      );
    }
    setPendingApproval(null);
    setStatus('idle');
  }, []);

  const sendPrompt = useCallback((prompt: string) => {
    if (!prompt.trim()) return;

    // Append user message locally
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    currentMessageIdRef.current = null;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'SEND_PROMPT',
          prompt,
        })
      );
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    currentMessageIdRef.current = null;
    setPendingApproval(null);
  }, []);

  return {
    isConnected,
    isConnecting,
    status,
    messages,
    pendingApproval,
    connect,
    disconnect,
    approveTool,
    denyTool,
    sendPrompt,
    clearMessages,
  };
}

