import { describe, it, expect } from "@jest/globals";
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../common/errors.js';

describe('AppError hierarchy', () => {
  it('ValidationError has statusCode 400', () => {
    const err = new ValidationError('bad input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err instanceof AppError).toBe(true);
  });

  it('NotFoundError has statusCode 404', () => {
    const err = new NotFoundError('not found');
    expect(err.statusCode).toBe(404);
  });

  it('UnauthorizedError has statusCode 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });

  it('ForbiddenError has statusCode 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
  });

  it('ConflictError has statusCode 409', () => {
    const err = new ConflictError();
    expect(err.statusCode).toBe(409);
  });

  it('error name matches class name', () => {
    expect(new NotFoundError().name).toBe('NotFoundError');
    expect(new ValidationError('x').name).toBe('ValidationError');
  });
});
