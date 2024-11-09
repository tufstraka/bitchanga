'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, XAxis, YAxis, Line, Tooltip } from 'recharts';
import { Principal } from '@dfinity/principal';

export default function ContributionHistory({ actor, authClient }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (actor && authClient) {
      loadHistory();
    }
  }, [actor, authClient]);

  const loadHistory = async () => {
    try {
      const userInfo = await actor.getBackerInfo(
        Principal.fromText(authClient.getIdentity().getPrincipal().toText())
      );
      
      if (userInfo) {
        const contributionHistory = userInfo.timestamps.map((timestamp, index) => ({
          date: new Date(Number(timestamp) / 1000000).toLocaleDateString(),
          amount: userInfo.contribution
        }));
        setHistory(contributionHistory);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  if (history.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Contribution History</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={600} height={300} data={history}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </CardContent>
    </Card>
  );
}