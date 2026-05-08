import React from 'react';
import type { Protocol } from '@/data/mockData';

const PROTOCOL_STYLES: Record<Protocol, string> = {
  FIX: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
  REST: 'bg-neon-amber/10 text-neon-amber border-neon-amber/30',
  WebSocket: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
};

export default function ProtocolBadge({ protocol }: { protocol: Protocol }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border font-mono-data ${PROTOCOL_STYLES[protocol]}`}
    >
      {protocol === 'WebSocket' ? 'WS' : protocol}
    </span>
  );
}