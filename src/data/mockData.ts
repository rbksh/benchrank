export type Protocol = 'FIX' | 'REST' | 'WebSocket';
export type Language = 'C++' | 'Rust' | 'Go';
export type SubmissionStatus = 'Active' | 'Under Test' | 'Completed' | 'Failed' | 'Queued';

export interface TeamMember {
  name: string;
  handle: string;
  role: string;
}

export interface Team {
  id: string;
  name: string;
  submissionId: string;
  language: Language;
  protocols: Protocol[];
  members: TeamMember[];
  status: SubmissionStatus;
  submittedAt: string;
  rank: number;
  prevRank: number;
  compositeScore: number;
  speedScore: number;
  stabilityScore: number;
  accuracyScore: number;
  p50Latency: number;
  p90Latency: number;
  p99Latency: number;
  maxTps: number;
  correctness: number;
  uptime: number;
  botFleetSize: number;
  flagged: boolean;
}

export interface MetricPoint {
  ts: string;
  p50: number;
  p90: number;
  p99: number;
  tps: number;
  correctness: number;
  compositeScore: number;
}

export interface ProtocolMetric {
  protocol: Protocol;
  p50: number;
  p90: number;
  p99: number;
  maxTps: number;
  correctness: number;
  uptime: number;
  score: number;
}

export const TEAMS: Team[] = [
  {
    id: 'team-001',
    name: 'QuantumEdge',
    submissionId: 'SUB-7f3a9b2c',
    language: 'Rust',
    protocols: ['FIX', 'REST', 'WebSocket'],
    members: [
      { name: 'Arjun Mehta', handle: '@arjun_m', role: 'Lead' },
      { name: 'Priya Nair', handle: '@priya_n', role: 'Backend' },
      { name: 'Rishi Kapoor', handle: '@rishi_k', role: 'Infra' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T14:22:00Z',
    rank: 1,
    prevRank: 2,
    compositeScore: 947,
    speedScore: 312,
    stabilityScore: 328,
    accuracyScore: 307,
    p50Latency: 0.38,
    p90Latency: 0.71,
    p99Latency: 1.24,
    maxTps: 87400,
    correctness: 99.4,
    uptime: 99.9,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-002',
    name: 'NullPointerException',
    submissionId: 'SUB-2d8e4f1a',
    language: 'C++',
    protocols: ['FIX', 'WebSocket'],
    members: [
      { name: 'Yuki Tanaka', handle: '@yuki_t', role: 'Lead' },
      { name: 'Sven Larsson', handle: '@sven_l', role: 'Core' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T09:15:00Z',
    rank: 2,
    prevRank: 1,
    compositeScore: 921,
    speedScore: 334,
    stabilityScore: 298,
    accuracyScore: 289,
    p50Latency: 0.29,
    p90Latency: 0.58,
    p99Latency: 1.07,
    maxTps: 92100,
    correctness: 97.8,
    uptime: 99.7,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-003',
    name: 'AlphaSignal',
    submissionId: 'SUB-9c1b7e3d',
    language: 'Go',
    protocols: ['REST', 'WebSocket'],
    members: [
      { name: 'Fatima Al-Hassan', handle: '@fatima_ah', role: 'Lead' },
      { name: 'Diego Reyes', handle: '@diego_r', role: 'Algo' },
      { name: 'Lin Wei', handle: '@lin_w', role: 'Infra' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T11:40:00Z',
    rank: 3,
    prevRank: 3,
    compositeScore: 889,
    speedScore: 291,
    stabilityScore: 302,
    accuracyScore: 296,
    p50Latency: 0.52,
    p90Latency: 1.03,
    p99Latency: 2.18,
    maxTps: 71300,
    correctness: 98.6,
    uptime: 99.5,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-004',
    name: 'ByteForge',
    submissionId: 'SUB-5a2c8d4e',
    language: 'Rust',
    protocols: ['FIX', 'REST'],
    members: [
      { name: 'Nikolai Petrov', handle: '@nikolai_p', role: 'Lead' },
      { name: 'Amara Osei', handle: '@amara_o', role: 'Core' },
      { name: 'Kenji Watanabe', handle: '@kenji_w', role: 'Algo' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T16:05:00Z',
    rank: 4,
    prevRank: 5,
    compositeScore: 856,
    speedScore: 278,
    stabilityScore: 289,
    accuracyScore: 289,
    p50Latency: 0.61,
    p90Latency: 1.24,
    p99Latency: 2.87,
    maxTps: 68900,
    correctness: 97.2,
    uptime: 99.1,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-005',
    name: 'OrderFlux',
    submissionId: 'SUB-3e7f9a1b',
    language: 'C++',
    protocols: ['FIX', 'REST', 'WebSocket'],
    members: [
      { name: 'Isabelle Fontaine', handle: '@isabelle_f', role: 'Lead' },
      { name: 'Tariq Hassan', handle: '@tariq_h', role: 'Infra' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T08:30:00Z',
    rank: 5,
    prevRank: 4,
    compositeScore: 834,
    speedScore: 271,
    stabilityScore: 281,
    accuracyScore: 282,
    p50Latency: 0.74,
    p90Latency: 1.52,
    p99Latency: 3.41,
    maxTps: 63200,
    correctness: 96.9,
    uptime: 98.8,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-006',
    name: 'MatchEngine9',
    submissionId: 'SUB-6b4d2f8c',
    language: 'Go',
    protocols: ['WebSocket', 'REST'],
    members: [
      { name: 'Rohan Sharma', handle: '@rohan_s', role: 'Lead' },
      { name: 'Elena Volkova', handle: '@elena_v', role: 'Core' },
      { name: 'James Okafor', handle: '@james_o', role: 'Algo' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T13:20:00Z',
    rank: 6,
    prevRank: 7,
    compositeScore: 812,
    speedScore: 264,
    stabilityScore: 274,
    accuracyScore: 274,
    p50Latency: 0.89,
    p90Latency: 1.78,
    p99Latency: 4.02,
    maxTps: 58700,
    correctness: 96.1,
    uptime: 98.4,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-007',
    name: 'CryptoArb',
    submissionId: 'SUB-1a9c5e7f',
    language: 'Rust',
    protocols: ['FIX'],
    members: [
      { name: 'Mei Ling Chen', handle: '@mei_lc', role: 'Lead' },
      { name: 'Oluwaseun Adeyemi', handle: '@seun_a', role: 'Infra' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T10:55:00Z',
    rank: 7,
    prevRank: 6,
    compositeScore: 787,
    speedScore: 257,
    stabilityScore: 261,
    accuracyScore: 269,
    p50Latency: 1.02,
    p90Latency: 2.14,
    p99Latency: 5.38,
    maxTps: 52300,
    correctness: 95.7,
    uptime: 97.9,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-008',
    name: 'TurboBook',
    submissionId: 'SUB-8d3f6b2a',
    language: 'C++',
    protocols: ['REST', 'WebSocket'],
    members: [
      { name: 'Aditya Singh', handle: '@aditya_s', role: 'Lead' },
      { name: 'Sofia Martínez', handle: '@sofia_m', role: 'Backend' },
      { name: 'Luca Bianchi', handle: '@luca_b', role: 'Algo' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T15:10:00Z',
    rank: 8,
    prevRank: 9,
    compositeScore: 761,
    speedScore: 248,
    stabilityScore: 254,
    accuracyScore: 259,
    p50Latency: 1.18,
    p90Latency: 2.47,
    p99Latency: 6.12,
    maxTps: 47800,
    correctness: 94.3,
    uptime: 97.2,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-009',
    name: 'NanosecHFT',
    submissionId: 'SUB-4e1a7c9d',
    language: 'C++',
    protocols: ['FIX', 'WebSocket'],
    members: [
      { name: 'Kwame Asante', handle: '@kwame_a', role: 'Lead' },
      { name: 'Hana Yoshida', handle: '@hana_y', role: 'Core' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T12:00:00Z',
    rank: 9,
    prevRank: 8,
    compositeScore: 738,
    speedScore: 241,
    stabilityScore: 247,
    accuracyScore: 250,
    p50Latency: 1.34,
    p90Latency: 2.89,
    p99Latency: 7.44,
    maxTps: 43100,
    correctness: 93.8,
    uptime: 96.5,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-010',
    name: 'ZeroLatency',
    submissionId: 'SUB-7c2e4a8f',
    language: 'Go',
    protocols: ['REST'],
    members: [
      { name: 'Marcus Webb', handle: '@marcus_w', role: 'Lead' },
      { name: 'Preethi Nair', handle: '@preethi_n', role: 'Algo' },
      { name: 'Andrei Popescu', handle: '@andrei_p', role: 'Infra' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T17:30:00Z',
    rank: 10,
    prevRank: 10,
    compositeScore: 712,
    speedScore: 232,
    stabilityScore: 238,
    accuracyScore: 242,
    p50Latency: 1.57,
    p90Latency: 3.24,
    p99Latency: 8.91,
    maxTps: 38600,
    correctness: 92.4,
    uptime: 95.8,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-011',
    name: 'PricePriority',
    submissionId: 'SUB-2f8b3d5e',
    language: 'Rust',
    protocols: ['FIX', 'REST'],
    members: [
      { name: 'Chioma Eze', handle: '@chioma_e', role: 'Lead' },
      { name: 'Viktor Svensson', handle: '@viktor_sv', role: 'Core' },
    ],
    status: 'Under Test',
    submittedAt: '2026-05-07T07:45:00Z',
    rank: 11,
    prevRank: 12,
    compositeScore: 681,
    speedScore: 221,
    stabilityScore: 229,
    accuracyScore: 231,
    p50Latency: 1.93,
    p90Latency: 4.17,
    p99Latency: 11.2,
    maxTps: 31400,
    correctness: 91.1,
    uptime: 94.3,
    botFleetSize: 4200,
    flagged: false,
  },
  {
    id: 'team-012',
    name: 'DeadReckon',
    submissionId: 'SUB-9a5c1f3b',
    language: 'Go',
    protocols: ['WebSocket'],
    members: [
      { name: 'Rashid Al-Mansoori', handle: '@rashid_am', role: 'Lead' },
      { name: 'Nadia Kovač', handle: '@nadia_k', role: 'Backend' },
      { name: 'Soren Nielsen', handle: '@soren_n', role: 'Algo' },
    ],
    status: 'Failed',
    submittedAt: '2026-05-07T18:00:00Z',
    rank: 12,
    prevRank: 11,
    compositeScore: 423,
    speedScore: 134,
    stabilityScore: 148,
    accuracyScore: 141,
    p50Latency: 4.82,
    p90Latency: 12.4,
    p99Latency: 38.7,
    maxTps: 12800,
    correctness: 74.2,
    uptime: 71.3,
    botFleetSize: 4200,
    flagged: true,
  },
];

export function generateMetricTimeSeries(teamId: string, points: number = 30): MetricPoint[] {
  const baseTeam = TEAMS.find((t) => t.id === teamId);
  if (!baseTeam) return [];

  const now = Date.now();
  const intervalMs = 60000; // 1 min per point
  const series: MetricPoint[] = [];

  for (let i = points - 1; i >= 0; i--) {
    const ts = new Date(now - i * intervalMs).toISOString();
    const jitter = (Math.sin(i * 0.7 + 1.2) * 0.15 + Math.sin(i * 1.3) * 0.08);
    const spike = i === 8 || i === 19 ? 2.1 : 1;
    const dip = i === 14 ? 0.7 : 1;

    series.push({
      ts,
      p50: parseFloat((baseTeam.p50Latency * (1 + jitter * 0.3) * spike * dip).toFixed(3)),
      p90: parseFloat((baseTeam.p90Latency * (1 + jitter * 0.4) * spike * dip).toFixed(3)),
      p99: parseFloat((baseTeam.p99Latency * (1 + jitter * 0.5) * spike * dip).toFixed(3)),
      tps: Math.round(baseTeam.maxTps * (0.85 + jitter * 0.15) * dip),
      correctness: parseFloat(Math.min(100, baseTeam.correctness * (1 + jitter * 0.02)).toFixed(2)),
      compositeScore: Math.round(baseTeam.compositeScore * (0.95 + jitter * 0.05)),
    });
  }
  return series;
}

export function getTeamProtocolMetrics(teamId: string): ProtocolMetric[] {
  const team = TEAMS.find((t) => t.id === teamId);
  if (!team) return [];

  const protocolOffsets: Record<Protocol, { latencyMult: number; tpsMult: number; corrOffset: number }> = {
    FIX: { latencyMult: 0.95, tpsMult: 1.05, corrOffset: 0.3 },
    REST: { latencyMult: 1.1, tpsMult: 0.92, corrOffset: -0.2 },
    WebSocket: { latencyMult: 1.0, tpsMult: 0.98, corrOffset: 0.1 },
  };

  return team.protocols.map((protocol) => {
    const off = protocolOffsets[protocol];
    return {
      protocol,
      p50: parseFloat((team.p50Latency * off.latencyMult).toFixed(3)),
      p90: parseFloat((team.p90Latency * off.latencyMult).toFixed(3)),
      p99: parseFloat((team.p99Latency * off.latencyMult).toFixed(3)),
      maxTps: Math.round(team.maxTps * off.tpsMult),
      correctness: parseFloat((team.correctness + off.corrOffset).toFixed(2)),
      uptime: team.uptime,
      score: Math.round(team.compositeScore * off.tpsMult * 0.98),
    };
  });
}

export const PROTOCOL_AGGREGATE: Record<Protocol, { avgP99: number; avgTps: number; avgCorrectness: number; teamCount: number; topTeam: string }> = {
  FIX: { avgP99: 3.82, avgTps: 58200, avgCorrectness: 96.4, teamCount: 8, topTeam: 'NullPointerException' },
  REST: { avgP99: 4.91, avgTps: 51700, avgCorrectness: 95.8, teamCount: 9, topTeam: 'QuantumEdge' },
  WebSocket: { avgP99: 5.34, avgTps: 48300, avgCorrectness: 95.1, teamCount: 7, topTeam: 'QuantumEdge' },
};

export const HEATMAP_DATA = TEAMS.slice(0, 10).map((team) => ({
  teamId: team.id,
  teamName: team.name,
  metrics: {
    p99_fix: parseFloat((team.p99Latency * 0.95).toFixed(2)),
    p99_rest: parseFloat((team.p99Latency * 1.1).toFixed(2)),
    p99_ws: parseFloat((team.p99Latency * 1.0).toFixed(2)),
    tps_fix: Math.round(team.maxTps * 1.05),
    tps_rest: Math.round(team.maxTps * 0.92),
    tps_ws: Math.round(team.maxTps * 0.98),
    corr_fix: parseFloat((team.correctness + 0.3).toFixed(2)),
    corr_rest: parseFloat((team.correctness - 0.2).toFixed(2)),
    corr_ws: parseFloat((team.correctness + 0.1).toFixed(2)),
  },
}));