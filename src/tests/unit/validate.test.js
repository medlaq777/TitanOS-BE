import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validate, validateAll } from '../../common/validate.js';
import { ValidationError } from '../../common/errors.js';

describe('validate()', () => {
  const schema = z.object({ name: z.string().min(1), age: z.number().int().positive() });

  it('returns parsed data on valid input', () => {
    const result = validate(schema, { name: 'Alice', age: 25 });
    expect(result).toEqual({ name: 'Alice', age: 25 });
  });

  it('strips unknown fields', () => {
    const result = validate(schema, { name: 'Alice', age: 25, extra: 'unwanted' });
    expect(result).not.toHaveProperty('extra');
  });

  it('throws ValidationError on missing required field', () => {
    expect(() => validate(schema, { name: 'Alice' })).toThrow(ValidationError);
  });

  it('includes field path in error message', () => {
    try {
      validate(schema, { age: -1 });
    } catch (err) {
      expect(err.message).toContain('name');
    }
  });
});

describe('validateAll()', () => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

  it('throws ValidationError with all errors on invalid input', () => {
    expect(() => validateAll(schema, { email: 'bad', password: 'short' })).toThrow(ValidationError);
  });
});
