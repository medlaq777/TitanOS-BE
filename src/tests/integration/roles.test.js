import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { rolesGuard } from '../../middlewares/rolesGuard.js';
import { errorHandler } from '../../middlewares/globalHandlers.js';
function buildApp(role) {
  const app = express();
  app.use(express.json());
  // Simulate authenticated user
  app.use((req, _res, next) => { req.user = { id: 'u1', role }; next(); });
  app.get('/admin-only', rolesGuard('ADMIN'), (_req, res) => res.json({ ok: true }));
  app.get('/staff-or-admin', rolesGuard('ADMIN', 'STAFF'), (_req, res) => res.json({ ok: true }));
  app.use(errorHandler);
  return app;
}

describe('rolesGuard', () => {
  it('allows ADMIN to access admin-only route', async () => {
    const res = await request(buildApp('ADMIN')).get('/admin-only');
    expect(res.status).toBe(200);
  });

  it('blocks PLAYER from admin-only route with 403', async () => {
    const res = await request(buildApp('PLAYER')).get('/admin-only');
    expect(res.status).toBe(403);
  });

  it('allows STAFF to access staff-or-admin route', async () => {
    const res = await request(buildApp('STAFF')).get('/staff-or-admin');
    expect(res.status).toBe(200);
  });

  it('blocks FAN from staff-or-admin route with 403', async () => {
    const res = await request(buildApp('FAN')).get('/staff-or-admin');
    expect(res.status).toBe(403);
  });
});
