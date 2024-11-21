'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectStats({ actor }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [actor]);

  const loadStats = async () => {
    try {
      const projectStats = await actor.getProjectStats();
      setStats(projectStats);
    } catch (e) {
      console.error('Failed to load stats:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Contributions</p>
          <p className="text-2xl font-bold">
            {stats?.totalContributions ?? 0} ckBTC
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Backers</p>
          <p className="text-2xl font-bold">{stats?.backerCount ?? 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Milestones</p>
          <p className="text-2xl font-bold">{stats?.milestoneCount ?? 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}