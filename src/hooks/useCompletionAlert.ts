import { useEffect, useRef } from 'react';
import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AgentExecutionStatus } from '../types';

export interface UseCompletionAlertOptions {
  status: AgentExecutionStatus;
  enabled?: boolean;
  onDone?: () => void;
}

/**
 * Triggers haptic feedback, vibration, and completion callbacks when the agent
 * transitions from an active state (thinking/running_tool) to 'done'.
 */
export function useCompletionAlert({
  status,
  enabled = true,
  onDone,
}: UseCompletionAlertOptions): void {
  const previousStatusRef = useRef<AgentExecutionStatus>(status);

  useEffect(() => {
    const prev = previousStatusRef.current;
    previousStatusRef.current = status;

    const wasActive = prev === 'thinking' || prev === 'running_tool' || prev === 'waiting_approval';

    if (enabled && status === 'done' && wasActive) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        Vibration.vibrate([0, 200, 100, 200]);
      } catch {
        // Silently catch in unsupported environments
      }

      onDone?.();
    }
  }, [status, enabled, onDone]);
}

