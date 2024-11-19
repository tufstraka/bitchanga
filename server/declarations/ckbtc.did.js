export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'icrc1_balance_of': IDL.Func([
      IDL.Record({
        'owner': IDL.Principal,
        'subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
      })
    ], [IDL.Nat], ['query']),
    'icrc1_transfer': IDL.Func([
      IDL.Record({
        'to': IDL.Record({ 'owner': IDL.Principal }),
        'fee': IDL.Opt(IDL.Nat),
        'memo': IDL.Opt(IDL.Nat64),
        'from_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
        'created_at_time': IDL.Opt(IDL.Nat64),
        'amount': IDL.Nat,
      })
    ], [
      IDL.Variant({
        'Ok': IDL.Nat,
        'Err': IDL.Variant({
          'InsufficientFunds': IDL.Null,
          'InvalidReceiver': IDL.Null,
          'GenericError': IDL.Text,
        }),
      })
    ], [])
  });
};