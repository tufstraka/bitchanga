'use client';

import { useState, useEffect } from 'react';
import { createActor } from '@/lib/dfinity';
import { Header } from '@/components/Header';
import { ContributionForm } from '@/components/ContributionForm';
import { MilestonesList } from '@/components/MilestonesList';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { NotificationToast } from '@/components/ui/NotificationToast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthClient } from '@dfinity/auth-client';

export default function Platform() {
  const [isConnected, setIsConnected] = useState(false);
  const [actor, setActor] = useState(null);
  const [principal, setPrincipal] = useState(null); // New state for Principal ID
  const [milestones, setMilestones] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    initializeAuthClient();
  }, []);

  const initializeAuthClient = async () => {
    try {
      const authClient = await AuthClient.create();
      
      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal().toText()); // Store the principal ID
        await initializeActor(identity);
      } else {
        await authClient.login({
          identityProvider: 'https://identity.ic0.app',
          onSuccess: async () => {
            const identity = authClient.getIdentity();
            setPrincipal(identity.getPrincipal().toText()); // Store the principal ID
            await initializeActor(identity);
          },
        });
      }
    } catch (err) {
      setError('Failed to connect to Internet Identity');
      setLoading(false);
    }
  };

  const initializeActor = async (identity) => {
    try {
      const platformActor = await createActor(identity);
      setActor(platformActor);
      setIsConnected(true);
      await loadPlatformData(platformActor);
    } catch (err) {
      setError('Failed to connect to the platform');
      setLoading(false);
    }
  };

  const loadPlatformData = async (platformActor) => {
    try {
      const [totalContrib, milestoneCount] = await Promise.all([
        platformActor.getTotalContributions(),
        platformActor.getMilestoneCount()
      ]);

      const milestonesData = await Promise.all(
        Array.from({ length: Number(milestoneCount) }, (_, i) => 
          platformActor.getMilestone(i)
        )
      );

      setTotalContributions(Number(totalContrib));
      setMilestones(milestonesData.map(m => m.ok));
      setLoading(false);
    } catch (err) {
      setError('Failed to load platform data');
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <Header 
        isConnected={isConnected} 
        totalContributions={totalContributions} 
        principal={principal} // Pass principal to Header
      />
      <ContributionForm 
        actor={actor} 
        onSuccess={() => {
          loadPlatformData(actor);
          showNotification('Contribution successful!');
        }}
        onError={(message) => showNotification(message, 'error')}
      />
      <MilestonesList 
        milestones={milestones} 
        actor={actor}
        onUpdate={() => loadPlatformData(actor)}
        onError={(message) => showNotification(message, 'error')}
      />
      {notification && (
        <NotificationToast
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
