import { createContext, useContext, useState, useEffect } from 'react';
import { HttpAgent } from '@dfinity/agent';

const WalletContext = createContext(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // We need to ensure that window and localStorage access is done only on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component mounts on the client
  }, []);

  useEffect(() => {
    if (!isClient) return; // Skip if we're on the server (hydration phase)

    const initializeWallet = async () => {
      try {
        const savedWallet = localStorage.getItem('icp_wallet');

        if (savedWallet) {
          const walletData = JSON.parse(savedWallet);

          if (walletData.type === 'plug' && window?.ic?.plug) {
            const isConnected = await window.ic.plug.isConnected();

            if (isConnected) {
              const principal = await window.ic.plug.agent.getPrincipal();
              const agent = window.ic.plug.agent;

              const safeWalletData = {
                type: walletData.type,
                principalId: principal.toString(),
                connected: true,
                agent, // Save the agent in the wallet state
              };

              setWallet(safeWalletData);
            } else {
              localStorage.removeItem('icp_wallet');
            }
          }
        }
      } catch (error) {
        console.error('Error restoring wallet connection:', error);
        localStorage.removeItem('icp_wallet');
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      initializeWallet();
    }
  }, [isClient]);

  const connect = async (walletType = 'plug') => {
    try {
      setIsLoading(true);

      if (walletType === 'plug') {
        if (!window?.ic?.plug) {
          throw new Error('Plug wallet not found');
        }

        const whitelist = [process.env.NEXT_PUBLIC_CKBTC_LEDGER_CANISTER_ID];

        const host =
          process.env.NODE_ENV === 'development'
            ? process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943'
            : process.env.NEXT_PUBLIC_IC_HOST || 'https://identity.ic0.app';

        const connectResult = await window.ic.plug.requestConnect({ whitelist, host });

        if (!connectResult) {
          throw new Error('User rejected connection');
        }

        const principal = await window.ic.plug.agent.getPrincipal();
        const agent = window.ic.plug.agent; // Get the agent from Plug

        const safeWalletData = {
          type: 'plug',
          principalId: principal.toString(),
          connected: true,
          agent, // Save the agent in the wallet state
        };

        setWallet(safeWalletData);
        localStorage.setItem('icp_wallet', JSON.stringify(safeWalletData));
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsLoading(true);

      if (wallet?.type === 'plug' && window?.ic?.plug) {
        // Plug doesn't have a disconnect method, but we can clear our state
      }

      setWallet(null);
      localStorage.removeItem('icp_wallet');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null; // Prevent rendering of the component until the client-side code runs

  return (
    <WalletContext.Provider value={{ wallet, isLoading, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

