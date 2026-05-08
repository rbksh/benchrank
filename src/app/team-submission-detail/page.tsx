import React, { Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import TeamDetailClient from './components/TeamDetailClient';

export default function TeamSubmissionDetailPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex items-center justify-center h-96 text-muted-foreground text-sm">Loading...</div>}>
        <TeamDetailClient />
      </Suspense>
    </AppLayout>
  );
}