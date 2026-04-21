/**
 * Smoke test for AgentOS transport normalization.
 * Run via: npx tsx src/lib/agent-os/__tests__/runtime.smoke.test.ts
 *
 * This file deliberately uses no test framework — plain assertions so it
 * runs without adding a test runner dependency. Exit code is non-zero on
 * failure via thrown errors.
 */
import { normalizeSdkMessage } from '../transport';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`[smoke] ${msg}`);
}

function assertEqual<T>(a: T, b: T, msg: string) {
  const aj = JSON.stringify(a);
  const bj = JSON.stringify(b);
  if (aj !== bj) {
    throw new Error(`[smoke] ${msg}\n  expected: ${bj}\n  got: ${aj}`);
  }
}

function testAssistantTextBlock() {
  const events = normalizeSdkMessage(
    { type: 'assistant', message: { content: [{ type: 'text', text: 'Hallo' }] } },
    'specialist_creatorseal_copywriter',
  );
  assertEqual(events.length, 1, 'one event for one text block');
  assert(events[0].type === 'message_delta', 'is message_delta');
}

function testAssistantToolUse() {
  const events = normalizeSdkMessage(
    {
      type: 'assistant',
      message: {
        content: [
          {
            type: 'tool_use',
            id: 'call_1',
            name: 'delegate_to_vp_customer_success',
            input: { task: 'x' },
          },
        ],
      },
    },
    'cio_agent',
  );
  assertEqual(events.length, 1, 'one event for one tool_use block');
  assert(events[0].type === 'tool_call', 'is tool_call');
}

function testToolResult() {
  const events = normalizeSdkMessage(
    {
      type: 'user',
      message: {
        content: [
          { type: 'tool_result', tool_use_id: 'call_1', content: 'done', is_error: false },
        ],
      },
    },
    'cio_agent',
  );
  assertEqual(events.length, 1, 'one event for one tool_result block');
  assert(events[0].type === 'tool_result', 'is tool_result');
}

function testResult() {
  const events = normalizeSdkMessage(
    { type: 'result', result: { claims: ['a', 'b', 'c'] } },
    'specialist',
  );
  assertEqual(events.length, 1, 'one done event');
  assert(events[0].type === 'done', 'is done');
}

function testUnknownSilentlyDropped() {
  const events = normalizeSdkMessage({ type: 'system', subtype: 'init' }, 'anything');
  assertEqual(events, [], 'system frames are dropped');
}

testAssistantTextBlock();
testAssistantToolUse();
testToolResult();
testResult();
testUnknownSilentlyDropped();

// eslint-disable-next-line no-console
console.log('[smoke] all transport tests passed');
