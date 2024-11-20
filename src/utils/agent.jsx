import { HttpAgent } from '@dfinity/agent';

export const createCustomAgent = () => {
  const localReplicaHost = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943'; // Default to local replica
  const agent = new HttpAgent({ host: localReplicaHost });

  // Fetch root key for local replica (required only in development)
  if (process.env.NODE_ENV === 'development') {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Ensure local replica is running.');
      console.error(err);
    });
  }

  return agent;
};
