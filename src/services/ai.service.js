import OpenAI from 'openai';
import { NotFoundError, ValidationError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import { analyzeWellnessSchema } from '../schemas/ai.schemas.js';
import {
  formatWellnessPrompt,
  computeRiskLevel,
  generateRuleBasedInsight,
} from './ai.prompt.js';

function buildSummary(forms) {
  const count = forms.length;
  if (count === 0) return null;

  const avg = (key) => {
    const values = forms.map((f) => f[key]).filter((v) => v != null);
    if (!values.length) return null;
    return parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
  };

  return {
    count,
    avgFatigue: avg('fatigue'),
    avgSleep: avg('sleep'),
    avgStress: avg('stress'),
    avgMood: avg('mood'),
  };
}

export class AIService {
  constructor(aiRepository, wellnessRepository, memberRepository) {
    this.aiRepository = aiRepository;
    this.wellnessRepository = wellnessRepository;
    this.memberRepository = memberRepository;

    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }

  // TIT-115: Integrate OpenAI / LangChain
  async callOpenAI(prompt) {
    const response = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(content);
    const { riskLevel, summary, recommendation } = parsed;

    if (!['LOW', 'MEDIUM', 'HIGH'].includes(riskLevel)) {
      throw new Error(`Invalid riskLevel from AI: ${riskLevel}`);
    }

    return { riskLevel, summary, recommendation };
  }

  // TIT-116: Generate risk score (AI or rule-based)
  async generateInsight(member, summary, days) {
    if (this.openai) {
      try {
        const prompt = formatWellnessPrompt(member, summary, days);
        return await this.callOpenAI(prompt);
      } catch (err) {
        console.error('[AIService] OpenAI call failed, falling back to rule-based:', err.message);
      }
    }
    return generateRuleBasedInsight(member, summary, days);
  }

  // TIT-117: Store AIInsight result + full analyze flow
  async analyzeWellness(body) {
    const { memberId, days } = validate(analyzeWellnessSchema, body);

    const member = await this.memberRepository.findById(memberId);
    if (!member) throw new NotFoundError('Member not found');

    const recentForms = await this.wellnessRepository.findRecentByMember(memberId, days);
    const summary = buildSummary(recentForms);

    if (!summary || summary.count === 0) {
      throw new ValidationError(`No wellness data found for member in the last ${days} days`);
    }

    const { riskLevel, summary: insightSummary, recommendation } = await this.generateInsight(
      member,
      summary,
      days,
    );

    const insight = await this.aiRepository.createInsight({
      memberId,
      riskLevel,
      summary: insightSummary,
      recommendation,
      dataWindow: days,
    });

    return insight;
  }

  async getInsightsByMember(memberId) {
    return this.aiRepository.findAllByMember(memberId);
  }

  async getLatestInsight(memberId) {
    const insight = await this.aiRepository.findLatestByMember(memberId);
    if (!insight) throw new NotFoundError('No AI insight found for this member');
    return insight;
  }

  async getInsightById(id) {
    const insight = await this.aiRepository.findById(id);
    if (!insight) throw new NotFoundError('AI insight not found');
    return insight;
  }

  async deleteInsight(id) {
    await this.getInsightById(id);
    return this.aiRepository.deleteById(id);
  }
}
