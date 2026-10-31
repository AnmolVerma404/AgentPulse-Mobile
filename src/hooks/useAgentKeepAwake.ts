import { useEffect } from 'react';
import * as KeepAwake from 'expo-keep-awake';
import { AgentExecutionStatus } from '../types';

export interface UseAgentKeepAwakeOptions {
  status: AgentExecutionStatus;
  enabled?: boolean;
}

/**
 * Manages screen keep-awake state during active agent execution.
 * Keeps the mobile display active when the agent is thinking or executing a tool,
 * and releases screen sleep assertions when done or idle.
 */
export function useAgentKeepAwake({ status, enabled = true }: UseAgentKeepAwakeOptions): void {
  useEffect(() => {
    const isWorking = status === 'thinking' || status === 'running_tool' || status === 'waiting_approval';

    if (enabled && isWorking) {
      KeepAwake.activateKeepAwakeAsync('agentpulse-active').catch(() => {
        // Silently handle web or unsupported environments
      });
    } else {
      try {
        KeepAwake.deactivateKeepAwake('agentpulse-active');
      } catch {
        // Ignore deactivation on unasserted tags
      }
    }

    return () => {
      try {
        KeepAwake.deactivateKeepAwake('agentpulse-active');
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [status, enabled]);
}
