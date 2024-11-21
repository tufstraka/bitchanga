'use client'
import React, { useState, useEffect } from 'react';
import { Wallet, ExternalLink, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useWallet, WalletProvider } from '../../contexts/WalletContext';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { useRouter } from 'next/navigation'; 


// Create a client-side only component for wallet interactions
const WalletConnect = dynamic(() => Promise.resolve(() => {
  const { wallet, connect, disconnect, isLoading } = useWallet();
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [error, setError] = useState('');
  const [isPlugInstalled, setIsPlugInstalled] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const router = useRouter();

  const whitelist = [
    // Add your canister IDs here
    "rrkah-fqaaa-aaaaa-aaaaq-cai"
  ];

  const network = "https://mainnet.dfinity.network";

  useEffect(() => {
    setIsClientSide(true);
    checkPlugInstallation();
  }, []);

  const checkPlugInstallation = () => {
    if (typeof window !== 'undefined') {
      const isInstalled = Boolean(window?.ic?.plug);
      setIsPlugInstalled(isInstalled);
    }
  };

  const connectPlug = async () => {
    try {
      setConnectionStatus('connecting');
      setError('');
      setSelectedWallet('plug');

      if (typeof window === 'undefined') {
        throw new Error('Window is not defined');
      }

      if (!window?.ic?.plug) {
        throw new Error('Plug wallet is not installed');
      }

      const publicKey = await window.ic.plug.requestConnect({
        whitelist,
        host: network,
      });

      const connected = await window.ic.plug.isConnected();
      
      if (!connected) {
        throw new Error('Failed to connect to Plug wallet');
      }

      const principalId = await window.ic.plug.agent.getPrincipal();
      
      if (!principalId) {
        throw new Error('Failed to get principal ID');
      }

      setConnectionStatus('success');
      
      // Save connection to context and localStorage
      await connect({
        type: 'plug',
        principalId: principalId.toString(),
        publicKey,
        connectedAt: new Date().toISOString()
      });

      return principalId;

    } catch (err) {
      console.error('Wallet connection error:', err);
      setConnectionStatus('error');
      setError(err.message || 'Failed to connect wallet');
      return null;
    }
  };

  const connectStoic = async () => {
    try {
      setConnectionStatus('connecting');
      setError('');
      setSelectedWallet('stoic');

      if (typeof window === 'undefined') {
        throw new Error('Window is not defined');
      }

      // Save current path for redirect back
      localStorage.setItem('stoic_redirect_path', window.location.pathname);
      
      // Redirect to Stoic wallet
      const host = window.location.origin;
      window.location.href = `https://www.stoicwallet.com/?destination=${encodeURIComponent(host)}`;

    } catch (err) {
      console.error('Stoic connection error:', err);
      setConnectionStatus('error');
      setError(err.message || 'Failed to connect to Stoic wallet');
    }
  };

  const handleDisconnect = async () => {
    setConnectionStatus('idle');
    await disconnect();
  };

  const renderConnectedState = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="inline-block p-4 bg-green-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Wallet Connected</h2>
      <p className="text-sm text-gray-600 mb-4">
        Principal ID: {wallet?.principalId?.slice(0, 6)}...{wallet?.principalId?.slice(-4)}
      </p>
      <button
        onClick={handleDisconnect}
        className="flex items-center space-x-2 mx-auto px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Disconnect Wallet</span>
      </button>

      <button
        onClick={ () => { router.push('/investor-dashboard')}}
        className="mt-1 flex items-center space-x-2 mx-auto px-4 py-2 border border-red-200 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
      >
        <span>Proceed to Dashboard</span>
      </button>
    </div>
  );

  const renderStatus = () => {
    switch (connectionStatus) {
      case 'connecting':
        return (
          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <AlertTitle className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
              <span>Connecting to {selectedWallet} wallet...</span>
            </AlertTitle>
            <AlertDescription>
              Please approve the connection request in your wallet
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert className="mt-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              {error || 'Please try again or choose a different wallet'}
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  if (isLoading || !isClientSide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const wallets = [
    {
      id: 'plug',
      name: 'Plug Wallet',
      description: 'Connect with the most popular ICP wallet',
      icon: '🔌',
      connectFn: connectPlug,
      installed: isPlugInstalled
    },
    {
      id: 'stoic',
      name: 'Stoic Wallet',
      description: 'Web-based wallet for Internet Computer',
      icon: '🌐',
      connectFn: connectStoic,
      installed: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-purple-100 rounded-lg mb-4">
            <Wallet className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {wallet ? 'Wallet Connected' : 'Connect Your Wallet'}
          </h1>
          <p className="mt-2 text-gray-600">
            {wallet ? 'Your wallet is connected and ready to use' : 'Choose your preferred ICP wallet to continue'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {wallet ? (
            renderConnectedState()
          ) : (
            <>
              <div className="space-y-4">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => wallet.connectFn()}
                    disabled={connectionStatus === 'connecting' || !wallet.installed}
                    className={`w-full p-4 border rounded-xl transition-all hover:border-purple-500 hover:shadow-md
                      ${selectedWallet === wallet.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}
                      ${(connectionStatus === 'connecting' || !wallet.installed) ? 'opacity-50 cursor-not-allowed' : ''}
                      flex items-center space-x-4
                    `}
                  >
                    <div className="text-2xl w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                      {wallet.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">
                        {wallet.name}
                        {!wallet.installed && wallet.id === 'plug' && ' (Not Installed)'}
                      </h3>
                      <p className="text-sm text-gray-600">{wallet.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>

              {renderStatus()}

              {!isPlugInstalled && (
                <div className="mt-6 text-center">
                  <a
                    href="https://plugwallet.ooo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    Install Plug Wallet
                  </a>
                </div>
              )}
            </>
          )}

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              New to ICP? {' '}
              <a
                href="https://internetcomputer.org/docs/current/tokenomics/identity-and-governance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 cursor-pointer hover:underline"
              >
                Learn how to set up a wallet
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}), { ssr: false });

// Wrapper component to handle script loading and provide context
const WalletConnectWrapper = () => {
  const handleScriptLoad = () => {
    console.log('Plug wallet script loaded');
  };

  return (
    <WalletProvider>
      <Script
        src="https://ic.rocks/js/plug-connect.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <WalletConnect />
    </WalletProvider>
  );
};

export default WalletConnectWrapper;