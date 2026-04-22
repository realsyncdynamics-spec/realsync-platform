import { describe, it, expect, beforeEach } from 'vitest';
import { EcosystemBus, PRESET_WORKFLOWS, APP_DESCRIPTIONS, type AppId, type EcosystemEvent } from '../ecosystem';

function makeEvent(overrides: Partial<EcosystemEvent> = {}): EcosystemEvent {
  return {
    id: 'evt_test_1',
    sourceApp: 'contentforge',
    targetApp: 'creatorseal',
    eventType: 'content.published',
    payload: {},
    timestamp: Date.now(),
    userId: 'user_123',
    ...overrides,
  };
}

// ── EcosystemBus ───────────────────────────────────────────────────────────────

describe('EcosystemBus', () => {
  beforeEach(() => {
    // Clear all listeners between tests
    EcosystemBus.off('creatorseal', 'content.published');
    EcosystemBus.off('all', 'content.published');
    EcosystemBus.off('mediavault', 'file.uploaded');
  });

  it('calls a registered listener when an event is emitted', () => {
    const received: EcosystemEvent[] = [];
    EcosystemBus.on('creatorseal', 'content.published', evt => received.push(evt));

    const event = makeEvent();
    EcosystemBus.emit(event);

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(event);
  });

  it('does not call a listener for a different app', () => {
    const received: EcosystemEvent[] = [];
    EcosystemBus.on('mediavault', 'content.published', evt => received.push(evt));

    EcosystemBus.emit(makeEvent({ targetApp: 'creatorseal' }));

    expect(received).toHaveLength(0);
  });

  it('calls a wildcard "all" listener regardless of targetApp', () => {
    const received: EcosystemEvent[] = [];
    EcosystemBus.on('all', 'content.published', evt => received.push(evt));

    EcosystemBus.emit(makeEvent({ targetApp: 'creatorseal' }));

    expect(received).toHaveLength(1);
  });

  it('supports multiple listeners on the same key', () => {
    let count = 0;
    EcosystemBus.on('creatorseal', 'content.published', () => count++);
    EcosystemBus.on('creatorseal', 'content.published', () => count++);

    EcosystemBus.emit(makeEvent());

    expect(count).toBe(2);
  });

  it('removes listeners with off()', () => {
    const received: EcosystemEvent[] = [];
    EcosystemBus.on('creatorseal', 'content.published', evt => received.push(evt));
    EcosystemBus.off('creatorseal', 'content.published');

    EcosystemBus.emit(makeEvent());

    expect(received).toHaveLength(0);
  });

  it('does not throw when emitting to an app with no listeners', () => {
    expect(() =>
      EcosystemBus.emit(makeEvent({ targetApp: 'mediavault', eventType: 'unknown.event' }))
    ).not.toThrow();
  });

  it('passes the full event object to the listener', () => {
    let received: EcosystemEvent | null = null;
    EcosystemBus.on('creatorseal', 'content.published', evt => { received = evt; });

    const event = makeEvent({ payload: { contentId: 'abc123' } });
    EcosystemBus.emit(event);

    expect(received).not.toBeNull();
    expect((received as EcosystemEvent).payload).toEqual({ contentId: 'abc123' });
  });
});

// ── PRESET_WORKFLOWS ───────────────────────────────────────────────────────────

describe('PRESET_WORKFLOWS', () => {
  it('is a non-empty array', () => {
    expect(PRESET_WORKFLOWS.length).toBeGreaterThan(0);
  });

  it('each workflow has a unique id', () => {
    const ids = PRESET_WORKFLOWS.map(w => w.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('each workflow has a name, trigger, and at least one action', () => {
    for (const wf of PRESET_WORKFLOWS) {
      expect(wf.name).toBeTruthy();
      expect(wf.trigger.app).toBeTruthy();
      expect(wf.trigger.event).toBeTruthy();
      expect(wf.actions.length).toBeGreaterThan(0);
    }
  });

  it('has an "auto-watermark" workflow', () => {
    const wf = PRESET_WORKFLOWS.find(w => w.id === 'wf-auto-watermark');
    expect(wf).toBeDefined();
    expect(wf!.trigger.app).toBe('mediavault');
  });

  it('has a "deepfake-alert" workflow', () => {
    const wf = PRESET_WORKFLOWS.find(w => w.id === 'wf-deepfake-alert');
    expect(wf).toBeDefined();
    expect(wf!.trigger.app).toBe('creatorseal');
    expect(wf!.trigger.event).toBe('deepfake.detected');
  });
});

// ── APP_DESCRIPTIONS ───────────────────────────────────────────────────────────

describe('APP_DESCRIPTIONS', () => {
  it('contains a description for creatorseal', () => {
    expect(APP_DESCRIPTIONS.creatorseal).toBeDefined();
    expect(APP_DESCRIPTIONS.creatorseal.name).toBe('CreatorSeal');
  });

  it('every app description has required fields', () => {
    for (const [, desc] of Object.entries(APP_DESCRIPTIONS)) {
      expect(desc.name).toBeTruthy();
      expect(desc.tagline).toBeTruthy();
      expect(desc.description).toBeTruthy();
      expect(desc.features.length).toBeGreaterThan(0);
      expect(desc.useCases.length).toBeGreaterThan(0);
      expect(desc.color).toMatch(/^#/);
    }
  });

  it('integrations reference valid AppId values', () => {
    const validIds = Object.keys(APP_DESCRIPTIONS) as AppId[];
    for (const [, desc] of Object.entries(APP_DESCRIPTIONS)) {
      for (const integration of desc.integrations) {
        expect(validIds).toContain(integration);
      }
    }
  });
});
