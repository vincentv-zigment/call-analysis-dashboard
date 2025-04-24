
import { CallRecord } from './csvParser';

export interface DashboardMetrics {
  totalCalls: number;
  averageCallDuration: number;
  averageCallScore: number;
  totalConversions: number;
  subscriptionRate: number;
  agentPerformance: AgentPerformance[];
  medianTotalScore: number;
  lowScoreThreshold: number;
}

export interface AgentPerformance {
  agentId: string;
  averageScore: number;
  scriptAdherenceScore: number;
  totalCalls: number;
  conversions: number;
}

export function calculateDashboardMetrics(records: CallRecord[]): DashboardMetrics {
  if (!records.length) {
    return {
      totalCalls: 0,
      averageCallDuration: 0,
      averageCallScore: 0,
      totalConversions: 0,
      subscriptionRate: 0,
      agentPerformance: [],
      medianTotalScore: 0,
      lowScoreThreshold: 0
    };
  }

  // Basic metrics
  const totalCalls = records.length;
  const averageCallDuration = records.reduce((sum, record) => sum + record.talk_time_seconds, 0) / totalCalls;
  const averageCallScore = records.reduce((sum, record) => sum + record.total_score, 0) / totalCalls;
  const totalConversions = records.filter(record => record.converted === 'medical').length;
  const subscriptionRate = (totalConversions / totalCalls) * 100;

  // Calculate median total score
  const sortedScores = [...records].sort((a, b) => a.total_score - b.total_score);
  const medianTotalScore = sortedScores[Math.floor(sortedScores.length / 2)].total_score;
  const lowScoreThreshold = medianTotalScore * 0.7; // 30% below median

  // Agent performance
  const agentMap = new Map<string, {
    scores: number[];
    scriptAdherenceScores: number[];
    totalCalls: number;
    conversions: number;
  }>();

  records.forEach(record => {
    if (!agentMap.has(record.agent_name)) {
      agentMap.set(record.agent_name, {
        scores: [],
        scriptAdherenceScores: [],
        totalCalls: 0,
        conversions: 0
      });
    }

    const agentData = agentMap.get(record.agent_name)!;
    agentData.scores.push(record.total_score);
    agentData.scriptAdherenceScores.push(record.script_adherence_score);
    agentData.totalCalls += 1;
    if (record.converted === 'medical') {
      agentData.conversions += 1;
    }
  });

  const agentPerformance: AgentPerformance[] = Array.from(agentMap.entries()).map(([agentId, data]) => ({
    agentId,
    averageScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
    scriptAdherenceScore: Math.max(...data.scriptAdherenceScores),
    totalCalls: data.totalCalls,
    conversions: data.conversions
  }));

  // Sort by average score, descending
  agentPerformance.sort((a, b) => b.averageScore - a.averageScore);

  return {
    totalCalls,
    averageCallDuration,
    averageCallScore,
    totalConversions,
    subscriptionRate,
    agentPerformance,
    medianTotalScore,
    lowScoreThreshold
  };
}
