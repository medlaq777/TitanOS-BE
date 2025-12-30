import { describe, it, expect } from 'vitest';
import { computeRiskLevel } from '../../services/ai.prompt.js';

describe('computeRiskLevel()', () => {
  it('returns HIGH when fatigue < 4', () => {
    expect(computeRiskLevel(3, 7, 7)).toBe('HIGH');
  });

  it('returns HIGH when sleep < 4', () => {
    expect(computeRiskLevel(7, 2, 7)).toBe('HIGH');
  });

  it('returns HIGH when stress < 4', () => {
    expect(computeRiskLevel(7, 7, 3)).toBe('HIGH');
  });

  it('returns MEDIUM when fatigue < 6', () => {
    expect(computeRiskLevel(5, 7, 7)).toBe('MEDIUM');
  });

  it('returns MEDIUM when sleep < 6', () => {
    expect(computeRiskLevel(7, 5, 7)).toBe('MEDIUM');
  });

  it('returns LOW when all averages >= 6', () => {
    expect(computeRiskLevel(7, 8, 9)).toBe('LOW');
  });

  it('returns LOW at exact boundary of 6', () => {
    expect(computeRiskLevel(6, 6, 6)).toBe('LOW');
  });
});
