'use client'

import React, { useEffect, useState } from 'react';
import { Wallet, CheckCircle, AlertCircle, LogOut, ArrowRight, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { Actor } from '@dfinity/agent';
import { idlFactory } from '@/declarations/crowdfunding_platform/bitchanga_backend.did';
import { Principal } from '@dfinity/principal';
import { useAgent, useAuth, useIdentity } from '@nfid/identitykit/react';
import { motion, AnimatePresence } from 'framer-motion';
import { walletService } from '@/services/api';

const formatCKBTC = (amount) => {
  return `${(amount / 100_000_000).toFixed(8)} ckBTC`;
};

const RegistrationStatus = ({ status, error, registrationTime, transactionId }) => {
  const getStatusContent = () => {
    switch (status) {
      case 'UserNotAuthenticated':
        return {
          title: 'Authentication Required',
          description: 'Please connect your Internet Identity to continue.',
          variant: 'destructive'
        };
      case 'AlreadyRegistered':
        return {
          title: 'Already Registered',
          description: `You registered on ${new Date(Number(registrationTime/1000000n)).toLocaleString()}`,
          variant: 'default'
        };
      case 'InsufficientFee':
        return {
          title: 'Insufficient Balance',
          description: `You need at least 0.0005 ckBTC to register. Please top up your wallet.`,
          variant: 'destructive'
        };
      case 'TransferFailed':
        return {
          title: 'Transfer Failed',
          description: error || 'The registration fee transfer failed. Please try again.',
          variant: 'destructive'
        };
      case 'Success':
        return {
          title: 'Registration Successful',
          description: `Transaction ID: ${transactionId}`,
          variant: 'default'
        };
      default:
        return {
          title: 'Error',
          description: error || 'An unexpected error occurred.',
          variant: 'destructive'
        };
    }
  };

  const content = getStatusContent();

  return (
    <Alert variant={content.variant} className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{content.title}</AlertTitle>
      <AlertDescription>{content.description}</AlertDescription>
    </Alert>
  );
};

const CustomConnectWallet = () => {
  const { connect } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Connect your Internet Identity to access the platform. Registration fee: 0.0005 ckBTC
        </p>
      </div>
      
      <motion.button
        onClick={async () => { await connect(); }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full flex items-center justify-center space-x-3 
        bg-gradient-to-r from-blue-600 to-indigo-700 
        text-white py-3 rounded-lg 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 
        font-semibold"
      >
        <Wallet className="w-6 h-6" />
        <span>Connect with Internet Computer</span>
      </motion.button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Powered by NFID Identity Kit
        </p>
      </div>
    </motion.div>
  );
};

const WalletConnect = () => {
  const [error, setError] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const { disconnect, isConnecting, user } = useAuth();
  const router = useRouter();
  const identity = useIdentity();
  const agent = useAgent();

  const canisterId = process.env.NEXT_PUBLIC_CROWDFUNDING_CANISTER_ID;

  const DashboardProceed = async () => {
    try {
      setIsRegistering(true);
      setError('');
      setRegistrationStatus(null);

      if (!agent) throw new Error('Not authenticated. Please connect to proceed.');
      if (!canisterId) throw new Error('Canister ID is not provided.');

      const actorInstance = Actor.createActor(idlFactory, {
        agent,
        canisterId: Principal.fromText(canisterId),
      });

      //await walletService.connectWallet(Principal.from(user?.principal || '').toText());

      const registrationResult = await actorInstance.register();

      console.log('registrationResult', registrationResult);

      const userData = localStorage.getItem('user');
      const userSubmission = JSON.parse(userData);

      console.log('userSubmission', userSubmission);

      const targetAmount = parseFloat(userSubmission.targetAmount);
      if (isNaN(targetAmount) || targetAmount < 0) {
        throw new Error('Invalid target amount. Please provide a valid positive number.');
      }
      const timeline = parseFloat(userSubmission.timeline);
      const timelineNat = BigInt(timeline);
      const targetAmountNat = BigInt(targetAmount);
      const projectName = userSubmission.projectName;
      const projectDescription = userSubmission.pitch;

      const createProject = await actorInstance.createFundingProject(
        targetAmountNat,
        timelineNat,
        projectName,
        projectDescription,
      );

      console.log(createProject);
      
      if ('ok' in registrationResult && 'ok' in createProject) {
        setRegistrationStatus('Success');
        setRegistrationData({
          transactionId: result.ok.transactionId,
          registrationTime: result.ok.registrationTime,
          fee: result.ok.fee
        });
        setTimeout(() => router.push('/builder-dashboard'), 2000);
      } else if ('err' in registrationResult) {
        setRegistrationStatus(Object.keys(registrationResult.err)[0]);
        if ('AlreadyRegistered' in registrationResult.err) {
          setRegistrationData({
            registrationTime: result.err.AlreadyRegistered.registrationTime
          });
        }
      }
    } catch (err) {
      console.error('Error in DashboardProceed:', err);
      setError(err.message || 'An error occurred during the registration process.');
    } finally {
      setIsRegistering(false);
    }
  };

  const renderConnectedState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div className="flex justify-center mb-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="p-4 bg-green-50 rounded-full shadow-md"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Identity Connected</h2>
        <p className="text-sm text-gray-500 mb-4 break-all">
          Principal ID: {Principal.from(user?.principal || '').toText()}
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={DashboardProceed}
          disabled={isRegistering}
          className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isRegistering ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Register & Proceed (0.0005 ckBTC)</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={disconnect}
          disabled={isRegistering}
          className="flex items-center justify-center space-x-2 w-full py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span>Disconnect Identity</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {registrationStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RegistrationStatus 
              status={registrationStatus}
              error={error}
              registrationTime={registrationData?.registrationTime}
              transactionId={registrationData?.transactionId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-center">
          <div className="inline-block p-3 bg-white/20 rounded-lg mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {user ? 'Identity Connected' : 'Connect Identity'}
          </h1>
          <p className="mt-2 text-white/80">
            {user ? 'You are ready to proceed.' : 'Connect with NFID to continue.'}
          </p>
        </div>

        <div className="p-8">
          {user ? renderConnectedState() : <CustomConnectWallet />}
        </div>
      </motion.div>
    </div>
  );
};

export default WalletConnect;