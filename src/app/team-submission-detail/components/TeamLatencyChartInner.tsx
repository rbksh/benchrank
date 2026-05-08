'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import type { MetricPoint } from '@/data/mockData';

function formatTs(ts: string) {
  const d = new Date(ts);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-md p-3 text-xs font-mono-data shadow-card-elevated">
      <p className="text-muted-foreground mb-2">{label} UTC</p>
      {payload.map((entry) => (
        <div key={`tl-tt-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-foreground font-semibold">{entry.value.toFixed(3)} ms</span>
        </div>
      ))}
    </div>
  );
}

export default function TeamLatencyChartInner({ data }: { data: MetricPoint[] }) {
  const formatted = data.map((d) => ({ ...d, time: formatTs(d.ts) }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="time" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} interval={4} />
        <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}ms`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }} iconType="circle" iconSize={6} />
        <ReferenceLine y={5} stroke="var(--neon-amber)" strokeDasharray="4 2" strokeOpacity={0.5} />
        <Line type="monotone" dataKey="p50" name="p50" stroke="var(--neon-cyan)" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
        <Line type="monotone" dataKey="p90" name="p90" stroke="var(--neon-amber)" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
        <Line type="monotone" dataKey="p99" name="p99" stroke="var(--neon-magenta)" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}