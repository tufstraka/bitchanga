export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const RegistrationError = IDL.Variant({
    'CanisterError' : IDL.Text,
    'InsufficientFee' : IDL.Record({
      'provided' : IDL.Nat,
      'required' : IDL.Nat,
    }),
    'AlreadyRegistered' : IDL.Record({ 'registrationTime' : Time }),
    'UserNotAuthenticated' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'TransferFailed' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : RegistrationError });
  const UserRegistration = IDL.Record({
    'user' : IDL.Principal,
    'registrationTime' : Time,
    'transactionId' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Vec(UserRegistration),
    'err' : RegistrationError,
  });
  const RegistrationSuccess = IDL.Record({
    'fee' : IDL.Nat,
    'registrationTime' : Time,
    'transactionId' : IDL.Nat,
  });
  const Result = IDL.Variant({
    'ok' : RegistrationSuccess,
    'err' : RegistrationError,
  });
  const CrowdfundingRegistration = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [Result_2], []),
    'getAllRegisteredUsers' : IDL.Func([], [Result_1], ['query']),
    'getRegistrationFee' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc28_trusted_origins' : IDL.Func(
        [],
        [IDL.Record({ 'trusted_origins' : IDL.Vec(IDL.Text) })],
        ['query'],
      ),
    'isRegistered' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'register' : IDL.Func([], [Result], []),
  });
  return CrowdfundingRegistration;
};
export const init = ({ IDL }) => { return []; };
