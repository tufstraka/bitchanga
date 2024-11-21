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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeWallet = async () => {
      setIsLoading(true);
      try {
        await connect();
        /*const savedWallet = localStorage.getItem('icp_wallet');
        if (savedWallet && window?.ic?.plug) {
          const walletData = JSON.parse(savedWallet);
          if (walletData.type === 'plug') {
            const isConnected = await window.ic.plug.isConnected();
            if (isConnected) {
              const principal = await window.ic.plug.getPrincipal();
              const agent = await window.ic.plug.createAgent({
                whitelist: walletData.whitelist,
                host: walletData.host,
              });

              setWallet({
                type: 'plug',
                principalId: principal.toString(),
                connected: true,
                agent,
              });
            } else {
              localStorage.removeItem('icp_wallet');
            }
          }
        }*/
      } catch (error) {
        console.error('Error initializing wallet:', error);
        localStorage.removeItem('icp_wallet');
      } finally {
        setIsLoading(false);
      }
    };

    initializeWallet();
  }, []);

  const connect = async (walletType = 'plug') => {
    if (walletType !== 'plug') throw new Error('Unsupported wallet type');
    if (!window?.ic?.plug) throw new Error('Plug wallet not found');

    setIsLoading(true);
    try {
      const whitelist = [
        process.env.NEXT_PUBLIC_CKBTC_LEDGER_CANISTER_ID,
        process.env.NEXT_PUBLIC_CROWDFUNDING_CANISTER_ID,
      ];

      const host =
        process.env.NODE_ENV === 'development'
          ? process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943'
          : process.env.NEXT_PUBLIC_IC_HOST || 'https://identity.ic0.app';

      const connected = await window.ic.plug.requestConnect({ whitelist, host });
      if (!connected) throw new Error('User rejected connection');

      const principal = await window.ic.plug.getPrincipal();
      await window.ic.plug.createAgent({ whitelist, host });

      const agent = window.ic.plug.agent;

      const walletData = {
        type: 'plug',
        principalId: principal.toString(),
        connected: true,
        agent,
        whitelist,
        host,
      };

      setWallet(walletData);
      localStorage.setItem('icp_wallet', JSON.stringify(walletData));
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem('icp_wallet');
  };

  return (
    <WalletContext.Provider value={{ wallet, isLoading, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};


