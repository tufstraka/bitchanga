// ckbtc_minter.did.js

import { IDL } from '@dfinity/candid';

export const idlFactory = ({ IDL }) => {
    // Define the MintRequest type
    const MintRequest = IDL.Record({
        'btc_address': IDL.Text,
        'amount': IDL.Nat64,
        'transaction_id': IDL.Text,
    });

    // Define the MintResponse type
    const MintResponse = IDL.Record({
        'status': IDL.Text,
        'ckbtc_amount': IDL.Opt(IDL.Nat64),
        'error': IDL.Opt(IDL.Text),
    });

    // Define the Canister State type (for fetching pending mints)
    const MintingCanisterState = IDL.Record({
        'pending_mints': IDL.Vec(MintRequest),
        'exchange_rate': IDL.Nat64,
    });

    return IDL.Service({
        'request_mint': IDL.Func([MintRequest], [MintResponse], []),
        'get_pending_mints': IDL.Func([], [IDL.Vec(MintRequest)], ['query']),
        'update_exchange_rate': IDL.Func([IDL.Nat64], [], []),
    });
};
