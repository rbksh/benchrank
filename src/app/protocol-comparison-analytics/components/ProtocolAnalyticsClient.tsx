'use client';

import React, { useState } from 'react';
import { Activity, AlertTriangle, BarChart3,  } from 'lucide-react';
import { TEAMS, PROTOCOL_AGGREGATE, HEATMAP_DATA } from '@/data/mockData';
import type { Protocol } from '@/data/mockData';
import ProtocolBadge from '@/components/ui/ProtocolBadge';
import LanguageBadge from '@/components/ui/LanguageBadge';
import RankDelta from '@/components/ui/RankDelta';
import ProtocolGroupedBarChart from './ProtocolGroupedBarChart';
import LiveBadge from '@/components/ui/LiveBadge';

type ActiveProtocol = Protocol | 'ALL';

const PROTOCOLS: Protocol[] = ['FIX', 'REST', 'WebSocket'];

const PROTOCOL_COLORS: Record<Protocol, string> = {
  FIX: 'var(--neon-cyan)',
  REST: 'var(--neon-amber)',
  WebSocket: '#a78bfa',
};

const PROTOCOL_BG: Record<Protocol, string> = {
  FIX: 'bg-neon-cyan/5 border-neon-cyan/20',
  REST: 'bg-neon-amber/5 border-neon-amber/20',
  WebSocket: 'bg-purple-400/5 border-purple-400/20',
};

const PROTOCOL_TEXT: Record<Protocol, string> = {
  FIX: 'text-neon-cyan',
  REST: 'text-neon-amber',
  WebSocket: 'text-purple-400',
};

// Heatmap color interpolation: value is 0–1 normalized
function heatmapColor(normalized: number, invert = false): string {
  const n = invert ? 1 - normalized : normalized;
  if (n >= 0.85) return 'bg-neon-green/50 text-neon-green';
  if (n >= 0.65) return 'bg-neon-cyan/40 text-neon-cyan';
  if (n >= 0.45) return 'bg-neon-amber/40 text-neon-amber';
  if (n >= 0.25) return 'bg-orange-500/40 text-orange-400';
  return 'bg-neon-magenta/50 text-neon-magenta';
}

// For latency: lower is better (invert)
function normalizeLatency(val: number, min: number, max: number) {
  return 1 - (val - min) / (max - min);
}
function normalizeTps(val: number, min: number, max: number) {
  return (val - min) / (max - min);
}
function normalizeCorr(val: number, min: number, max: number) {
  return (val - min) / (max - min);
}

const HEATMAP_COLS = [
  { key: 'p99_fix', label: 'P99 FIX', protocol: 'FIX' as Protocol, type: 'latency' },
  { key: 'p99_rest', label: 'P99 REST', protocol: 'REST' as Protocol, type: 'latency' },
  { key: 'p99_ws', label: 'P99 WS', protocol: 'WebSocket' as Protocol, type: 'latency' },
  { key: 'tps_fix', label: 'TPS FIX', protocol: 'FIX' as Protocol, type: 'tps' },
  { key: 'tps_rest', label: 'TPS REST', protocol: 'REST' as Protocol, type: 'tps' },
  { key: 'tps_ws', label: 'TPS WS', protocol: 'WebSocket' as Protocol, type: 'tps' },
  { key: 'corr_fix', label: 'CORR FIX', protocol: 'FIX' as Protocol, type: 'corr' },
  { key: 'corr_rest', label: 'CORR REST', protocol: 'REST' as Protocol, type: 'corr' },
  { key: 'corr_ws', label: 'CORR WS', protocol: 'WebSocket' as Protocol, type: 'corr' },
];

export default function ProtocolAnalyticsClient() {
  const [activeProtocol, setActiveProtocol] = useState<ActiveProtocol>('ALL');

  // Pre-compute min/max for normalization
  const allP99 = HEATMAP_DATA.flatMap((r) => [r.metrics.p99_fix, r.metrics.p99_rest, r.metrics.p99_ws]);
  const allTps = HEATMAP_DATA.flatMap((r) => [r.metrics.tps_fix, r.metrics.tps_rest, r.metrics.tps_ws]);
  const allCorr = HEATMAP_DATA.flatMap((r) => [r.metrics.corr_fix, r.metrics.corr_rest, r.metrics.corr_ws]);
  const minP99 = Math.min(...allP99), maxP99 = Math.max(...allP99);
  const minTps = Math.min(...allTps), maxTps = Math.max(...allTps);
  const minCorr = Math.min(...allCorr), maxCorr = Math.max(...allCorr);

  function getCellColor(col: typeof HEATMAP_COLS[0], val: number) {
    if (col.type === 'latency') return heatmapColor(normalizeLatency(val, minP99, maxP99));
    if (col.type === 'tps') return heatmapColor(normalizeTps(val, minTps, maxTps));
    return heatmapColor(normalizeCorr(val, minCorr, maxCorr));
  }

  function formatHeatVal(col: typeof HEATMAP_COLS[0], val: number) {
    if (col.type === 'latency') return `${val.toFixed(1)}ms`;
    if (col.type === 'tps') return `${(val / 1000).toFixed(0)}k`;
    return `${val.toFixed(1)}%`;
  }

  const filteredTeams = activeProtocol === 'ALL'
    ? TEAMS
    : TEAMS.filter((t) => t.protocols.includes(activeProtocol as Protocol));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground tracking-tight">Protocol Comparison Analytics</h1>
            <LiveBadge />
          </div>
          <p className="text-[11px] text-muted-foreground font-mono-data mt-0.5">
            Cross-team performance breakdown by FIX · REST · WebSocket · IICPC 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground font-mono-data mr-2 uppercase tracking-widest">Protocol</span>
          {(['ALL', ...PROTOCOLS] as (ActiveProtocol)[]).map((p) => (
            <button
              key={`proto-tab-${p}`}
              onClick={() => setActiveProtocol(p)}
              className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wider border transition-all duration-150 font-mono-data ${
                activeProtocol === p
                  ? p === 'ALL' ?'bg-primary/20 text-primary border-primary/40'
                    : p === 'FIX' ?'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40'
                    : p === 'REST' ?'bg-neon-amber/20 text-neon-amber border-neon-amber/40' :'bg-purple-400/20 text-purple-400 border-purple-400/40' :'bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {p === 'WebSocket' ? 'WS' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 max-w-screen-2xl mx-auto w-full space-y-6">

        {/* Protocol health cards — 3 cards, 3-col */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          {PROTOCOLS.map((proto) => {
            const agg = PROTOCOL_AGGREGATE[proto];
            return (
              <div
                key={`proto-card-${proto}`}
                className={`card-surface p-4 flex flex-col gap-3 border relative overflow-hidden cursor-pointer transition-all duration-200 ${
                  activeProtocol === proto
                    ? `${PROTOCOL_BG[proto]} border-opacity-60`
                    : 'hover:border-primary/30'
                }`}
                onClick={() => setActiveProtocol(activeProtocol === proto ? 'ALL' : proto)}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: PROTOCOL_COLORS[proto] }}
                />
                <div className="flex items-center justify-between">
                  <ProtocolBadge protocol={proto} />
                  <span className={`text-[10px] font-mono-data font-semibold ${PROTOCOL_TEXT[proto]}`}>
                    {agg.teamCount} teams
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Avg P99</p>
                    <p className={`text-sm font-mono-data font-bold ${PROTOCOL_TEXT[proto]}`}>
                      {agg.avgP99.toFixed(2)}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Avg TPS</p>
                    <p className="text-sm font-mono-data font-bold text-foreground">
                      {(agg.avgTps / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Avg Corr</p>
                    <p className="text-sm font-mono-data font-bold text-neon-amber">
                      {agg.avgCorrectness.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-mono-data">Top performer</span>
                  <span className={`text-[11px] font-semibold ${PROTOCOL_TEXT[proto]}`}>{agg.topTeam}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grouped bar chart */}
        <div className="card-surface p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Score Breakdown by Protocol</h3>
              <p className="text-[11px] text-muted-foreground font-mono-data">
                Top 8 teams · Speed · Stability · Accuracy per protocol
                {activeProtocol !== 'ALL' && ` · Filtered: ${activeProtocol}`}
              </p>
            </div>
            <BarChart3 size={16} className="text-muted-foreground" />
          </div>
          <ProtocolGroupedBarChart teams={filteredTeams} activeProtocol={activeProtocol} />
        </div>

        {/* Heatmap */}
        <div className="card-surface p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Performance Heatmap</h3>
              <p className="text-[11px] text-muted-foreground font-mono-data">
                All teams × all metrics × all protocols · Color intensity = performance tier
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono-data text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-neon-green/50 inline-block" />
                Excellent
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-neon-cyan/40 inline-block" />
                Good
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-neon-amber/40 inline-block" />
                Fair
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-neon-magenta/50 inline-block" />
                Poor
              </span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-terminal">
            <table className="w-full min-w-[900px] border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold tracking-widest text-muted-foreground uppercase w-32 sticky left-0 bg-card z-10">
                    TEAM
                  </th>
                  {/* Group headers */}
                  <th colSpan={3} className="px-2 py-2 text-center text-[10px] font-semibold tracking-widest text-neon-cyan uppercase border-l border-border">
                    P99 LATENCY (ms)
                  </th>
                  <th colSpan={3} className="px-2 py-2 text-center text-[10px] font-semibold tracking-widest text-neon-green uppercase border-l border-border">
                    MAX TPS
                  </th>
                  <th colSpan={3} className="px-2 py-2 text-center text-[10px] font-semibold tracking-widest text-neon-amber uppercase border-l border-border">
                    CORRECTNESS %
                  </th>
                </tr>
                <tr className="border-b border-border">
                  <th className="px-3 py-1.5 sticky left-0 bg-card z-10" />
                  {HEATMAP_COLS.map((col) => (
                    <th
                      key={`hm-th-${col.key}`}
                      className={`px-2 py-1.5 text-center text-[9px] font-bold tracking-widest uppercase ${
                        col.protocol === 'FIX' ? 'text-neon-cyan' : col.protocol === 'REST' ? 'text-neon-amber' : 'text-purple-400'
                      } ${['p99_fix', 'tps_fix', 'corr_fix'].includes(col.key) ? 'border-l border-border' : ''}`}
                    >
                      {col.protocol === 'WebSocket' ? 'WS' : col.protocol}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP_DATA.map((row, rowIdx) => {
                  const team = TEAMS.find((t) => t.id === row.teamId);
                  return (
                    <tr
                      key={`hm-row-${row.teamId}`}
                      className={`border-b border-border/40 hover:bg-primary/5 transition-colors ${rowIdx % 2 === 0 ? '' : 'bg-surface-3/20'}`}
                    >
                      <td className="px-3 py-2 sticky left-0 bg-card z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-data text-muted-foreground w-4">{rowIdx + 1}</span>
                          <div>
                            <p className="text-xs font-semibold text-foreground truncate max-w-[100px]">{row.teamName}</p>
                            {team && <LanguageBadge language={team.language} />}
                          </div>
                        </div>
                      </td>
                      {HEATMAP_COLS.map((col) => {
                        const val = row.metrics[col.key as keyof typeof row.metrics] as number;
                        const colorClass = getCellColor(col, val);
                        return (
                          <td
                            key={`hm-cell-${row.teamId}-${col.key}`}
                            className={`px-2 py-2 text-center font-mono-data font-semibold text-[11px] rounded-sm transition-colors ${colorClass} ${
                              ['p99_fix', 'tps_fix', 'corr_fix'].includes(col.key) ? 'border-l border-border' : ''
                            }`}
                          >
                            {formatHeatVal(col, val)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Protocol ranking table */}
        <div className="card-surface">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-foreground">Protocol Ranking</h3>
              <span className="text-[10px] font-mono-data text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {filteredTeams.length} teams
              </span>
              {activeProtocol !== 'ALL' && (
                <ProtocolBadge protocol={activeProtocol as Protocol} />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono-data">
              Sorted by composite score · {activeProtocol === 'ALL' ? 'All protocols' : activeProtocol}
            </p>
          </div>
          <div className="overflow-x-auto scrollbar-terminal">
            <table className="w-full min-w-[900px] text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-3/40">
                  {['RANK', 'TEAM', 'LANGUAGE', 'PROTOCOLS', 'COMPOSITE', 'P99 LAT', 'MAX TPS', 'CORRECTNESS', 'UPTIME'].map((h) => (
                    <th key={`pr-th-${h}`} className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTeams
                  .sort((a, b) => b.compositeScore - a.compositeScore)
                  .map((team, idx) => (
                    <tr
                      key={`pr-row-${team.id}`}
                      className={`border-b border-border/50 hover:bg-primary/5 transition-colors group ${
                        team.flagged ? 'bg-neon-magenta/5' : idx % 2 === 0 ? '' : 'bg-surface-3/20'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono-data font-bold text-sm ${
                            idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-orange-400' : 'text-muted-foreground'
                          }`}>
                            {idx + 1}
                          </span>
                          <RankDelta current={team.rank} prev={team.prevRank} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {team.flagged && <AlertTriangle size={11} className="text-neon-magenta" />}
                          <span className="font-semibold text-foreground">{team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <LanguageBadge language={team.language} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {team.protocols.map((p) => (
                            <ProtocolBadge key={`pr-proto-${team.id}-${p}`} protocol={p} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono-data font-bold text-sm ${
                          team.compositeScore > 800 ? 'text-neon-cyan' : team.compositeScore > 600 ? 'text-neon-amber' : 'text-neon-magenta'
                        }`}>
                          {team.compositeScore}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono-data text-sm font-semibold ${
                          team.p99Latency < 2 ? 'text-neon-green' : team.p99Latency < 8 ? 'text-neon-amber' : 'text-neon-magenta'
                        }`}>
                          {team.p99Latency.toFixed(2)}ms
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono-data text-sm text-foreground">
                          {(team.maxTps / 1000).toFixed(1)}k
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono-data text-sm font-semibold ${
                          team.correctness >= 99 ? 'text-neon-green' : team.correctness >= 95 ? 'text-neon-cyan' : team.correctness >= 90 ? 'text-neon-amber' : 'text-neon-magenta'
                        }`}>
                          {team.correctness.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono-data text-sm font-semibold ${
                          team.uptime >= 99 ? 'text-neon-green' : team.uptime >= 95 ? 'text-neon-amber' : 'text-neon-magenta'
                        }`}>
                          {team.uptime}%
                        </span>
                      </td>
                    </tr>
                  ))}
                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Activity size={28} className="text-muted-foreground" />
                        <p className="text-sm font-semibold text-foreground">No teams expose this protocol</p>
                        <p className="text-xs text-muted-foreground">
                          Switch to ALL or a different protocol to see rankings
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}