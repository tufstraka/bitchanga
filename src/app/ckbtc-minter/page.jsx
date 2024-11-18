"use client"

import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Copy, Loader2, CheckCircle2, AlertCircle, TrendingUp, Wallet, RefreshCcw } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '@/declarations/crowdfunding_platform/bitchanga_backend.did';

const MintCkBTC = () => {
  const [btcAddress, setBtcAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [stats, setStats] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [historicalRates, setHistoricalRates] = useState([]);

  // Actor reference
  const canisterId = 'fg7gi-vyaaa-aaaah-qcpbq-cai';

  useEffect(() => {
    fetchInitialData();
    fetchHistoricalRates();
  }, []);

  const fetchInitialData = async () => {
    try {
      const actor = await getActor();
      const [statsRes, balanceRes, txRes] = await Promise.all([
        actor.getStats(),
        fetchBalance(),
        fetchTransactions()
      ]);
      setStats(statsRes);
      setBalance(balanceRes);
      setTransactions(txRes);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const fetchHistoricalRates = async () => {
    // Simulated historical rate data
    const rates = Array.from({length: 30}, (_, i) => ({
      date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      rate: 1 + Math.random() * 0.01 - 0.005
    }));
    setHistoricalRates(rates);
    setExchangeRate(rates[rates.length - 1].rate);
  };

  const fetchBalance = async () => {
    if (!window.ic?.plug?.principalId) return null;
    const actor = await getActor();
    return actor.getBalance(Principal.fromText(window.ic.plug.principalId));
  };

  const fetchTransactions = async () => {
    if (!window.ic?.plug?.principalId) return [];
    const actor = await getActor();
    return actor.getTransactionHistory(Principal.fromText(window.ic.plug.principalId));
  };

  const getActor = async () => {
    await window.ic.plug.createAgent({ whitelist: [canisterId] });
    return await window.ic.plug.createActor({
      canisterId,
      idlFactory /* your IDL here */
    });
  };

  const validateInputs = () => {
    if (!btcAddress) {
      setError('BTC address is required');
      return false;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Valid amount is required');
      return false;
    }
    return true;
  };

  const requestMint = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');
    try {
      const request = {
        btcAddress,
        amount: BigInt(Math.floor(Number(amount) * 100000000)),
        destinationAddress: Principal.fromText(window.ic?.plug?.principalId || '')
      };

      const actor = await getActor();
      const response = await actor.requestMint(request);

      if ('ok' in response) {
        setRequestId(response.ok.requestId);
        setStatus('pending');
        startStatusPolling(response.ok.requestId);
        // Refresh data after successful request
        fetchInitialData();
      } else {
        throw new Error(response.err);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startStatusPolling = (id) => {
    const pollInterval = setInterval(async () => {
      try {
        const actor = await getActor();
        const status = await actor.getMintStatus(id);
        
        if ('ok' in status) {
          setMintStatus(status.ok);
          if (status.ok.status === 'completed') {
            clearInterval(pollInterval);
            fetchInitialData(); // Refresh data after completion
          }
        }
      } catch (err) {
        console.error('Status polling error:', err);
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  };

  return (
    <div className="w-full max-w-6xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance ? `${(Number(balance) / 100000000).toFixed(8)} ckBTC` : '-'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exchange Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exchangeRate ? `1 BTC = ${exchangeRate.toFixed(4)} ckBTC` : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Mints</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingMints || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Exchange Rate History</CardTitle>
          <CardDescription>30-day BTC/ckBTC exchange rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin', 'dataMax']} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mint Form */}
      <Card>
        <CardHeader>
          <CardTitle>Mint ckBTC</CardTitle>
          <CardDescription>Convert your BTC to ckBTC on the Internet Computer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                BTC Address
              </label>
              <input
                type="text"
                value={btcAddress}
                onChange={(e) => setBtcAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your BTC address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (BTC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0.0"
                step="0.00000001"
              />
            </div>

            <button
              onClick={requestMint}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Request Mint'
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Status and Errors */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {requestId && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Request ID:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{requestId}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(requestId)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mintStatus && (
        <Alert>
          <div className="flex items-center space-x-2">
            {mintStatus.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <AlertTitle>
              Status: {mintStatus.status.charAt(0).toUpperCase() + mintStatus.status.slice(1)}
            </AlertTitle>
          </div>
          <AlertDescription>
            <div className="mt-2 space-y-1 text-sm">
              <p>Amount: {Number(mintStatus.ckBTCAmount) / 100000000} BTC</p>
              {mintStatus.confirmations > 0 && (
                <p>Confirmations: {mintStatus.confirmations}/6</p>
              )}
              {mintStatus.txHash && (
                <p className="break-all">
                  Transaction: {Buffer.from(mintStatus.txHash).toString('hex')}
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(Number(tx.timestamp)).toLocaleString()}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>{Number(tx.amount) / 100000000} ckBTC</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {tx.id.slice(0, 8)}...{tx.id.slice(-8)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MintCkBTC;