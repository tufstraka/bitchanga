// utils/identity.js
const { Actor, HttpAgent } = require('@dfinity/agent');
const { idlFactory: IdentityIDLFactory } = require('@dfinity/candid');

// Define a simple mock idlFactory for testing (adjust based on actual canister API)
const idlFactory = ({ IDL }) => {
  return IDL.Service({
    createIdentity: IDL.Func([IDL.Text], [IDL.Text], []),
  });
};

const identityCanisterId = process.env.IDENTITY_CANISTER_ID;

async function createIdentity(userName) {
  const agent = new HttpAgent();
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: identityCanisterId,
  });
  const identityId = await actor.createIdentity(userName);
  return identityId;
}

module.exports = { createIdentity };
