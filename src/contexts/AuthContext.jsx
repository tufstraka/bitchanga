import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

const AuthContext = createContext({
  isAuthenticated: false,
  identity: null,
  principal: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    AuthClient.create().then(client => {
      setAuthClient(client);
      const currentIdentity = client.getIdentity();
      setIdentity(currentIdentity);
      setPrincipal(currentIdentity.getPrincipal());
      setIsAuthenticated(!currentIdentity.getPrincipal().isAnonymous());
    });
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
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identity, principal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);