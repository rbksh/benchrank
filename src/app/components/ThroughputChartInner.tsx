'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { MetricPoint } from '@/data/mockData';

interface Props {
  data: MetricPoint[];
}

function formatTs(ts: string) {
  const d = new Date(ts);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-md p-3 shadow-card-elevated text-xs font-mono-data">
      <p className="text-muted-foreground mb-1">{label} UTC</p>
      <p className="text-neon-green font-semibold">{(payload[0].value / 1000).toFixed(1)}k TPS</p>
    </div>
  );
}

export default function ThroughputChartInner({ data }: Props) {
  const formatted = data.map((d) => ({ ...d, time: formatTs(d.ts), tpsK: d.tps / 1000 }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0.02} />
            </linearGradient>
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
            tickFormatter={(v) => `${v}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="tpsK"
            name="TPS"
            stroke="var(--neon-green)"
            strokeWidth={1.5}
            fill="url(#tpsGradient)"
            dot={false}
            activeDot={{ r: 3, fill: 'var(--neon-green)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}