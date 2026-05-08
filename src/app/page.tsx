import React from 'react';
import AppLayout from '@/components/AppLayout';
import LiveLeaderboardClient from './components/LiveLeaderboardClient';

export default function LiveLeaderboardPage() {
  return (
    <AppLayout>
      <LiveLeaderboardClient />
    </AppLayout>
  );
}