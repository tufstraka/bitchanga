import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/crowdfunding_platform/crowdfunding_platform.did.js';

const LOCAL_CANISTER_ID = "YOUR_LOCAL_CANISTER_ID"; // Replace with your canister ID
const LOCAL_HOST = "http://localhost:8000";

export async function createActor() {
  const agent = new HttpAgent({ host: LOCAL_HOST });
  
  // Only for local development
  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: LOCAL_CANISTER_ID,
  });
}

export function formatPrincipal(principal) {
  return principal.toString().slice(0, 5) + '...' + principal.toString().slice(-3);
}

export function formatBalance(balance) {
  return Number(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  });
}