'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpDown, ChevronUp, ChevronDown, ExternalLink, AlertTriangle } from 'lucide-react';
import type { Team } from '@/data/mockData';
import ProtocolBadge from '@/components/ui/ProtocolBadge';
import LanguageBadge from '@/components/ui/LanguageBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import RankDelta from '@/components/ui/RankDelta';

type SortKey = 'rank' | 'compositeScore' | 'p99Latency' | 'maxTps' | 'correctness';

interface LeaderboardTableProps {
  teams: Team[];
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
}

const RANK_MEDAL: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-slate-300',
  3: 'text-orange-400',
};

export default function LeaderboardTable({ teams, sortKey, sortDir, onSort }: LeaderboardTableProps) {
  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={10} className="text-muted-foreground ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp size={10} className="text-primary ml-1" />
      : <ChevronDown size={10} className="text-primary ml-1" />;
  };

  const thCls = (col: SortKey) =>
    `px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase cursor-pointer select-none transition-colors ${
      sortKey === col ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <div className="overflow-x-auto scrollbar-terminal">
      <table className="w-full min-w-[1000px] border-collapse text-xs">
        <thead>
          <tr className="border-b border-border bg-surface-3/60">
            <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground w-12">
              <button onClick={() => onSort('rank')} className="flex items-center">
                RANK <SortIcon col="rank" />
              </button>
            </th>
            <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              TEAM
            </th>
            <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              SUB ID
            </th>
            <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              LANG
            </th>
            <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              PROTOCOLS
            </th>
            <th className={thCls('compositeScore')}>
              <button onClick={() => onSort('compositeScore')} className="flex items-center">
                SCORE <SortIcon col="compositeScore" />
              </button>
            </th>
            <th className={thCls('p99Latency')}>
              <button onClick={() => onSort('p99Latency')} className="flex items-center">
                P99 LAT <SortIcon col="p99Latency" />
              </button>
            </th>
            <th className={thCls('maxTps')}>
              <button onClick={() => onSort('maxTps')} className="flex items-center">
                MAX TPS <SortIcon col="maxTps" />
              </button>
            </th>
            <th className={thCls('correctness')}>
              <button onClick={() => onSort('correctness')} className="flex items-center">
                CORRECTNESS <SortIcon col="correctness" />
              </button>
            </th>
            <th className="px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              STATUS
            </th>
            <th className="px-3 py-2.5 w-8" />
          </tr>
        </thead>
        <tbody>
          {teams.map((team, idx) => (
            <tr
              key={`lb-row-${team.id}`}
              className={`border-b border-border/50 transition-all duration-150 hover:bg-primary/5 cursor-pointer group ${
                team.flagged ? 'bg-neon-magenta/5' : idx % 2 === 0 ? 'bg-transparent' : 'bg-surface-3/20'
              }`}
            >
              {/* Rank */}
              <td className="px-3 py-3">
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono-data font-bold text-sm w-5 text-center ${RANK_MEDAL[team.rank] || 'text-muted-foreground'}`}>
                    {team.rank}
                  </span>
                  <RankDelta current={team.rank} prev={team.prevRank} />
                </div>
              </td>

              {/* Team name */}
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  {team.flagged && <AlertTriangle size={11} className="text-neon-magenta flex-shrink-0" />}
                  <span className="font-semibold text-foreground text-[13px]">{team.name}</span>
                </div>
              </td>

              {/* Sub ID */}
              <td className="px-3 py-3">
                <span className="font-mono-data text-[11px] text-muted-foreground">{team.submissionId}</span>
              </td>

              {/* Language */}
              <td className="px-3 py-3">
                <LanguageBadge language={team.language} />
              </td>

              {/* Protocols */}
              <td className="px-3 py-3">
                <div className="flex gap-1 flex-wrap">
                  {team.protocols.map((p) => (
                    <ProtocolBadge key={`proto-${team.id}-${p}`} protocol={p} />
                  ))}
                </div>
              </td>

              {/* Composite score */}
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(team.compositeScore / 1000) * 100}%`,
                        background: team.compositeScore > 800
                          ? 'var(--neon-cyan)'
                          : team.compositeScore > 600
                          ? 'var(--neon-amber)'
                          : 'var(--neon-magenta)',
                      }}
                    />
                  </div>
                  <span className={`font-mono-data font-bold text-sm ${
                    team.compositeScore > 800 ? 'text-neon-cyan' : team.compositeScore > 600 ? 'text-neon-amber' : 'text-neon-magenta'
                  }`}>
                    {team.compositeScore}
                  </span>
                </div>
              </td>

              {/* P99 Latency */}
              <td className="px-3 py-3">
                <span className={`font-mono-data text-sm font-semibold ${
                  team.p99Latency < 2 ? 'text-neon-green' : team.p99Latency < 8 ? 'text-neon-amber' : 'text-neon-magenta'
                }`}>
                  {team.p99Latency.toFixed(2)}ms
                </span>
              </td>

              {/* Max TPS */}
              <td className="px-3 py-3">
                <span className="font-mono-data text-sm text-foreground">
                  {(team.maxTps / 1000).toFixed(1)}k
                </span>
              </td>

              {/* Correctness */}
              <td className="px-3 py-3">
                <span className={`font-mono-data text-sm font-semibold ${
                  team.correctness >= 99 ? 'text-neon-green' : team.correctness >= 95 ? 'text-neon-cyan' : team.correctness >= 90 ? 'text-neon-amber' : 'text-neon-magenta'
                }`}>
                  {team.correctness.toFixed(1)}%
                </span>
              </td>

              {/* Status */}
              <td className="px-3 py-3">
                <StatusBadge status={team.status} />
              </td>

              {/* Action */}
              <td className="px-3 py-3">
                <Link
                  href={`/team-submission-detail?teamId=${team.id}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={13} className="text-primary" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}