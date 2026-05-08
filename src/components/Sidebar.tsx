'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Clock,
  Settings,
  HelpCircle,
  Activity,
  Zap,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: 'COMPETITION',
    items: [
      {
        label: 'Live Leaderboard',
        href: '/',
        icon: LayoutDashboard,
        badge: 'LIVE',
        badgeColor: 'bg-neon-green/20 text-neon-green border border-neon-green/30',
      },
      {
        label: 'Team Detail',
        href: '/team-submission-detail',
        icon: Users,
      },
      {
        label: 'Protocol Analytics',
        href: '/protocol-comparison-analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      {
        label: 'Live Metrics',
        href: '#',
        icon: Activity,
      },
      {
        label: 'Benchmark Runs',
        href: '#',
        icon: Zap,
      },
      {
        label: 'Schedule',
        href: '#',
        icon: Clock,
      },
    ],
  },
  {
    group: 'ADMIN',
    items: [
      {
        label: 'Settings',
        href: '#',
        icon: Settings,
      },
      {
        label: 'Help',
        href: '#',
        icon: HelpCircle,
      },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-border bg-card sidebar-transition overflow-hidden ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Terminal grid bg overlay */}
      <div className="absolute inset-0 terminal-grid-bg opacity-30 pointer-events-none" />

      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-border px-3 gap-3 relative z-10 ${collapsed ? 'justify-center' : ''}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-sm text-foreground tracking-tight">BenchRank</span>
            <span className="text-[10px] text-muted-foreground font-mono-data tracking-widest">IICPC 2026</span>
          </div>
        )}
      </div>

      {/* Live indicator */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 flex items-center gap-2 px-3 py-2 rounded-md bg-neon-green/5 border border-neon-green/20 relative z-10">
          <span className="w-2 h-2 rounded-full bg-neon-green live-pulse flex-shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-semibold text-neon-green tracking-widest">BENCHMARK ACTIVE</span>
            <span className="text-[10px] text-muted-foreground font-mono-data">4,200 bots · 12 teams</span>
          </div>
          <Wifi size={12} className="ml-auto text-neon-green" />
        </div>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto scrollbar-terminal py-2 relative z-10">
        {NAV_GROUPS.map((group) => (
          <div key={`group-${group.group}`} className="mb-4">
            {!collapsed && (
              <p className="px-4 py-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={`nav-${item.href}-${item.label}`}
                  href={item.href}
                  className={`group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 relative ${
                    isActive
                      ? 'bg-primary/10 text-primary neon-border-cyan border' :'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    size={16}
                    className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono-data ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: collapse toggle + event info */}
      <div className="border-t border-border relative z-10">
        {!collapsed && (
          <div className="px-4 py-3">
            <p className="text-[10px] text-muted-foreground font-mono-data">May 9 – Jun 10, 2026</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Day 0 of 32 · Submissions open</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center h-10 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}