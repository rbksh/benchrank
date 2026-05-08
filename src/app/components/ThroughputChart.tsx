'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { MetricPoint } from '@/data/mockData';

const DynamicChart = dynamic(() => import('./ThroughputChartInner'), { ssr: false });

interface ThroughputChartProps {
  data: MetricPoint[];
}

export default function ThroughputChart({ data }: ThroughputChartProps) {
  return <DynamicChart data={data} />;
}