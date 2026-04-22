import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dispatchTask } from '../router';

// ── dispatchTask — stub / unconfigured agents ──────────────────────────────────

describe('dispatchTask — unconfigured agents', () => {
  it('returns a TaskResponse with report, agent, latency, tokens, cached fields', async () => {
    const result = await dispatchTask({ task: 'test task', agent: 'comet' });

    expect(result).toHaveProperty('report');
    expect(result).toHaveProperty('agent');
    expect(result).toHaveProperty('latency');
    expect(result).toHaveProperty('tokens');
    expect(result).toHaveProperty('cached');
  });

  it('uses the stub path for unimplemented agents and returns a non-empty report', async () => {
    const result = await dispatchTask({ task: 'hello', agent: 'mistral' });
    expect(result.report.length).toBeGreaterThan(0);
    expect(result.agent).toBe('mistral');
    expect(result.cached).toBe(false);
  });

  it('latency is a non-negative number', async () => {
    const result = await dispatchTask({ task: 'timing test', agent: 'llama' });
    expect(result.latency).toBeGreaterThanOrEqual(0);
  });

  it('tokens is ceil(report.length / 4)', async () => {
    const result = await dispatchTask({ task: 'token count test', agent: 'comet' });
    expect(result.tokens).toBe(Math.ceil(result.report.length / 4));
  });
});

// ── dispatchTask — missing API key paths ───────────────────────────────────────

describe('dispatchTask — missing API keys', () => {
  beforeEach(() => {
    delete process.env.PPLX_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  it('falls back through the chain when perplexity key is missing', async () => {
    // With no keys set, perplexity and gemini both throw; remaining agents use the stub path
    const result = await dispatchTask({ task: 'fallback test', agent: 'perplexity' });
    // Should eventually succeed via a stub agent
    expect(result.report.length).toBeGreaterThan(0);
  });

  it('falls back through the chain when gemini key is missing', async () => {
    const result = await dispatchTask({ task: 'fallback test', agent: 'gemini' });
    expect(result.report.length).toBeGreaterThan(0);
  });
});

// ── dispatchTask — custom fallback list ────────────────────────────────────────

describe('dispatchTask — custom fallback list', () => {
  it('uses provided fallback agents instead of default chain', async () => {
    const result = await dispatchTask({
      task: 'custom fallback test',
      agent: 'perplexity',
      fallback: ['comet'],
    });
    // perplexity will fail (no key), comet uses stub → succeeds
    expect(result.report.length).toBeGreaterThan(0);
  });
});

// ── dispatchTask — all agents fail ────────────────────────────────────────────

describe('dispatchTask — all agents fail', () => {
  it('returns the "all agents failed" error report when every agent throws', async () => {
    // Override fetch globally to always reject for this test
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    // Provide a minimal fallback list so the test finishes quickly;
    // stub agents still succeed, so we only test the configured API agents.
    // To force "all fail" we need agents that throw, which only perplexity/gemini do (via fetch).
    delete process.env.PPLX_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const result = await dispatchTask({
      task: 'all fail test',
      agent: 'perplexity',
      fallback: ['gemini'],  // both require API keys → both fail → "all failed" result
    });

    // Both perplexity and gemini throw without keys before reaching fetch
    expect(result.report).toBe('All agents failed. Please try again later.');
    expect(result.tokens).toBe(0);

    global.fetch = originalFetch;
  });
});
