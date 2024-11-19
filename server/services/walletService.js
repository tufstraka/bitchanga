import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as ckBTCIdl } from '../declarations/ckbtc.did.js';

export class WalletService {
  static async connectPlugWallet() {
    try {
      // Use the IC host's native API instead of plug-connect
      const agent = new HttpAgent({
        host: process.env.IC_HOST
      });
      
      await agent.fetchRootKey();
      const identity = await AuthClient.create();
      const principal = identity.getPrincipal();
      
      return principal.toText();
    } catch (error) {
      throw new Error(`Wallet connection failed: ${error.message}`);
    }
  }

  static async connectICPWallet() {
    try {
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();
      
      if (!isAuthenticated) {
        await new Promise((resolve) => {
          authClient.login({
            identityProvider: process.env.II_URL,
            onSuccess: resolve,
          });
        });
      }
      
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      return principal.toText();
    } catch (error) {
      throw new Error(`ICP wallet connection failed: ${error.message}`);
    }
  }

  static async transferCkBTC(fromPrincipal, toPrincipal, amount) {
    try {
      const agent = new HttpAgent({
        host: process.env.IC_HOST,
        identity: fromPrincipal
      });
      
      await agent.fetchRootKey();
      const ckBTCActor = Actor.createActor(ckBTCIdl, {
        agent,
        canisterId: process.env.CKBTC_CANISTER_ID
      });

      const transferAmount = BigInt(amount * 10**8);

      const result = await ckBTCActor.icrc1_transfer({
        to: { owner: Principal.fromText(toPrincipal) },
        amount: transferAmount,
        fee: BigInt(10),
        memo: BigInt(0),
        from_subaccount: [],
        created_at_time: []
      });

      if ('Err' in result) {
        throw new Error(`Transfer failed: ${JSON.stringify(result.Err)}`);
      }

      return result.Ok;
    } catch (error) {
      throw new Error(`ckBTC transfer failed: ${error.message}`);
    }
  }

  static async getBalance(principal) {
    try {
      const agent = new HttpAgent({
        host: process.env.IC_HOST
      });
      
      await agent.fetchRootKey();
      const ckBTCActor = Actor.createActor(ckBTCIdl, {
        agent,
        canisterId: process.env.CKBTC_CANISTER_ID
      });

      const balance = await ckBTCActor.icrc1_balance_of({
        owner: Principal.fromText(principal),
        subaccount: []
      });

      return Number(balance) / 10**8;
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }
}