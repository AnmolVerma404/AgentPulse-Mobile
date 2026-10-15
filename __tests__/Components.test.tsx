import renderer, { act } from 'react-test-renderer';
import { AgentStatusBar } from '../src/components/AgentStatusBar';
import { ChatMessageBubble } from '../src/components/ChatMessageBubble';
import { ToolApprovalCard } from '../src/components/ToolApprovalCard';
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
  it('renders tool name and command preview with action buttons', () => {
    const onApprove = jest.fn();
    const onDeny = jest.fn();

    const tool = {
      id: 'tool-1',
      toolName: 'run_command',
      commandOrArgs: 'npm run test:e2e',
      requiresApproval: true,
    };

    let tree: any;
    act(() => {
      tree = renderer.create(
        <ToolApprovalCard tool={tool} onApprove={onApprove} onDeny={onDeny} />
      );
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('run_command');
    expect(json).toContain('npm run test:e2e');
    expect(json).toContain('Approve');
    expect(json).toContain('Deny');
  });
});

describe('PromptBar Component', () => {
  it('renders input with placeholder and send button', () => {
    const onSend = jest.fn();
    let tree: any;
    act(() => {
      tree = renderer.create(<PromptBar onSend={onSend} />);
    });

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Send prompt or feedback...');
    expect(json).toContain('Send');
  });
});

