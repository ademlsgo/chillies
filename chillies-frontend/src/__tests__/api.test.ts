import { vi, describe, it, expect } from 'vitest';

describe('api baseURL', () => {
  it('uses VITE_API_URL when provided', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_API_URL', 'http://example.test:1234');
    const mod = await import('../services/api');
    const { api } = mod as any;
    expect(api.defaults.baseURL).toBe('http://example.test:1234');
  });

  it('falls back to http://localhost:8989 when missing', async () => {
    vi.resetModules();
    vi.unstubAllEnvs();
    const fresh = await import('../services/api');
    const { api } = fresh as any;
    expect(api.defaults.baseURL).toBe('http://localhost:8989');
  });
});
