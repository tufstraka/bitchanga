export const idlFactory = ({ IDL }) => {
    const Network = IDL.Variant({ 'Mainnet' : IDL.Null, 'Testnet' : IDL.Null });
    const Time = IDL.Int;
    const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
    const BitcoinAddress = IDL.Text;
    const Backer = IDL.Record({
      'id' : IDL.Principal,
      'rewardsIssued' : IDL.Vec(IDL.Text),
      'timestamps' : IDL.Vec(IDL.Int),
      'btcAddress' : IDL.Opt(BitcoinAddress),
      'contribution' : IDL.Nat,
    });
    const Result_1 = IDL.Variant({ 'ok' : Backer, 'err' : IDL.Text });
    const MilestoneStatus = IDL.Variant({
      'Failed' : IDL.Null,
      'Active' : IDL.Null,
      'Cancelled' : IDL.Null,
      'Completed' : IDL.Null,
      'Pending' : IDL.Null,
    });
    const Milestone = IDL.Record({
      'id' : IDL.Nat,
      'status' : MilestoneStatus,
      'createdAt' : IDL.Int,
      'description' : IDL.Text,
      'deadline' : IDL.Int,
      'requiredApprovalCount' : IDL.Nat,
      'btcAddress' : IDL.Opt(BitcoinAddress),
      'fundingPool' : IDL.Nat,
      'requiredAmount' : IDL.Nat,
      'approvals' : IDL.Vec(IDL.Principal),
    });
    const Result = IDL.Variant({ 'ok' : Milestone, 'err' : IDL.Text });
    const CrowdfundingPlatform = IDL.Service({
      'addMilestone' : IDL.Func(
          [IDL.Text, IDL.Nat, IDL.Nat, Time],
          [Result_2],
          [],
        ),
      'contribute' : IDL.Func([IDL.Nat, IDL.Opt(BitcoinAddress)], [Result_2], []),
      'getBackerInfo' : IDL.Func([IDL.Principal], [Result_1], ['query']),
      'getMilestone' : IDL.Func([IDL.Nat], [Result], ['query']),
      'getMilestoneCount' : IDL.Func([], [IDL.Nat], ['query']),
      'getTotalContributions' : IDL.Func([], [IDL.Nat], ['query']),
    });
    return CrowdfundingPlatform;
  };
  export const init = ({ IDL }) => {
    const Network = IDL.Variant({ 'Mainnet' : IDL.Null, 'Testnet' : IDL.Null });
    return [IDL.Principal, IDL.Principal, IDL.Nat, Network];
  };