import { IcrcLedgerCanister } from "@dfinity/agent";
import { useCallback, useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { useWallet } from "./WalletContext";

// Helper functions for BigInt serialization
const serializeData = (data) => {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value
  );
};

const deserializeData = (data) => {
  return JSON.parse(data, (_, value) => {
    if (typeof value === 'string' && value.endsWith('n')) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  });
};

export default function useCkBtcLedger() {
  const { wallet } = useWallet();
  const [ledgerCanister, setLedgerCanister] = useState(null);
  const [metadata, setMetadata] = useState(() => {
    try {
      const savedMetadata = localStorage.getItem('ckbtc_metadata');
      return savedMetadata ? deserializeData(savedMetadata) : null;
    } catch (error) {
      console.error('Error loading metadata from localStorage:', error);
      return null;
    }
  });
  const [balance, setBalance] = useState(() => {
    try {
      const savedBalance = localStorage.getItem('ckbtc_balance');
      return savedBalance ? deserializeData(savedBalance) : null;
    } catch (error) {
      console.error('Error loading balance from localStorage:', error);
      return null;
    }
  });
  const [error, setError] = useState(null);

  // Initialize the Ledger Canister
  const initializeLedger = useCallback(async () => {
    try {
      if (!wallet?.agent || !wallet?.connected) {
        throw new Error("Wallet agent not connected");
      }

      const canisterId = process.env.NEXT_PUBLIC_CKBTC_LEDGER_CANISTER_ID;
      if (!canisterId) {
        throw new Error("CKBTC Ledger Canister ID not provided");
      }

      const ledger = IcrcLedgerCanister.create({
        agent: wallet.agent,
        canisterId: Principal.fromText(canisterId),
      });

      setLedgerCanister(ledger);
      console.log("Ledger Canister initialized:", ledger);
      return ledger;
    } catch (err) {
      console.error("Error initializing Ledger Canister:", err);
      setError(err);
      throw err;
    }
  }, [wallet]);

  // Fetch metadata from the Ledger Canister
  const fetchMetadata = useCallback(
    async (ledger) => {
      if (!ledger) throw new Error("LedgerCanister not initialized");

      try {
        const metadataResponse = await ledger.metadata({ certified: false });
        setMetadata(metadataResponse);
        localStorage.setItem('ckbtc_metadata', serializeData(metadataResponse));
        console.log("Metadata fetched:", metadataResponse);
      } catch (err) {
        console.error("Error fetching metadata:", err);
        setError(err);
      }
    },
    []
  );

  // Fetch balance from the Ledger Canister
  const fetchBalance = useCallback(
    async (ledger) => {
      if (!ledger || !wallet?.principalId) {
        throw new Error("LedgerCanister or wallet principalId not available");
      }

      try {
        const principal = Principal.fromText(wallet.principalId);
        const balanceResponse = await ledger.balance({
          owner: principal,
          certified: false,
        });
        setBalance(balanceResponse);
        localStorage.setItem('ckbtc_balance', serializeData(balanceResponse));
        console.log("Balance fetched:", balanceResponse);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError(err);
      }
    },
    [wallet]
  );

  // Clear persisted data on error or disconnect
  useEffect(() => {
    if (!wallet?.connected) {
      localStorage.removeItem('ckbtc_metadata');
      localStorage.removeItem('ckbtc_balance');
      setMetadata(null);
      setBalance(null);
    }
  }, [wallet?.connected]);

  // Refresh data periodically
  useEffect(() => {
    const refreshInterval = 60000; // 1 minute
    let intervalId;

    if (wallet?.connected && ledgerCanister) {
      intervalId = setInterval(() => {
        fetchMetadata(ledgerCanister);
        fetchBalance(ledgerCanister);
      }, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [wallet?.connected, ledgerCanister, fetchMetadata, fetchBalance]);

  useEffect(() => {
    const initializeAndFetchData = async () => {
      try {
        if (!wallet || !wallet.connected) {
          console.warn("Wallet not connected");
          return;
        }

        if (!ledgerCanister) {
          const ledger = await initializeLedger();
          await fetchMetadata(ledger);
          await fetchBalance(ledger);
        }
      } catch (err) {
        console.error("Error during ledger initialization and data fetching:", err);
      }
    };

    initializeAndFetchData();
  }, [wallet, ledgerCanister, initializeLedger, fetchMetadata, fetchBalance]);

  return {
    ledgerCanister,
    metadata,
    balance,
    initializeLedger,
    fetchMetadata,
    fetchBalance,
    error,
  };
}