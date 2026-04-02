import { describe, it, expect } from "@jest/globals";
import { uploadMediaSchema, presignedUrlSchema } from '../../schemas/media.schemas.js';

describe('uploadMediaSchema', () => {
  it('accepts TEAM access with teamId', () => {
    const result = uploadMediaSchema.safeParse({
      type: 'IMAGE',
      access: 'TEAM',
      teamId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects TEAM access without teamId', () => {
    const result = uploadMediaSchema.safeParse({
      type: 'IMAGE',
      access: 'TEAM',
    });
    expect(result.success).toBe(false);
  });
});

describe('presignedUrlSchema', () => {
  it('coerces expirySeconds from query string', () => {
    const result = presignedUrlSchema.safeParse({ expirySeconds: '900' });
    expect(result.success).toBe(true);
    expect(result.data.expirySeconds).toBe(900);
  });
});
