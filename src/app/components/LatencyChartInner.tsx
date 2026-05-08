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

interface Props {
  data: MetricPoint[];
  teamName: string;
}

function formatTs(ts: string) {
  const d = new Date(ts);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-md p-3 shadow-card-elevated text-xs font-mono-data">
      <p className="text-muted-foreground mb-2">{label} UTC</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.name}`} className="flex items-center justify-between gap-4 mb-1">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-foreground font-semibold">{entry.value.toFixed(3)} ms</span>
        </div>
      ))}
    </div>
  );
}

export default function LatencyChartInner({ data, teamName }: Props) {
  const formatted = data.map((d) => ({ ...d, time: formatTs(d.ts) }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <defs>
            <filter id="glow-cyan">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}ms`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-mono)', paddingTop: '8px' }}
            iconType="circle"
            iconSize={6}
          />
          <ReferenceLine y={5} stroke="var(--neon-amber)" strokeDasharray="4 2" strokeOpacity={0.5} label={{ value: 'warn', fill: 'var(--neon-amber)', fontSize: 9 }} />
          <Line
            type="monotone"
            dataKey="p50"
            name="p50"
            stroke="var(--neon-cyan)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: 'var(--neon-cyan)' }}
            filter="url(#glow-cyan)"
          />
          <Line
            type="monotone"
            dataKey="p90"
            name="p90"
            stroke="var(--neon-amber)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: 'var(--neon-amber)' }}
          />
          <Line
            type="monotone"
            dataKey="p99"
            name="p99"
            stroke="var(--neon-magenta)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: 'var(--neon-magenta)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}