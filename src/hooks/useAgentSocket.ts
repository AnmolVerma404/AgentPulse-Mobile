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
  activeTool: ToolCallRequest | null;
  pendingApproval: ToolCallRequest | null;
  connect: () => void;
  disconnect: () => void;
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
  const [activeTool, setActiveTool] = useState<ToolCallRequest | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      const fullUrl = url.includes('?token=')
        ? url
        : token
        ? `${url}?token=${encodeURIComponent(token)}`
        : url;
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
              if (data.status === 'done' || data.status === 'idle') {
                setActiveTool(null);
              }
            }
          } else if (data.event === 'STREAM_CHUNK') {
            const chunkType = data.type || 'content';
            const delta = data.delta || '';
            const sender = data.sender || 'agent';

            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === sender && last.id === currentMessageIdRef.current) {
                // Update active message in-place
                const updated = { ...last };
                if (chunkType === 'thinking') {
                  updated.thinking = (updated.thinking || '') + delta;
                } else {
                  updated.content = (updated.content || '') + delta;
                }
                return [...prev.slice(0, -1), updated];
              } else {
                // Start a new message
                const newId = `msg-${Date.now()}`;
                currentMessageIdRef.current = newId;
                const newMessage: ChatMessage = {
                  id: newId,
                  sender,
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
                commandOrArgs: typeof data.tool.args === 'string'
                  ? data.tool.args
                  : JSON.stringify(data.tool.args || {}),
                requiresApproval: !!data.tool.requiresApproval,
              };

              setActiveTool(toolReq);
              setStatus(toolReq.requiresApproval ? 'waiting_approval' : 'running_tool');
            }
          } else if (data.event === 'INIT_SESSION') {
            if (data.status) {
              setStatus(data.status);
            }
            if (Array.isArray(data.history) && data.history.length > 0) {
              setMessages(data.history);
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

  const clearMessages = useCallback(() => {
    setMessages([]);
    currentMessageIdRef.current = null;
    setActiveTool(null);
  }, []);

  return {
    isConnected,
    isConnecting,
    status,
    messages,
    activeTool,
    pendingApproval: activeTool,
    connect,
    disconnect,
    clearMessages,
  };
}
