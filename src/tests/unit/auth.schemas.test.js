import { describe, it, expect } from "@jest/globals";
import { registerSchema, loginSchema } from '../../schemas/auth.schemas.js';

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({ email: 'test@test.com', password: 'password123' });
    expect(result.success).toBe(true);
    expect(result.data.role).toBe('PLAYER'); // default
  });

  it('rejects short passwords', () => {
    const result = registerSchema.safeParse({ email: 'test@test.com', password: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid emails', () => {
    const result = registerSchema.safeParse({ email: 'not-an-email', password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid role', () => {
    const result = registerSchema.safeParse({ email: 'a@b.com', password: 'password123', role: 'SUPERUSER' });
    expect(result.success).toBe(false);
  });

  it('rejects privileged roles on self-registration', () => {
    expect(registerSchema.safeParse({ email: 'a@b.com', password: 'password123', role: 'ADMIN' }).success).toBe(
      false,
    );
    expect(registerSchema.safeParse({ email: 'a@b.com', password: 'password123', role: 'STAFF' }).success).toBe(
      false,
    );
  });
});

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: 'mypassword' });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '' });
    expect(result.success).toBe(false);
  });
});
