"use client";
import { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../app/declarations/ckbtc_minter';

const CkBTCMinter = () => {
    const [btcAddress, setBtcAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [txId, setTxId] = useState('');
    const [status, setStatus] = useState('');
    const [pendingMints, setPendingMints] = useState([]);
    const [actor, setActor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        initializeActor();
    }, []);

    const initializeActor = async () => {
        try {
            const agent = new HttpAgent({
                host: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:8000',
            });

            // Remove for production
            if (process.env.NODE_ENV !== 'production') {
                await agent.fetchRootKey();
            }

            const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID;
            const minterActor = Actor.createActor(idlFactory, {
                agent,
                canisterId,
            });

            setActor(minterActor);
            await fetchPendingMints(minterActor);
        } catch (err) {
            setError('Failed to initialize connection to canister');
            console.error('Initialization error:', err);
        }
    };

    const fetchPendingMints = async (minterActor) => {
        try {
            const mints = await minterActor.get_pending_mints();
            setPendingMints(mints);
        } catch (err) {
            console.error('Error fetching pending mints:', err);
            setError('Failed to fetch pending mints');
        }
    };

    const convertToBigInt = (btcAmount) => {
        // Convert BTC to satoshis (1 BTC = 100,000,000 satoshis)
        const satoshis = Math.round(parseFloat(btcAmount) * 100000000);
        return BigInt(satoshis);
    };

    const handleMintRequest = async (e) => {
        e.preventDefault();
        if (!actor) {
            setError('Canister connection not initialized');
            return;
        }

        setIsLoading(true);
        setError('');
        setStatus('Processing mint request...');

        try {
            const mintRequest = {
                btc_address: btcAddress,
                amount: convertToBigInt(amount),
                transaction_id: txId,
            };

            const response = await actor.request_mint(mintRequest);
            
            if (response.status === 'Success') {
                const mintedAmount = Number(response.ckbtc_amount[0]) / 100000000;
                setStatus(`Successfully minted ${mintedAmount} ckBTC!`);
                
                // Clear form
                setBtcAddress('');
                setAmount('');
                setTxId('');
                
                // Refresh pending mints
                await fetchPendingMints(actor);
            } else {
                setError(response.error[0] || 'Mint request failed');
            }
        } catch (err) {
            console.error('Mint request error:', err);
            setError('Failed to process mint request');
        } finally {
            setIsLoading(false);
        }
    };

    const renderPendingMint = (mint, index) => {
        const btcAmount = Number(mint.amount) / 100000000;
        return (
            <div key={index} className="p-4 bg-white shadow rounded-lg mb-4">
                <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                        <span className="font-semibold">BTC Address:</span>
                        <span className="text-gray-600 break-all">{mint.btc_address}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Amount:</span>
                        <span className="text-gray-600">{btcAmount} BTC</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Transaction ID:</span>
                        <span className="text-gray-600 break-all">{mint.transaction_id}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">ckBTC Minter</h1>
            
            <form onSubmit={handleMintRequest} className="space-y-6 mb-8">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Bitcoin Address
                    </label>
                    <input
                        type="text"
                        value={btcAddress}
                        onChange={(e) => setBtcAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter BTC address"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Amount (BTC)
                    </label>
                    <input
                        type="number"
                        step="0.00000001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="0.0"
                        required
                        disabled={isLoading}
                        min="0"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Transaction ID
                    </label>
                    <input
                        type="text"
                        value={txId}
                        onChange={(e) => setTxId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter transaction ID"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-3 text-white rounded-md transition-colors
                        ${isLoading 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isLoading ? 'Processing...' : 'Request Mint'}
                </button>
            </form>

            {status && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700">{status}</p>
                </div>
            )}

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Pending Mints</h2>
                <div className="space-y-4">
                    {pendingMints.length > 0 ? (
                        pendingMints.map(renderPendingMint)
                    ) : (
                        <p className="text-gray-500 text-center">No pending mints</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CkBTCMinter;