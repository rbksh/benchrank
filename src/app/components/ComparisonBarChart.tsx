'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Team } from '@/data/mockData';

const DynamicChart = dynamic(() => import('./ComparisonBarChartInner'), { ssr: false });

export default function ComparisonBarChart({ teams }: { teams: Team[] }) {
  return <DynamicChart teams={teams} />;
}