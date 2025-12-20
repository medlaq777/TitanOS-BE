/**
 * Formats aggregated wellness data into a structured AI prompt
 * for risk analysis and recommendation generation.
 */
export function formatWellnessPrompt(member, summary, days) {
  const name = `${member.firstName} ${member.lastName}`;

  return `You are a sports medicine AI assistant analyzing athlete wellness data.

Analyze the following ${days}-day wellness summary for athlete "${name}" and provide:
1. An overall risk assessment (LOW, MEDIUM, or HIGH)
2. A concise summary (2-3 sentences) of the athlete's current state
3. A specific actionable recommendation

Wellness data (scores are on a scale of 1-10, where 10 is best):
- Average Fatigue: ${summary.avgFatigue}/10 (lower = more fatigued)
- Average Sleep Quality: ${summary.avgSleep}/10
- Average Stress Level: ${summary.avgStress}/10 (lower = more stressed)
- Average Mood: ${summary.avgMood !== null ? `${summary.avgMood}/10` : 'N/A'}
- Number of submissions in window: ${summary.count}
- Data window: last ${days} days

Risk thresholds:
- HIGH risk: avg fatigue < 4 OR avg sleep < 4 OR avg stress < 4
- MEDIUM risk: avg fatigue < 6 OR avg sleep < 6 OR avg stress < 6
- LOW risk: all averages >= 6

Respond in this exact JSON format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "summary": "string",
  "recommendation": "string"
}`;
}

/**
 * Computes risk level from wellness averages without AI (rule-based fallback).
 */
export function computeRiskLevel(avgFatigue, avgSleep, avgStress) {
  if (avgFatigue < 4 || avgSleep < 4 || avgStress < 4) return 'HIGH';
  if (avgFatigue < 6 || avgSleep < 6 || avgStress < 6) return 'MEDIUM';
  return 'LOW';
}

/**
 * Generates a rule-based summary when no AI API key is configured.
 */
export function generateRuleBasedInsight(member, summary, days) {
  const name = `${member.firstName} ${member.lastName}`;
  const riskLevel = computeRiskLevel(summary.avgFatigue, summary.avgSleep, summary.avgStress);

  const summaries = {
    HIGH: `${name} shows high risk indicators over the last ${days} days with critically low scores in one or more wellness dimensions. Immediate attention is required.`,
    MEDIUM: `${name} presents moderate wellness concerns over the last ${days} days. Performance may be affected and preventive action is recommended.`,
    LOW: `${name} maintains good wellness levels over the last ${days} days. All indicators are within healthy ranges.`,
  };

  const recommendations = {
    HIGH: 'Reduce training intensity immediately, consult medical staff, and prioritize recovery protocols including sleep and nutrition.',
    MEDIUM: 'Monitor closely, consider reducing training load by 20-30%, and ensure adequate recovery between sessions.',
    LOW: 'Maintain current training plan and wellness routines. Continue monitoring weekly.',
  };

  return {
    riskLevel,
    summary: summaries[riskLevel],
    recommendation: recommendations[riskLevel],
  };
}
