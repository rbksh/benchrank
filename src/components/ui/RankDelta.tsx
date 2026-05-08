import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function RankDelta({ current, prev }: { current: number; prev: number }) {
  const delta = prev - current; // positive = moved up
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-muted-foreground text-[11px] font-mono-data">
        <Minus size={10} />
        <span>—</span>
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-neon-green text-[11px] font-mono-data font-semibold">
        <TrendingUp size={10} />
        <span>+{delta}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-neon-magenta text-[11px] font-mono-data font-semibold">
      <TrendingDown size={10} />
      <span>{delta}</span>
    </span>
  );
}