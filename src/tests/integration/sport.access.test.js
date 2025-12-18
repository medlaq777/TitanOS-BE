import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { rolesGuard } from '../../middlewares/rolesGuard.js';
import { errorHandler } from '../../middlewares/globalHandlers.js';

function buildApp(role) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => { req.user = { id: 'u1', role }; next(); });

  app.get('/api/sport/teams', (_req, res) => res.json([]));
  app.post('/api/sport/teams', rolesGuard('ADMIN', 'STAFF'), (_req, res) => res.status(201).json({ id: 't1' }));
  app.delete('/api/sport/teams/:id', rolesGuard('ADMIN'), (_req, res) => res.status(204).send());

  app.post('/api/sport/performances', rolesGuard('ADMIN', 'STAFF'), (_req, res) => res.status(201).json({ id: 'p1' }));
  app.delete('/api/sport/performances/:id', rolesGuard('ADMIN'), (_req, res) => res.status(204).send());

  app.use(errorHandler);
  return app;
}

describe('Sport module access security', () => {
  it('allows STAFF to create team', async () => {
    const res = await request(buildApp('STAFF')).post('/api/sport/teams').send({ name: 'A' });
    expect(res.status).toBe(201);
  });

  it('blocks PLAYER from creating team', async () => {
    const res = await request(buildApp('PLAYER')).post('/api/sport/teams').send({ name: 'A' });
    expect(res.status).toBe(403);
  });

  it('allows ADMIN to delete team', async () => {
    const res = await request(buildApp('ADMIN')).delete('/api/sport/teams/t1');
    expect(res.status).toBe(204);
  });

  it('blocks STAFF from deleting team', async () => {
    const res = await request(buildApp('STAFF')).delete('/api/sport/teams/t1');
    expect(res.status).toBe(403);
  });

  it('blocks PLAYER from creating performance', async () => {
    const res = await request(buildApp('PLAYER')).post('/api/sport/performances').send({});
    expect(res.status).toBe(403);
  });
});
