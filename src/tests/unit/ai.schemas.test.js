import { describe, it, expect } from "@jest/globals";
import { analyzeWellnessSchema, manualInsightSchema } from '../../schemas/ai.schemas.js';

describe('analyzeWellnessSchema', () => {
  it('coerces days from string', () => {
    const result = analyzeWellnessSchema.safeParse({
      memberId: '550e8400-e29b-41d4-a716-446655440000',
      days: '7',
    });
    expect(result.success).toBe(true);
    expect(result.data.days).toBe(7);
  });
});

describe('manualInsightSchema', () => {
  it('accepts valid manual insight payload', () => {
    const result = manualInsightSchema.safeParse({
      memberId: '550e8400-e29b-41d4-a716-446655440000',
      riskLevel: 'MEDIUM',
      summary: 'Manual fallback',
      recommendation: 'Reduce load',
      dataWindow: 7,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid riskLevel', () => {
    const result = manualInsightSchema.safeParse({
      memberId: '550e8400-e29b-41d4-a716-446655440000',
      riskLevel: 'CRITICAL',
      summary: 'Manual fallback',
    });
    expect(result.success).toBe(false);
  });
});
