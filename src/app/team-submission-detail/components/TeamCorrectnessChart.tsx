'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { MetricPoint } from '@/data/mockData';

const Inner = dynamic(() => import('./TeamCorrectnessChartInner'), { ssr: false });

export default function TeamCorrectnessChart({ data }: { data: MetricPoint[] }) {
  return <Inner data={data} />;
}