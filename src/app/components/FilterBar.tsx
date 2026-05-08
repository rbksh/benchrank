'use client';

import React from 'react';
import { Search, Clock } from 'lucide-react';
import type { Protocol } from '@/data/mockData';

type TimeWindow = '5m' | '30m' | 'full';

interface FilterBarProps {
  selectedProtocol: Protocol | 'ALL';
  onProtocolChange: (p: Protocol | 'ALL') => void;
  timeWindow: TimeWindow;
  onTimeWindowChange: (t: TimeWindow) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const PROTOCOLS: (Protocol | 'ALL')[] = ['ALL', 'FIX', 'REST', 'WebSocket'];
const TIME_WINDOWS: { label: string; value: TimeWindow }[] = [
  { label: 'Last 5m', value: '5m' },
  { label: 'Last 30m', value: '30m' },
  { label: 'Full Run', value: 'full' },
];

const PROTOCOL_ACTIVE: Record<string, string> = {
  ALL: 'bg-primary/20 text-primary border-primary/40',
  FIX: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40',
  REST: 'bg-neon-amber/20 text-neon-amber border-neon-amber/40',
  WebSocket: 'bg-purple-400/20 text-purple-400 border-purple-400/40',
};

export default function FilterBar({
  selectedProtocol,
  onProtocolChange,
  timeWindow,
  onTimeWindowChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-card/60 backdrop-blur-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search team or submission ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-muted border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono-data"
        />
      </div>

      {/* Protocol filter */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest mr-1 font-semibold">PROTOCOL</span>
        {PROTOCOLS.map((p) => (
          <button
            key={`proto-filter-${p}`}
            onClick={() => onProtocolChange(p)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border transition-all duration-150 font-mono-data ${
              selectedProtocol === p
                ? PROTOCOL_ACTIVE[p]
                : 'bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {p === 'WebSocket' ? 'WS' : p}
          </button>
        ))}
      </div>

      {/* Time window */}
      <div className="flex items-center gap-1 ml-auto">
        <Clock size={12} className="text-muted-foreground mr-1" />
        {TIME_WINDOWS.map((tw) => (
          <button
            key={`tw-${tw.value}`}
            onClick={() => onTimeWindowChange(tw.value)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border transition-all duration-150 font-mono-data ${
              timeWindow === tw.value
                ? 'bg-primary/20 text-primary border-primary/40' :'bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {tw.label}
          </button>
        ))}
      </div>
    </div>
  );
}