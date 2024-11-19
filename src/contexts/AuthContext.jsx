import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

const AuthContext = createContext({
  isAuthenticated: false,
  identity: null,
  principal: null,
  agent: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const initializeAuthClient = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      const currentIdentity = client.getIdentity();
      setIdentity(currentIdentity);
      setPrincipal(currentIdentity.getPrincipal());
      setIsAuthenticated(!currentIdentity.getPrincipal().isAnonymous());

      // Initialize the agent using the current identity
      const httpAgent = new HttpAgent({ identity: currentIdentity });
      if (process.env.NODE_ENV === "development") {
        httpAgent.fetchRootKey(); // Fetch root key for local replica in development
      }
      setAgent(httpAgent);
    };

    initializeAuthClient();
  }, []);

  const login = async () => {
    if (!authClient) return;

    await new Promise((resolve) => {
      authClient.login({
        identityProvider: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL,
        onSuccess: () => {
          const currentIdentity = authClient.getIdentity();
          setIdentity(currentIdentity);
          setPrincipal(currentIdentity.getPrincipal());
          setIsAuthenticated(true);

          // Update the agent with the new identity
          const httpAgent = new HttpAgent({ identity: currentIdentity });
          if (process.env.NODE_ENV === "development") {
            httpAgent.fetchRootKey();
          }
          setAgent(httpAgent);

          resolve();
        },
      });
    });
  };

  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setPrincipal(null);
    setAgent(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, principal, agent, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
