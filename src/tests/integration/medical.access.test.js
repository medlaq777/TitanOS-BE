import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { rolesGuard } from '../../middlewares/rolesGuard.js';
import { errorHandler } from '../../middlewares/globalHandlers.js';

// Simulate the medical routes access control
function buildApp(role) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => { req.user = { id: 'u1', role }; next(); });

  // Medical records — ADMIN and STAFF only
  app.get('/api/v1/medical/records', rolesGuard('ADMIN', 'STAFF'), (_req, res) => res.json([]));
  app.post('/api/v1/medical/records', rolesGuard('ADMIN', 'STAFF'), (_req, res) => res.status(201).json({}));
  app.delete('/api/v1/medical/records/:id', rolesGuard('ADMIN'), (_req, res) => res.status(204).send());

  app.use(errorHandler);
  return app;
}

describe('Medical module access security', () => {
  it('ADMIN can read medical records', async () => {
    const res = await request(buildApp('ADMIN')).get('/api/v1/medical/records');
    expect(res.status).toBe(200);
  });

  it('STAFF can read medical records', async () => {
    const res = await request(buildApp('STAFF')).get('/api/v1/medical/records');
    expect(res.status).toBe(200);
  });

  it('PLAYER cannot read medical records', async () => {
    const res = await request(buildApp('PLAYER')).get('/api/v1/medical/records');
    expect(res.status).toBe(403);
  });

  it('FAN cannot read medical records', async () => {
    const res = await request(buildApp('FAN')).get('/api/v1/medical/records');
    expect(res.status).toBe(403);
  });

  it('only ADMIN can delete medical records', async () => {
    const res = await request(buildApp('STAFF')).delete('/api/v1/medical/records/some-id');
    expect(res.status).toBe(403);
  });
});
