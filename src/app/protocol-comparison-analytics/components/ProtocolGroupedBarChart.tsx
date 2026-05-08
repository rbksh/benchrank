'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Team } from '@/data/mockData';

const Inner = dynamic(() => import('./ProtocolGroupedBarChartInner'), { ssr: false });

export default function ProtocolGroupedBarChart({
  teams,
  activeProtocol,
}: {
  teams: Team[];
  activeProtocol: string;
}) {
  return <Inner teams={teams} activeProtocol={activeProtocol} />;
}