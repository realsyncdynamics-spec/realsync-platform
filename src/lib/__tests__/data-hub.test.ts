import { describe, it, expect, beforeEach } from 'vitest';
import {
  EcosystemDataHub,
  dataHub,
  DATA_ROUTES,
  PRESET_WORKFLOWS,
  type DataPacket,
} from '../data-hub';

// ── EcosystemDataHub.emit ──────────────────────────────────────────────────────

describe('EcosystemDataHub.emit', () => {
  let hub: EcosystemDataHub;

  beforeEach(() => {
    hub = new EcosystemDataHub();
  });

  it('returns a DataPacket with the correct fields', () => {
    const packet = hub.emit('creatorseal', 'mediavault', 'media', { size: 100 }, 'user_1');

    expect(packet.sourceApp).toBe('creatorseal');
    expect(packet.targetApp).toBe('mediavault');
    expect(packet.dataType).toBe('media');
    expect(packet.payload).toEqual({ size: 100 });
    expect(packet.userId).toBe('user_1');
    expect(packet.status).toBe('delivered');
  });

  it('assigns a unique id to each packet', () => {
    const p1 = hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');
    const p2 = hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');
    expect(p1.id).not.toBe(p2.id);
  });

  it('id starts with "pkt_"', () => {
    const packet = hub.emit('trendradar', 'contentforge', 'trend', {}, 'u1');
    expect(packet.id.startsWith('pkt_')).toBe(true);
  });

  it('marks status as "delivered" when a listener is registered', () => {
    hub.on('mediavault', 'media', () => {});
    const packet = hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');
    expect(packet.status).toBe('delivered');
  });

  it('marks status as "failed" when listener throws', () => {
    hub.on('mediavault', 'media', () => { throw new Error('listener error'); });
    const packet = hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');
    expect(packet.status).toBe('failed');
  });

  it('marks status as "delivered" (no listener path)', () => {
    // No listener registered — pending -> delivered
    const packet = hub.emit('creatorseal', 'rightsguard', 'certificate', {}, 'u1');
    expect(packet.status).toBe('delivered');
  });
});

// ── EcosystemDataHub.on / listener delivery ────────────────────────────────────

describe('EcosystemDataHub.on', () => {
  let hub: EcosystemDataHub;

  beforeEach(() => {
    hub = new EcosystemDataHub();
  });

  it('calls listener with the emitted packet', () => {
    let received: DataPacket | null = null;
    hub.on('mediavault', 'media', pkt => { received = pkt; });

    hub.emit('creatorseal', 'mediavault', 'media', { size: 42 }, 'u1');

    expect(received).not.toBeNull();
    expect((received as DataPacket).payload).toEqual({ size: 42 });
  });

  it('does not call a listener registered for a different app', () => {
    let called = false;
    hub.on('rightsguard', 'media', () => { called = true; });

    hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');

    expect(called).toBe(false);
  });

  it('does not call a listener registered for a different dataType', () => {
    let called = false;
    hub.on('mediavault', 'certificate', () => { called = true; });

    hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');

    expect(called).toBe(false);
  });

  it('supports multiple listeners for the same app + dataType', () => {
    let count = 0;
    hub.on('mediavault', 'media', () => count++);
    hub.on('mediavault', 'media', () => count++);

    hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');

    expect(count).toBe(2);
  });
});

// ── EcosystemDataHub.getHistory ────────────────────────────────────────────────

describe('EcosystemDataHub.getHistory', () => {
  let hub: EcosystemDataHub;

  beforeEach(() => {
    hub = new EcosystemDataHub();
  });

  it('returns an empty array when no packets have been emitted', () => {
    expect(hub.getHistory('u1')).toEqual([]);
  });

  it('returns packets for a specific user', () => {
    hub.emit('creatorseal', 'mediavault', 'media', {}, 'alice');
    hub.emit('creatorseal', 'mediavault', 'media', {}, 'bob');

    const aliceHistory = hub.getHistory('alice');
    expect(aliceHistory).toHaveLength(1);
    expect(aliceHistory[0].userId).toBe('alice');
  });

  it('respects the limit parameter', () => {
    for (let i = 0; i < 10; i++) {
      hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');
    }
    expect(hub.getHistory('u1', 5)).toHaveLength(5);
  });

  it('defaults to last 50 packets', () => {
    for (let i = 0; i < 60; i++) {
      hub.emit('creatorseal', 'mediavault', 'media', {}, 'u1');
    }
    expect(hub.getHistory('u1')).toHaveLength(50);
  });

  it('does not include packets from other users', () => {
    hub.emit('creatorseal', 'mediavault', 'media', {}, 'u99');
    expect(hub.getHistory('u1')).toHaveLength(0);
  });
});

// ── EcosystemDataHub.getRoutes / getWorkflows ──────────────────────────────────

describe('EcosystemDataHub.getRoutes', () => {
  it('returns the static DATA_ROUTES array', () => {
    expect(dataHub.getRoutes()).toBe(DATA_ROUTES);
  });

  it('all routes have source, target, dataTypes, and autoSync', () => {
    for (const route of dataHub.getRoutes()) {
      expect(route.source).toBeTruthy();
      expect(route.target).toBeTruthy();
      expect(Array.isArray(route.dataTypes)).toBe(true);
      expect(typeof route.autoSync).toBe('boolean');
    }
  });
});

describe('EcosystemDataHub.getWorkflows', () => {
  it('returns the static PRESET_WORKFLOWS array', () => {
    expect(dataHub.getWorkflows()).toBe(PRESET_WORKFLOWS);
  });

  it('each workflow has id, name, trigger, steps, and active flag', () => {
    for (const wf of dataHub.getWorkflows()) {
      expect(wf.id).toBeTruthy();
      expect(wf.name).toBeTruthy();
      expect(wf.trigger.appId).toBeTruthy();
      expect(Array.isArray(wf.steps)).toBe(true);
      expect(typeof wf.active).toBe('boolean');
    }
  });
});

// ── DATA_ROUTES ────────────────────────────────────────────────────────────────

describe('DATA_ROUTES', () => {
  it('is a non-empty array', () => {
    expect(DATA_ROUTES.length).toBeGreaterThan(0);
  });

  it('all route descriptions are non-empty strings', () => {
    for (const route of DATA_ROUTES) {
      expect(route.description.length).toBeGreaterThan(0);
    }
  });

  it('each route has at least one dataType', () => {
    for (const route of DATA_ROUTES) {
      expect(route.dataTypes.length).toBeGreaterThan(0);
    }
  });
});

// ── PRESET_WORKFLOWS (data-hub) ────────────────────────────────────────────────

describe('PRESET_WORKFLOWS (data-hub)', () => {
  it('each workflow step has id, appId, and action', () => {
    for (const wf of PRESET_WORKFLOWS) {
      for (const step of wf.steps) {
        expect(step.id).toBeTruthy();
        expect(step.appId).toBeTruthy();
        expect(step.action).toBeTruthy();
      }
    }
  });

  it('executionCount is a non-negative number', () => {
    for (const wf of PRESET_WORKFLOWS) {
      expect(wf.executionCount).toBeGreaterThanOrEqual(0);
    }
  });

  it('createdAt is a positive timestamp', () => {
    for (const wf of PRESET_WORKFLOWS) {
      expect(wf.createdAt).toBeGreaterThan(0);
    }
  });
});
