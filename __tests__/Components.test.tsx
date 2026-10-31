import renderer, { act } from 'react-test-renderer';
import { AgentStatusBar } from '../src/components/AgentStatusBar';
import { ChatMessageBubble } from '../src/components/ChatMessageBubble';
import { ToolApprovalCard } from '../src/components/ToolApprovalCard';
import { CompletionBanner } from '../src/components/CompletionBanner';
import { PromptBar } from '../src/components/PromptBar';

describe('AgentStatusBar Component', () => {
  it('renders connected status and thinking badge correctly', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(
        <AgentStatusBar status="thinking" isConnected={true} isConnecting={false} />
      );
    });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Connected');
    expect(json).toContain('Thinking...');
  });

  it('renders disconnected state when offline', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(
        <AgentStatusBar status="idle" isConnected={false} isConnecting={false} />
      );
    });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Disconnected');
    expect(json).toContain('Agent Idle');
  });
});

describe('ChatMessageBubble Component', () => {
  it('renders agent message content and thinking toggle', () => {
    const message = {
      id: 'msg-1',
      sender: 'agent' as const,
      content: 'Agent response output',
      thinking: 'Deep internal reasoning...',
      timestamp: Date.now(),
    };

    let tree: any;
    act(() => {
      tree = renderer.create(<ChatMessageBubble message={message} />);
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Agent response output');
    expect(json).toContain('View Agent Reasoning');
  });
});

describe('ToolApprovalCard Component', () => {
  it('renders tool name, command preview and desk approval warning', () => {
    const tool = {
      id: 'tool-1',
      toolName: 'run_command',
      commandOrArgs: 'npm run test:e2e',
      requiresApproval: true,
    };

    let tree: any;
    act(() => {
      tree = renderer.create(<ToolApprovalCard tool={tool} />);
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('run_command');
    expect(json).toContain('npm run test:e2e');
    expect(json).toContain('Requires Desk Approval');
  });
});

describe('CompletionBanner Component', () => {
  it('renders task completed message when visible', () => {
    const onDismiss = jest.fn();
    let tree: any;
    act(() => {
      tree = renderer.create(
        <CompletionBanner visible={true} onDismiss={onDismiss} />
      );
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Task Completed');
    expect(json).toContain('Return to your workstation');
  });

  it('renders null when visible is false', () => {
    const onDismiss = jest.fn();
    let tree: any;
    act(() => {
      tree = renderer.create(
        <CompletionBanner visible={false} onDismiss={onDismiss} />
      );
    });

    expect(tree.toJSON()).toBeNull();
  });
});

describe('PromptBar Component', () => {
  it('renders active monitoring status when connected', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<PromptBar isConnected={true} />);
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Monitoring active session');
  });

  it('renders disconnected prompt when offline', () => {
    let tree: any;
    act(() => {
      tree = renderer.create(<PromptBar isConnected={false} />);
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Disconnected');
  });
});
