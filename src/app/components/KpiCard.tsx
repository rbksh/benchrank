import React from 'react';
import { LucideIcon } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface KpiCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentClass?: string;
  alertState?: boolean;
  unit?: string;
  isHero?: boolean;
}

export default function KpiCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor,
  trend,
  trendValue,
  accentClass = 'text-primary',
  alertState = false,
  unit,
  isHero = false,
}: KpiCardProps) {
  return (
    <div
      className={`card-surface p-4 flex flex-col gap-2 relative overflow-hidden transition-all duration-200 hover:border-primary/30 ${
        alertState ? 'border-neon-magenta/40 bg-neon-magenta/5' : ''
      } ${isHero ? 'row-span-1' : ''}`}
    >
      {/* Accent glow top */}
      <div
        className={`absolute top-0 left-0 right-0 h-px ${
          alertState ? 'bg-neon-magenta' : 'bg-primary/30'
        }`}
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-md flex items-center justify-center ${
            alertState ? 'bg-neon-magenta/10' : 'bg-muted/60'
          }`}
        >
          <Icon size={14} className={alertState ? 'text-neon-magenta' : iconColor} />
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        <span className={`font-mono-data font-bold leading-none ${accentClass} ${isHero ? 'text-metric-hero' : 'text-metric-md'}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground font-mono-data mb-0.5">{unit}</span>
        )}
      </div>

      {subValue && (
        <p className="text-[11px] text-muted-foreground font-mono-data">{subValue}</p>
      )}

      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-auto">
          <span
            className={`text-[10px] font-semibold font-mono-data ${
              trend === 'up' ? 'text-neon-green' : trend === 'down' ? 'text-neon-magenta' : 'text-muted-foreground'
            }`}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}