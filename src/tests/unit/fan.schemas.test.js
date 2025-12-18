import { describe, it, expect } from 'vitest';
import {
  createFanActionSchema,
  createMatchSchema,
  updateMatchEventSchema,
} from '../../schemas/fan.schemas.js';

describe('createMatchSchema', () => {
  it('accepts valid match payload', () => {
    const result = createMatchSchema.safeParse({
      homeTeamId: '550e8400-e29b-41d4-a716-446655440000',
      awayTeamId: '550e8400-e29b-41d4-a716-446655440001',
      scheduledAt: new Date().toISOString(),
      venue: 'Main Stadium',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateMatchEventSchema', () => {
  it('accepts partial update', () => {
    const result = updateMatchEventSchema.safeParse({ minute: 88 });
    expect(result.success).toBe(true);
  });

  it('rejects empty body', () => {
    const result = updateMatchEventSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('createFanActionSchema', () => {
  it('accepts valid fan action payload', () => {
    const result = createFanActionSchema.safeParse({
      matchId: '550e8400-e29b-41d4-a716-446655440000',
      type: 'VOTE',
      payload: { option: 'HOME' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid fan action type', () => {
    const result = createFanActionSchema.safeParse({
      type: 'DISLIKE',
    });
    expect(result.success).toBe(false);
  });
});
