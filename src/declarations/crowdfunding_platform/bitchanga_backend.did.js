export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const UserRegistration = IDL.Record({
    'user' : IDL.Principal,
    'registrationTime' : Time,
  });
  const RegistrationError = IDL.Variant({
    'CanisterError' : IDL.Text,
    'InsufficientFee' : IDL.Null,
    'AlreadyRegistered' : IDL.Null,
    'UserNotAuthenticated' : IDL.Null,
    'TransferFailed' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : RegistrationError });
  const CrowdfundingRegistration = IDL.Service({
    'getAllRegisteredUsers' : IDL.Func([], [IDL.Vec(UserRegistration)], []),
    'getRegistrationFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getRegistrationTime' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(Time)],
        ['query'],
      ),
    'init' : IDL.Func([], [], []),
    'isRegistered' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'register' : IDL.Func([], [Result], []),
  });
  return CrowdfundingRegistration;
};
export const init = ({ IDL }) => { return []; };
