import React from 'react';
import type { SubmissionStatus } from '@/data/mockData';

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  'Active': 'bg-neon-green/10 text-neon-green border-neon-green/30',
  'Under Test': 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
  'Completed': 'bg-muted text-muted-foreground border-border',
  'Failed': 'bg-neon-magenta/10 text-neon-magenta border-neon-magenta/30',
  'Queued': 'bg-neon-amber/10 text-neon-amber border-neon-amber/30',
};

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border font-mono-data ${STATUS_STYLES[status]}`}
    >
      {status === 'Under Test' && (
        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan live-pulse" />
      )}
      {status === 'Failed' && (
        <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta" />
      )}
      {status}
    </span>
  );
}