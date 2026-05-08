'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { Team } from '@/data/mockData';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-md p-3 text-xs font-mono-data shadow-card-elevated">
      <p className="text-foreground font-semibold mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`pgbc-tt-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-foreground font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProtocolGroupedBarChartInner({
  teams,
  activeProtocol,
}: {
  teams: Team[];
  activeProtocol: string;
}) {
  const top8 = teams.slice(0, 8).map((t) => ({
    name: t.name.length > 10 ? t.name.slice(0, 10) + '…' : t.name,
    Speed: t.speedScore,
    Stability: t.stabilityScore,
    Accuracy: t.accuracyScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={top8} margin={{ top: 8, right: 16, left: -10, bottom: 0 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          domain={[0, 350]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }}
          iconType="circle"
          iconSize={6}
        />
        <Bar
          dataKey="Speed"
          fill={activeProtocol === 'REST' ? 'var(--neon-amber)' : activeProtocol === 'WebSocket' ? '#a78bfa' : 'var(--neon-cyan)'}
          radius={[2, 2, 0, 0]}
          maxBarSize={14}
        />
        <Bar dataKey="Stability" fill="var(--neon-green)" radius={[2, 2, 0, 0]} maxBarSize={14} />
        <Bar dataKey="Accuracy" fill="var(--neon-amber)" radius={[2, 2, 0, 0]} maxBarSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}