'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Activity, Target, Shield, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, Circle, Server,  } from 'lucide-react';
import { TEAMS, generateMetricTimeSeries, getTeamProtocolMetrics } from '@/data/mockData';
import type { Team } from '@/data/mockData';
import ProtocolBadge from '@/components/ui/ProtocolBadge';
import LanguageBadge from '@/components/ui/LanguageBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import RankDelta from '@/components/ui/RankDelta';
import LiveBadge from '@/components/ui/LiveBadge';
import TeamLatencyChart from './TeamLatencyChart';
import TeamThroughputChart from './TeamThroughputChart';
import TeamCorrectnessChart from './TeamCorrectnessChart';

const BENCHMARK_PHASES = [
  { id: 'phase-sandbox', label: 'Sandboxing', time: '07:22:04', status: 'done' },
  { id: 'phase-warmup', label: 'Warmup (500 bots)', time: '07:24:18', status: 'done' },
  { id: 'phase-ramp', label: 'Ramp-up (2,100 bots)', time: '07:26:55', status: 'done' },
  { id: 'phase-peak', label: 'Peak Load (4,200 bots)', time: '07:31:42', status: 'active' },
  { id: 'phase-cooldown', label: 'Cooldown', time: '—', status: 'pending' },
  { id: 'phase-score', label: 'Score Finalization', time: '—', status: 'pending' },
];

export default function TeamDetailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const teamId = searchParams.get('teamId') || 'team-001';

  const [team, setTeam] = useState<Team | undefined>(TEAMS.find((t) => t.id === teamId));
  const [activeTab, setActiveTab] = useState<'overview' | 'protocols' | 'timeline'>('overview');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const found = TEAMS.find((t) => t.id === teamId);
    setTeam(found);
  }, [teamId]);

  // Backend integration point: WebSocket subscription for this team's live metrics
  // ws.onmessage = (msg) => { if (msg.teamId === teamId) setTeam(msg.data); }
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Server size={40} className="text-muted-foreground mb-4" />
        <p className="text-sm font-semibold text-foreground">Team not found</p>
        <p className="text-xs text-muted-foreground mt-1">The submission ID may be invalid or the team has been removed.</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 rounded-md bg-primary/10 text-primary text-xs font-semibold border border-primary/30 hover:bg-primary/20 transition-colors">
          Back to Leaderboard
        </button>
      </div>
    );
  }

  const chartData = generateMetricTimeSeries(team.id, 30);
  const protocolMetrics = getTeamProtocolMetrics(team.id);

  const TABS = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'protocols' as const, label: 'Protocol Breakdown' },
    { id: 'timeline' as const, label: 'Benchmark Timeline' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm sticky top-0 z-20">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          Leaderboard
        </button>
        <ChevronRight size={12} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-mono-data">{team.submissionId}</span>
        <ChevronRight size={12} className="text-muted-foreground" />
        <span className="text-sm font-bold text-foreground">{team.name}</span>
        <div className="ml-auto flex items-center gap-3">
          <LiveBadge />
          <StatusBadge status={team.status} />
        </div>
      </div>

      <div className="flex-1 p-6 max-w-screen-2xl mx-auto w-full space-y-6">

        {/* Team identity panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          {/* Team info */}
          <div className="card-surface p-5 flex flex-col gap-4 col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-foreground">{team.name}</h2>
                  {team.flagged && <AlertTriangle size={14} className="text-neon-magenta" />}
                </div>
                <p className="text-[11px] font-mono-data text-muted-foreground">{team.submissionId}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <LanguageBadge language={team.language} />
                <div className="flex gap-1">
                  {team.protocols.map((p) => (
                    <ProtocolBadge key={`team-proto-${p}`} protocol={p} />
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Team Members</p>
              <div className="space-y-2">
                {team.members.map((m) => (
                  <div key={`member-${m.handle}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-primary">{m.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono-data">{m.handle}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono-data">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">Submitted</p>
              <p className="text-xs font-mono-data text-foreground">
                {new Date(team.submittedAt).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false,
                })} UTC
              </p>
              <p className="text-[10px] text-muted-foreground font-mono-data mt-0.5">
                Bot fleet: {team.botFleetSize.toLocaleString()} concurrent bots
              </p>
            </div>
          </div>

          {/* Rank + composite score panel */}
          <div className="card-surface p-5 flex flex-col gap-3 col-span-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-primary" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <p className="text-[10px] text-primary uppercase tracking-widest font-semibold">Composite Score</p>
            <div className="flex items-end gap-2">
              <span className="font-mono-data font-bold neon-text-cyan leading-none" style={{ fontSize: '3rem' }}>
                {team.compositeScore}
              </span>
              <span className="text-sm text-muted-foreground font-mono-data mb-2">/1000</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(team.compositeScore / 1000) * 100}%`,
                  background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-green))',
                  boxShadow: '0 0 8px rgba(0, 245, 212, 0.5)',
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-1">
              <div className="text-center">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Speed</p>
                <p className="text-lg font-mono-data font-bold text-neon-cyan">{team.speedScore}</p>
                <p className="text-[9px] text-muted-foreground font-mono-data">/333</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Stability</p>
                <p className="text-lg font-mono-data font-bold text-neon-green">{team.stabilityScore}</p>
                <p className="text-[9px] text-muted-foreground font-mono-data">/333</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Accuracy</p>
                <p className="text-lg font-mono-data font-bold text-neon-amber">{team.accuracyScore}</p>
                <p className="text-[9px] text-muted-foreground font-mono-data">/334</p>
              </div>
            </div>
          </div>

          {/* Current rank panel */}
          <div className="card-surface p-5 flex flex-col gap-3 col-span-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Current Rank</p>
            <div className="flex items-center gap-3">
              <span className="font-mono-data font-bold text-foreground leading-none" style={{ fontSize: '3rem' }}>
                #{team.rank}
              </span>
              <div className="flex flex-col gap-1">
                <RankDelta current={team.rank} prev={team.prevRank} />
                <span className="text-[10px] text-muted-foreground font-mono-data">vs. last window</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Uptime</p>
                <p className={`text-sm font-mono-data font-bold ${team.uptime >= 99 ? 'text-neon-green' : team.uptime >= 95 ? 'text-neon-amber' : 'text-neon-magenta'}`}>
                  {team.uptime}%
                </p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Correctness</p>
                <p className={`text-sm font-mono-data font-bold ${team.correctness >= 99 ? 'text-neon-green' : team.correctness >= 95 ? 'text-neon-cyan' : 'text-neon-amber'}`}>
                  {team.correctness}%
                </p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">P99 Latency</p>
                <p className={`text-sm font-mono-data font-bold ${team.p99Latency < 2 ? 'text-neon-green' : team.p99Latency < 8 ? 'text-neon-amber' : 'text-neon-magenta'}`}>
                  {team.p99Latency.toFixed(2)}ms
                </p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Max TPS</p>
                <p className="text-sm font-mono-data font-bold text-foreground">
                  {(team.maxTps / 1000).toFixed(1)}k
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI cards row — 6 cards in 3+3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
          {[
            { label: 'P50 Latency', value: `${team.p50Latency.toFixed(3)}ms`, color: 'text-neon-green', icon: Zap, alert: false },
            { label: 'P90 Latency', value: `${team.p90Latency.toFixed(3)}ms`, color: 'text-neon-cyan', icon: Zap, alert: false },
            { label: 'P99 Latency', value: `${team.p99Latency.toFixed(2)}ms`, color: team.p99Latency > 8 ? 'text-neon-magenta' : 'text-neon-amber', icon: Zap, alert: team.p99Latency > 8 },
            { label: 'Max TPS', value: `${(team.maxTps / 1000).toFixed(1)}k`, color: 'text-neon-green', icon: Activity, alert: false },
            { label: 'Correctness', value: `${team.correctness.toFixed(1)}%`, color: team.correctness < 90 ? 'text-neon-magenta' : 'text-neon-cyan', icon: Target, alert: team.correctness < 90 },
            { label: 'Uptime', value: `${team.uptime}%`, color: team.uptime < 95 ? 'text-neon-magenta' : 'text-neon-green', icon: Shield, alert: team.uptime < 95 },
          ].map((kpi) => (
            <div
              key={`kpi-${kpi.label}`}
              className={`card-surface p-3 flex flex-col gap-1.5 relative overflow-hidden ${kpi.alert ? 'border-neon-magenta/40 bg-neon-magenta/5' : 'hover:border-primary/30'} transition-all duration-200`}
            >
              <div className={`absolute top-0 left-0 right-0 h-px ${kpi.alert ? 'bg-neon-magenta' : 'bg-border'}`} />
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">{kpi.label}</span>
                <kpi.icon size={11} className={kpi.alert ? 'text-neon-magenta' : kpi.color} />
              </div>
              <span className={`font-mono-data font-bold text-lg leading-none ${kpi.color}`}>{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold transition-all duration-150 border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview — charts */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
              <div className="card-surface p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Latency Percentiles</h3>
                    <p className="text-[11px] text-muted-foreground font-mono-data">p50 · p90 · p99 over last 30 minutes</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-neon-cyan font-mono-data">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan live-pulse" />
                    LIVE
                  </span>
                </div>
                <TeamLatencyChart data={chartData} />
              </div>

              <div className="card-surface p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Throughput (TPS)</h3>
                    <p className="text-[11px] text-muted-foreground font-mono-data">Transactions per second over last 30 minutes</p>
                  </div>
                  <TrendingUp size={13} className="text-neon-green" />
                </div>
                <TeamThroughputChart data={chartData} />
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Correctness Score</h3>
                  <p className="text-[11px] text-muted-foreground font-mono-data">Price-time priority validation + fill accuracy % over time</p>
                </div>
                <span className={`text-xs font-mono-data font-bold ${team.correctness >= 99 ? 'text-neon-green' : 'text-neon-amber'}`}>
                  Current: {team.correctness.toFixed(1)}%
                </span>
              </div>
              <TeamCorrectnessChart data={chartData} />
            </div>
          </div>
        )}

        {/* Tab: Protocol Breakdown */}
        {activeTab === 'protocols' && (
          <div className="animate-fade-in">
            <div className="card-surface overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Per-Protocol Metric Breakdown</h3>
                <p className="text-[11px] text-muted-foreground font-mono-data mt-0.5">
                  Performance isolated by protocol endpoint — FIX, REST, WebSocket
                </p>
              </div>
              <div className="overflow-x-auto scrollbar-terminal">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-3/40">
                      {['PROTOCOL', 'P50 LAT', 'P90 LAT', 'P99 LAT', 'MAX TPS', 'CORRECTNESS', 'UPTIME', 'PROTO SCORE'].map((h) => (
                        <th key={`proto-th-${h}`} className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {protocolMetrics.map((pm) => (
                      <tr key={`pm-row-${pm.protocol}`} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-3">
                          <ProtocolBadge protocol={pm.protocol} />
                        </td>
                        <td className="px-4 py-3 font-mono-data text-neon-green font-semibold">{pm.p50.toFixed(3)}ms</td>
                        <td className="px-4 py-3 font-mono-data text-neon-cyan font-semibold">{pm.p90.toFixed(3)}ms</td>
                        <td className="px-4 py-3 font-mono-data text-neon-amber font-semibold">{pm.p99.toFixed(3)}ms</td>
                        <td className="px-4 py-3 font-mono-data text-foreground">{(pm.maxTps / 1000).toFixed(1)}k</td>
                        <td className="px-4 py-3 font-mono-data text-neon-cyan font-semibold">{pm.correctness.toFixed(2)}%</td>
                        <td className="px-4 py-3 font-mono-data text-neon-green font-semibold">{pm.uptime}%</td>
                        <td className="px-4 py-3">
                          <span className="font-mono-data font-bold text-primary text-sm">{pm.score}</span>
                        </td>
                      </tr>
                    ))}
                    {team.protocols.length < 3 && (
                      <tr className="border-b border-border/30">
                        <td colSpan={8} className="px-4 py-3 text-center text-[11px] text-muted-foreground font-mono-data">
                          {3 - team.protocols.length} protocol(s) not exposed by this submission
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Benchmark Timeline */}
        {activeTab === 'timeline' && (
          <div className="animate-fade-in">
            <div className="card-surface p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Benchmark Run Timeline</h3>
              <div className="relative">
                <div className="absoluteleft-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-0">
                  {BENCHMARK_PHASES.map((phase, idx) => (
                    <div key={phase.id} className="flex items-start gap-4 pl-4 pb-6 relative">
                      <div className={`absolute left-4 top-3 w-3 h-3 rounded-full -translate-x-1/2 border-2 flex items-center justify-center ${
                        phase.status === 'done'
                          ? 'bg-neon-green border-neon-green'
                          : phase.status === 'active' ?'bg-neon-cyan border-neon-cyan live-pulse' :'bg-background border-border'
                      }`} />
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${
                              phase.status === 'done' ? 'text-foreground' : phase.status === 'active' ? 'text-neon-cyan' : 'text-muted-foreground'
                            }`}>
                              {phase.label}
                            </span>
                            {phase.status === 'done' && <CheckCircle2 size={12} className="text-neon-green" />}
                            {phase.status === 'active' && (
                              <span className="text-[9px] font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 px-1.5 py-0.5 rounded font-mono-data">
                                IN PROGRESS
                              </span>
                            )}
                            {phase.status === 'pending' && <Circle size={12} className="text-muted-foreground" />}
                          </div>
                          <span className="text-[11px] font-mono-data text-muted-foreground">{phase.time}</span>
                        </div>
                        {phase.status === 'active' && (
                          <p className="text-[11px] text-muted-foreground font-mono-data mt-1">
                            4,200 bots active · {team.maxTps.toLocaleString()} TPS · p99 {team.p99Latency.toFixed(2)}ms
                          </p>
                        )}
                        {phase.status === 'done' && idx === 2 && (
                          <p className="text-[11px] text-muted-foreground font-mono-data mt-1">
                            Ramp completed — no degradation detected
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}