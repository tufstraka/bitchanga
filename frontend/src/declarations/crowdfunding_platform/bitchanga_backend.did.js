export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const RegistrationError = IDL.Variant({
    'FundingGoalNotMet' : IDL.Null,
    'ProjectExpired' : IDL.Null,
    'CanisterError' : IDL.Text,
    'InvalidAmount' : IDL.Null,
    'InsufficientFee' : IDL.Record({
      'provided' : IDL.Nat,
      'required' : IDL.Nat,
    }),
    'AlreadyRegistered' : IDL.Record({ 'registrationTime' : Time }),
    'UserNotAuthenticated' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'ProjectInactive' : IDL.Null,
    'TransferFailed' : IDL.Text,
    'ProjectNotFound' : IDL.Null,
    'InsufficientFunds' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : RegistrationError });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : RegistrationError });
  const Contribution = IDL.Record({
    'timestamp' : Time,
    'amount' : IDL.Nat,
    'contributor' : IDL.Principal,
  });
  const ProjectFunding = IDL.Record({
    'escrowAccount' : IDL.Principal,
    'totalFunds' : IDL.Nat,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'contributions' : IDL.Vec(Contribution),
    'beneficiary' : IDL.Principal,
    'createdAt' : Time,
    'description' : IDL.Text,
    'deadline' : Time,
    'isActive' : IDL.Bool,
    'fundingGoal' : IDL.Nat,
  });
  const UserRegistration = IDL.Record({
    'user' : IDL.Principal,
    'registrationTime' : Time,
    'transactionId' : IDL.Nat,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Vec(UserRegistration),
    'err' : RegistrationError,
  });
  const Result_2 = IDL.Variant({
    'ok' : ProjectFunding,
    'err' : RegistrationError,
  });
  const RegistrationSuccess = IDL.Record({
    'fee' : IDL.Nat,
    'registrationTime' : Time,
    'transactionId' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({
    'ok' : RegistrationSuccess,
    'err' : RegistrationError,
  });
  const CrowdfundingRegistration = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [Result], []),
    'contribute' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
    'createFundingProject' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Nat, IDL.Text, IDL.Text],
        [Result_4],
        [],
      ),
    'getActiveProjects' : IDL.Func([], [IDL.Vec(ProjectFunding)], ['query']),
    'getAllProjects' : IDL.Func([], [IDL.Vec(ProjectFunding)], ['query']),
    'getAllRegisteredUsers' : IDL.Func([], [Result_3], ['query']),
    'getProject' : IDL.Func([IDL.Nat], [Result_2], ['query']),
    'getProjectsByCreator' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(ProjectFunding)],
        ['query'],
      ),
    'getRegistrationFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserContributions' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Nat, ProjectFunding, IDL.Nat))],
        ['query'],
      ),
    'icrc28_trusted_origins' : IDL.Func(
        [],
        [IDL.Record({ 'trusted_origins' : IDL.Vec(IDL.Text) })],
        ['query'],
      ),
    'isRegistered' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'register' : IDL.Func([], [Result_1], []),
    'releaseFunds' : IDL.Func([IDL.Nat], [Result], []),
    'removeAdmin' : IDL.Func([IDL.Principal], [Result], []),
    'withdrawContribution' : IDL.Func([IDL.Nat], [Result], []),
  });
  return CrowdfundingRegistration;
};
export const init = ({ IDL }) => { return []; };
