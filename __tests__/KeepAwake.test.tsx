import renderer, { act } from 'react-test-renderer';
import * as KeepAwake from 'expo-keep-awake';
import { useAgentKeepAwake } from '../src/hooks/useAgentKeepAwake';
import { AgentExecutionStatus } from '../src/types';

function TestKeepAwakeComponent({
  status,
  enabled,
}: {
  status: AgentExecutionStatus;
  enabled?: boolean;
}) {
  useAgentKeepAwake({ status, enabled });
  return null;
}

describe('useAgentKeepAwake hook', () => {
  let activateSpy: jest.SpyInstance;
  let deactivateSpy: jest.SpyInstance;

  beforeEach(() => {
    activateSpy = jest.spyOn(KeepAwake, 'activateKeepAwakeAsync').mockImplementation(() => Promise.resolve());
    deactivateSpy = jest.spyOn(KeepAwake, 'deactivateKeepAwake').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    activateSpy.mockRestore();
    deactivateSpy.mockRestore();
  });

  it('activates keep-awake when agent is thinking and enabled', () => {
    act(() => {
      renderer.create(<TestKeepAwakeComponent status="thinking" enabled={true} />);
    });
    expect(activateSpy).toHaveBeenCalledWith('agentpulse-active');
  });

  it('activates keep-awake when agent is running a tool and enabled', () => {
    act(() => {
      renderer.create(<TestKeepAwakeComponent status="running_tool" enabled={true} />);
    });
    expect(activateSpy).toHaveBeenCalledWith('agentpulse-active');
  });

  it('deactivates keep-awake when agent transitions to done', () => {
    let root: any;
    act(() => {
      root = renderer.create(<TestKeepAwakeComponent status="thinking" enabled={true} />);
    });

    expect(activateSpy).toHaveBeenCalledWith('agentpulse-active');

    act(() => {
      root.update(<TestKeepAwakeComponent status="done" enabled={true} />);
    });

    expect(deactivateSpy).toHaveBeenCalledWith('agentpulse-active');
  });

  it('does not activate keep-awake when user has disabled it in settings', () => {
    act(() => {
      renderer.create(<TestKeepAwakeComponent status="thinking" enabled={false} />);
    });
    expect(activateSpy).not.toHaveBeenCalled();
    expect(deactivateSpy).toHaveBeenCalledWith('agentpulse-active');
  });
});
