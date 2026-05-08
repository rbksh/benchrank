import React from 'react';

export default function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-widest bg-neon-green/10 text-neon-green border border-neon-green/30 font-mono-data">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-green live-pulse" />
      LIVE
    </span>
  );
}