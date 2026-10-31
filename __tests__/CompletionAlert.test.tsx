import { Vibration } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import * as Haptics from 'expo-haptics';
import { useCompletionAlert } from '../src/hooks/useCompletionAlert';
import { AgentExecutionStatus } from '../src/types';

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  NotificationFeedbackType: {
    Success: 'success',
  },
}));

function TestAlertComponent({
  status,
  enabled,
  onDone,
}: {
  status: AgentExecutionStatus;
  enabled?: boolean;
  onDone?: () => void;
}) {
  useCompletionAlert({ status, enabled, onDone });
  return null;
}

describe('useCompletionAlert hook', () => {
  let vibrateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    vibrateSpy = jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});
  });

  afterEach(() => {
    vibrateSpy.mockRestore();
  });

  it('triggers haptics and vibration when transitioning from thinking to done', () => {
    const onDone = jest.fn();
    let root: any;

    act(() => {
      root = renderer.create(
        <TestAlertComponent status="thinking" enabled={true} onDone={onDone} />
      );
    });

    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();

    act(() => {
      root.update(
        <TestAlertComponent status="done" enabled={true} onDone={onDone} />
      );
    });

    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
    expect(vibrateSpy).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('triggers haptics and vibration when transitioning from running_tool to done', () => {
    const onDone = jest.fn();
    let root: any;

    act(() => {
      root = renderer.create(
        <TestAlertComponent status="running_tool" enabled={true} onDone={onDone} />
      );
    });

    act(() => {
      root.update(
        <TestAlertComponent status="done" enabled={true} onDone={onDone} />
      );
    });

    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('does not trigger alert on initial mount if already done', () => {
    const onDone = jest.fn();
    act(() => {
      renderer.create(
        <TestAlertComponent status="done" enabled={true} onDone={onDone} />
      );
    });

    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it('does not trigger alert when disabled', () => {
    const onDone = jest.fn();
    let root: any;

    act(() => {
      root = renderer.create(
        <TestAlertComponent status="thinking" enabled={false} onDone={onDone} />
      );
    });

    act(() => {
      root.update(
        <TestAlertComponent status="done" enabled={false} onDone={onDone} />
      );
    });

    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });
});

