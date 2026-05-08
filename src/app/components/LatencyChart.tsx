'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { MetricPoint } from '@/data/mockData';

const DynamicChart = dynamic(() => import('./LatencyChartInner'), { ssr: false });

interface LatencyChartProps {
  data: MetricPoint[];
  teamName: string;
}

export default function LatencyChart({ data, teamName }: LatencyChartProps) {
  return <DynamicChart data={data} teamName={teamName} />;
}