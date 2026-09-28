import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { authenticateUser } from '@/lib/auth/login-service';
import { canAccessRoute, getDefaultRouteForRole } from '@/lib/auth/permissions';
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limit';
import { createTestUser, setupTestDatabase, teardownTestDatabase } from '@/test/db';

describe('permissions', () => {
  it('envía cocina directo a su tablero', () => {
    expect(getDefaultRouteForRole('cocina')).toBe('/panel/cocina');
  });

  it('envía productor directo a inventario', () => {
    expect(getDefaultRouteForRole('productor')).toBe('/panel/inventario');
  });

  it('no permite que cocina acceda al panel principal', () => {
    expect(canAccessRoute('cocina', '/panel')).toBe(false);
    expect(canAccessRoute('cocina', '/panel/cocina')).toBe(true);
  });

  it('permite que mesero acceda al panel principal', () => {
    expect(canAccessRoute('mesero', '/panel')).toBe(true);
  });

  it('permite que mesero vea cocina y marque pedidos', () => {
    expect(canAccessRoute('mesero', '/panel/cocina')).toBe(true);
  });

  it('solo permite al productor acceder a inventario', () => {
    expect(canAccessRoute('productor', '/panel/inventario')).toBe(true);
    expect(canAccessRoute('productor', '/panel')).toBe(false);
    expect(canAccessRoute('productor', '/panel/productos')).toBe(false);
    expect(canAccessRoute('productor', '/panel/mesas')).toBe(false);
    expect(canAccessRoute('productor', '/panel/caja')).toBe(false);
    expect(canAccessRoute('productor', '/panel/usuarios')).toBe(false);
    expect(canAccessRoute('productor', '/panel/reportes')).toBe(false);
    expect(canAccessRoute('productor', '/panel/flujo')).toBe(false);
  });
});

describe('rate limit', () => {
  beforeAll(() => {
    resetRateLimit();
  });

  it('bloquea después de varios intentos', () => {
    const key = 'test-ip';

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(checkRateLimit(key, { maxAttempts: 5, windowMs: 60_000 }).allowed).toBe(true);
    }

    const blocked = checkRateLimit(key, { maxAttempts: 5, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });
});

describe('login service', () => {
  beforeAll(async () => {
    await setupTestDatabase();
    const { getDb } = await import('@/lib/db/client');
    await createTestUser(getDb(), 'cajero1', 'secret123', 'cajero');
  });

  afterAll(async () => {
    const { resetDbClient } = await import('@/lib/db/client');
    resetDbClient();
    teardownTestDatabase();
  });

  it('autentica con credenciales válidas', async () => {
    const result = await authenticateUser('cajero1', 'secret123');
    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.user.username).toBe('cajero1');
      expect(result.user.role).toBe('cajero');
    }
  });

  it('autentica usuario productor con su rol correcto', async () => {
    const { getDb } = await import('@/lib/db/client');
    await createTestUser(getDb(), 'productor1', 'secret123', 'productor');

    const result = await authenticateUser('productor1', 'secret123');
    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.user.username).toBe('productor1');
      expect(result.user.role).toBe('productor');
    }
  });

  it('rechaza contraseña incorrecta', async () => {
    const result = await authenticateUser('cajero1', 'wrong-password');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(401);
    }
  });

  it('rechaza usuario desactivado', async () => {
    const { getDb } = await import('@/lib/db/client');
    await getDb().execute({
      sql: 'UPDATE users SET active = 0 WHERE username = ?',
      args: ['cajero1'],
    });

    const result = await authenticateUser('cajero1', 'secret123');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(403);
    }
  });
});
