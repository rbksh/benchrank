'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Activity,
  Target,
  TrendingUp,
  Clock,
  Users,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { TEAMS, generateMetricTimeSeries } from '@/data/mockData';
import type { Team, Protocol } from '@/data/mockData';
import FilterBar from './FilterBar';
import KpiCard from './KpiCard';
import LeaderboardTable from './LeaderboardTable';
import LatencyChart from './LatencyChart';
import ThroughputChart from './ThroughputChart';
import ComparisonBarChart from './ComparisonBarChart';
import LiveBadge from '@/components/ui/LiveBadge';

type TimeWindow = '5m' | '30m' | 'full';
type SortKey = 'rank' | 'compositeScore' | 'p99Latency' | 'maxTps' | 'correctness';

const CHART_POINTS: Record<TimeWindow, number> = { '5m': 5, '30m': 30, 'full': 60 };

export default function LiveLeaderboardClient() {
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | 'ALL'>('ALL');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('30m');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [lastUpdated, setLastUpdated] = useState('');
  const [tick, setTick] = useState(0);

  // Backend integration point: replace this interval with a WebSocket/SSE subscription
  // ws.onmessage = (event) => { const metrics = JSON.parse(event.data); setTeams(metrics.teams); }
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setLastUpdated(new Date().toISOString());
      // Simulate small metric fluctuations
      setTeams((prev) =>
        prev.map((team) => {
          if (team.status === 'Failed') return team;
          const jitter = (Math.random() - 0.5) * 0.04;
          return {
            ...team,
            p99Latency: parseFloat(Math.max(0.1, team.p99Latency * (1 + jitter)).toFixed(3)),
            maxTps: Math.round(team.maxTps * (1 + jitter * 0.5)),
            compositeScore: Math.round(Math.max(100, team.compositeScore * (1 + jitter * 0.2))),
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'rank' || key === 'p99Latency' ? 'asc' : 'desc');
    }
  }, [sortKey]);

  const filteredTeams = teams
    .filter((t) => {
      if (selectedProtocol !== 'ALL' && !t.protocols.includes(selectedProtocol)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.submissionId.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * mult;
    });

  const leader = teams[0];
  const chartData = generateMetricTimeSeries('team-001', CHART_POINTS[timeWindow]);
  const chartDataTps = generateMetricTimeSeries('team-001', CHART_POINTS[timeWindow]);

  const globalP99 = (teams.reduce((s, t) => s + t.p99Latency, 0) / teams.length).toFixed(2);
  const peakTps = Math.max(...teams.map((t) => t.maxTps));
  const avgCorrectness = (teams.filter(t => t.status !== 'Failed').reduce((s, t) => s + t.correctness, 0) / teams.filter(t => t.status !== 'Failed').length).toFixed(1);
  const activeCount = teams.filter((t) => t.status === 'Under Test').length;

  const formatUpdated = (iso: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')} UTC`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground tracking-tight">Live Leaderboard</h1>
              <LiveBadge />
            </div>
            <p className="text-[11px] text-muted-foreground font-mono-data mt-0.5">
              IICPC Summer Hackathon 2026 · May 9 – Jun 10 · Day 0 of 32
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-mono-data">Last updated</p>
            <p className="text-[11px] text-primary font-mono-data font-semibold">{formatUpdated(lastUpdated)}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono-data">
            <Users size={12} />
            <span>{activeCount} active</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neon-cyan font-mono-data">
            <RefreshCw size={11} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>Streaming</span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        selectedProtocol={selectedProtocol}
        onProtocolChange={setSelectedProtocol}
        timeWindow={timeWindow}
        onTimeWindowChange={setTimeWindow}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 p-6 space-y-6 max-w-screen-2xl mx-auto w-full">

        {/* KPI Bento Grid — 4 cards: 1 hero (2-col) + 3 regular = 4-col row */}
        {/* Grid plan: 4-col row. Hero spans 1 col (taller), 3 regular cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
          {/* Hero: leader composite score */}
          <div className="card-surface p-4 flex flex-col gap-2 relative overflow-hidden border-primary/30 hover:border-primary/50 transition-all duration-200 col-span-1">
            <div className="absolute top-0 left-0 right-0 h-px bg-primary" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-widest text-primary uppercase">LEADER SCORE</span>
              <span className="text-[10px] font-bold text-primary font-mono-data bg-primary/10 px-2 py-0.5 rounded border border-primary/30">
                #{leader.rank}
              </span>
            </div>
            <div className="flex items-end gap-1.5 mt-1">
              <span className="font-mono-data font-bold text-metric-hero neon-text-cyan leading-none">
                {leader.compositeScore}
              </span>
              <span className="text-xs text-muted-foreground font-mono-data mb-1">/1000</span>
            </div>
            <p className="text-xs font-semibold text-foreground">{leader.name}</p>
            <p className="text-[10px] text-muted-foreground font-mono-data">{leader.submissionId} · {leader.language}</p>
            <div className="flex gap-2 mt-1">
              <div className="flex-1">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Speed</p>
                <p className="text-[11px] font-mono-data font-semibold text-neon-cyan">{leader.speedScore}</p>
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Stability</p>
                <p className="text-[11px] font-mono-data font-semibold text-neon-green">{leader.stabilityScore}</p>
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Accuracy</p>
                <p className="text-[11px] font-mono-data font-semibold text-neon-amber">{leader.accuracyScore}</p>
              </div>
            </div>
          </div>

          {/* Global P99 Latency */}
          <KpiCard
            label="Global P99 Latency"
            value={globalP99}
            unit="ms"
            subValue={`Leader p99: ${leader.p99Latency.toFixed(2)}ms`}
            icon={Zap}
            iconColor="text-neon-cyan"
            accentClass="text-neon-cyan"
            trend="down"
            trendValue="↓ 0.14ms vs 5m ago"
          />

          {/* Peak TPS */}
          <KpiCard
            label="Peak Throughput"
            value={(peakTps / 1000).toFixed(1)}
            unit="k TPS"
            subValue={`Leader: ${(leader.maxTps / 1000).toFixed(1)}k · ${leader.name}`}
            icon={Activity}
            iconColor="text-neon-green"
            accentClass="text-neon-green"
            trend="up"
            trendValue="↑ 2.3k TPS vs 5m ago"
          />

          {/* Avg Correctness */}
          <KpiCard
            label="Avg Correctness"
            value={avgCorrectness}
            unit="%"
            subValue="Price-time priority + fill accuracy"
            icon={Target}
            iconColor="text-neon-amber"
            accentClass="text-neon-amber"
            trend="neutral"
            trendValue={`${teams.filter(t => t.correctness >= 95).length} teams ≥ 95%`}
          />
        </div>

        {/* Alert banner for flagged team */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-neon-magenta/5 border border-neon-magenta/30">
          <AlertTriangle size={14} className="text-neon-magenta flex-shrink-0" />
          <p className="text-xs text-neon-magenta font-mono-data">
            <span className="font-bold">ALERT:</span> Team <span className="font-bold">DeadReckon</span> (SUB-9a5c1f3b) is flagged — p99 latency at 38.7ms, uptime degraded to 71.3%. Correctness below 75% threshold.
          </p>
          <Clock size={12} className="text-muted-foreground ml-auto flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground font-mono-data">18:42 UTC</span>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
          {/* Latency chart */}
          <div className="card-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Latency Percentiles</h3>
                <p className="text-[11px] text-muted-foreground font-mono-data">p50 / p90 / p99 · {leader.name} · {timeWindow === '5m' ? 'Last 5 min' : timeWindow === '30m' ? 'Last 30 min' : 'Full run'}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan live-pulse" />
                <span className="text-[10px] text-neon-cyan font-mono-data font-semibold">STREAMING</span>
              </div>
            </div>
            <LatencyChart data={chartData} teamName={leader.name} />
          </div>

          {/* Throughput chart */}
          <div className="card-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Throughput (TPS)</h3>
                <p className="text-[11px] text-muted-foreground font-mono-data">Max sustained TPS · {leader.name} · {timeWindow === '5m' ? 'Last 5 min' : timeWindow === '30m' ? 'Last 30 min' : 'Full run'}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={12} className="text-neon-green" />
                <span className="text-[11px] text-neon-green font-mono-data font-semibold">
                  {(leader.maxTps / 1000).toFixed(1)}k peak
                </span>
              </div>
            </div>
            <ThroughputChart data={chartDataTps} />
          </div>
        </div>

        {/* Comparison bar chart */}
        <div className="card-surface p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Score Breakdown — Top 8 Teams</h3>
              <p className="text-[11px] text-muted-foreground font-mono-data">Speed · Stability · Accuracy sub-scores compared</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono-data text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-cyan inline-block" /> Speed</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-green inline-block" /> Stability</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-amber inline-block" /> Accuracy</span>
            </div>
          </div>
          <ComparisonBarChart teams={filteredTeams} />
        </div>

        {/* Leaderboard table */}
        <div className="card-surface">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-foreground">Global Rankings</h3>
              <span className="text-[10px] font-mono-data text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {filteredTeams.length} of {teams.length} teams
              </span>
              {selectedProtocol !== 'ALL' && (
                <span className="text-[10px] font-mono-data text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 px-2 py-0.5 rounded">
                  Protocol: {selectedProtocol}
                </span>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono-data">
              Bot fleet: 4,200 concurrent · 3 protocols active
            </div>
          </div>
          <LeaderboardTable
            teams={filteredTeams}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          {filteredTeams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity size={32} className="text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground">No teams match this filter</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try changing the protocol filter or clearing the search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}