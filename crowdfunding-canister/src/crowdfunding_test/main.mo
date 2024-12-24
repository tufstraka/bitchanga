import Principal "mo:base/Principal";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Random "mo:base/Random";
import Blob "mo:base/Blob";
import Hash "mo:base/Hash";
import _Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";




actor Crowdfunding {

    // Types
    type RegistrationError = {
        #InsufficientFee : { required : Nat; provided : Nat };
        #TransferFailed : Text;
        #AlreadyRegistered : { registrationTime : Time.Time };
        #UserNotAuthenticated;
        #CanisterError : Text;
        #Unauthorized;
        #InsufficientFunds;
        #FundingGoalNotMet;
        #ProjectNotFound;
        #InvalidAmount;
        #ProjectExpired;
        #ProjectInactive;
    };

    type ICRC1_Transfer_Result = {
        #Ok : Nat;
        #Err : Text;
    };

    type WithdrawalError = {
        #InvalidAddress : Text;
        #InsufficientBalance;
        #TransferFailed : Text;
        #MinimumWithdrawalNotMet;
        #MaximumWithdrawalExceeded;
    };

    type RetrieveBtcRequest = {
        address : Text;
        amount : Nat64;
    };

    type RetrieveBtcResponse = {
        #Ok : Text;  // Block ID
        #Err : WithdrawalError;
    };

    type ApproveArgs = {
        spender : Principal;
        amount : Nat;
        fee : ?Nat;
        memo : ?[Nat8];
        from_subaccount : ?[Nat8];
        created_at_time : ?Nat64;
    };


    private type CkBTCMinter = actor {
        retrieve_btc : shared RetrieveBtcRequest -> async RetrieveBtcResponse;
        get_withdrawal_fee : shared query () -> async Nat64;
    };

    type ICRC1_Actor = actor {
        icrc1_balance_of : shared query { owner : Principal; subaccount : ?[Nat8] } -> async Nat;
        icrc1_transfer : shared {
            from_subaccount : ?[Nat8];
            to : { owner : Principal; subaccount : ?[Nat8] };
            amount : Nat;
            fee : ?Nat;
            memo : ?[Nat8];
            created_at_time : ?Nat64;
        } -> async ICRC1_Transfer_Result;
        icrc1_approve : shared ApproveArgs -> async ICRC1_Transfer_Result;
        icrc1_allowance : shared query { account : Principal; spender : Principal } -> async { allowance : Nat; expires_at : ?Nat64 };


    };

    type Contribution = {
        contributor : Principal;
        amount : Nat;
        timestamp : Time.Time;
    };

    type ProjectFunding = {
        creator : Principal;
        beneficiary : Principal;
        escrowAccount : Principal;
        fundingGoal : Nat;
        deadline : Time.Time;
        totalFunds : Nat;
        isActive : Bool;
        contributions : [Contribution];
        createdAt : Time.Time;
        title : Text;
        description : Text;
    };

    type RegistrationSuccess = {
        transactionId : Nat;
        registrationTime : Time.Time;
        fee : Nat;
    };

    type UserRegistration = {
        user : Principal;
        registrationTime : Time.Time;
        transactionId : Nat;
    };

    // Constants
    private let CKBTC_CANISTER_ID : Principal = Principal.fromText("mxzaz-hqaaa-aaaar-qaada-cai");
    private let FEE_RECIPIENT : Principal = Principal.fromText("yuvjs-4l73d-56lg6-7744r-4cbgl-cpovl-f5hga-o5fx4-iub6d-edkl7-rqe");
    private let REGISTRATION_FEE : Nat = 50_000; // 0.0005 ckBTC
    private let MIN_FUNDING_DURATION_DAYS : Nat = 1;
    private let MAX_FUNDING_DURATION_DAYS : Nat = 90;
    private let TRUSTED_ORIGINS : [Text] = [
        "https://z4gvt-waaaa-aaaam-qcagq-cai.icp0.io",
        "https://main.dhq94roejc17t.amplifyapp.com",
        "http://localhost:3000"
    ];
    private let CKBTC_MINTER_CANISTER_ID : Principal = Principal.fromText("mqygn-kiaaa-aaaar-qaadq-cai");
    private let MIN_WITHDRAWAL_AMOUNT : Nat = 1_000;  // 0.00001 ckBTC
    private let MAX_WITHDRAWAL_AMOUNT : Nat = 1_000_000_000;  // 10 ckBTC
    private let ckbtcMinter : CkBTCMinter = actor(Principal.toText(CKBTC_MINTER_CANISTER_ID));


    // State
    private stable var registeredUsersEntries : [(Principal, UserRegistration)] = [];
    private stable var projectFundingEntries : [(Nat, ProjectFunding)] = [];
    private stable var nextTransactionId : Nat = 1;
    private stable var nextProjectId : Nat = 1;

    private stable var adminPrincipals : [Principal] = [
        Principal.fromText("2saul-3mgwg-nsneo-h6s2g-euwyy-4rnzr-u7o7a-cwwbh-ckdk2-66ejx-wae"),
        Principal.fromText("yuvjs-4l73d-56lg6-7744r-4cbgl-cpovl-f5hga-o5fx4-iub6d-edkl7-rqe")
    ];
    
    private var registeredUsers = HashMap.HashMap<Principal, UserRegistration>(10, Principal.equal, Principal.hash);
    private var projectFundings = HashMap.HashMap<Nat, ProjectFunding>(10, Nat.equal, Hash.hash);
    private let ckbtc : ICRC1_Actor = actor(Principal.toText(CKBTC_CANISTER_ID));

    // NFID Integration
    public shared query func icrc28_trusted_origins() : async { trusted_origins : [Text] } {
        { trusted_origins = TRUSTED_ORIGINS }
    };

    // Helper Functions
    private func _validateOrigin(origin : Text) : Bool {
        Option.isSome(Array.find<Text>(TRUSTED_ORIGINS, func(trusted : Text) : Bool { trusted == origin }))
    };

    private func _isAdmin(principal : Principal) : Bool {
        Option.isSome(Array.find<Principal>(adminPrincipals, func(p : Principal) : Bool { p == principal }))
    };

    private func validateProjectDuration(durationInDays : Nat) : Bool {
        durationInDays >= MIN_FUNDING_DURATION_DAYS and durationInDays <= MAX_FUNDING_DURATION_DAYS
    };

    private func isProjectActive(project : ProjectFunding) : Bool {
        project.isActive and Time.now() <= project.deadline
    };

     public query func getEscrowAccountForProject(projectId: Nat): async { owner: Principal; subaccount: ?[Nat8] } {
        getEscrowAccount(projectId)
    };
    
    private func generateEscrowSubaccount(projectId : Nat) : [Nat8] {
        let n : Nat32 = Nat32.fromNat(projectId);
        
        func byte(i : Nat) : Nat8 {
            Nat8.fromNat(Nat32.toNat(n >> (Nat32.fromNat(i) * 8) & 0xFF))
        };

        Array.tabulate<Nat8>(32, func (i : Nat) : Nat8 {
            if (i < 4) {
                byte(3 - i)  // First 4 bytes in reverse order
            } else if (i < 8) {
                byte(i - 4)  // Next 4 bytes in original order
            } else {
                let value = Nat32.toNat(n) + i;
                Nat8.fromNat(value % 256)  // Remaining bytes
            }
        })
    };

    private func getEscrowAccount(projectId : Nat) : { owner : Principal; subaccount : ?[Nat8] } {
        {
            owner = Principal.fromActor(Crowdfunding);
            subaccount = ?generateEscrowSubaccount(projectId)
        }
    };

    /*private func isValidBitcoinAddress(address : Text) : Bool {
        // Basic validation 
        let length = Text.size(address);
        if (length < 26 or length > 35) {
            return false;
        };

        // Check if address starts with valid prefixes
        let validPrefixes = ["1", "3", "bc1"];
        for (prefix in validPrefixes.vals()) {
            if (Text.startsWith(address, #text prefix)) {
                return true;
            };
        };
        false;
    };*/

    public shared({ caller }) func withdrawToBitcoin(
        btcAddress : Text,
        amount : Nat
    ) : async Result.Result<Text, RegistrationError> {
        /*if (Principal.isAnonymous(caller)) {
            return #err(#UserNotAuthenticated);
        };*/

        // Validate amount
        if (amount < MIN_WITHDRAWAL_AMOUNT) {
            return #err(#InvalidAmount);
        };

        if (amount > MAX_WITHDRAWAL_AMOUNT) {
            return #err(#InvalidAmount);
        };

        let balance = await ckbtc.icrc1_balance_of({ owner = caller; subaccount = null });
        if (balance < amount) {
            return #err(#InsufficientFunds);
        };

        let withdrawalFee = await ckbtcMinter.get_withdrawal_fee();
        let totalAmount = Nat64.toNat(withdrawalFee) + amount;

        if (balance < totalAmount) {
            return #err(#InsufficientFunds);
        };

        try {
            // First transfer ckBTC to the minter
            let transferResult = await ckbtc.icrc1_transfer({
                from_subaccount = null;
                to = { owner = CKBTC_MINTER_CANISTER_ID; subaccount = null };
                amount = totalAmount;
                fee = null;
                memo = null;
                created_at_time = null;
            });

            switch (transferResult) {
                case (#Ok(_)) {
                    // If transfer successful, initiate BTC withdrawal
                    let withdrawalRequest : RetrieveBtcRequest = {
                        address = btcAddress;
                        amount = Nat64.fromNat(amount);
                    };

                    let withdrawalResult = await ckbtcMinter.retrieve_btc(withdrawalRequest);
                    
                    switch (withdrawalResult) {
                        case (#Ok(blockId)) {
                            #ok(blockId)
                        };
                        case (#Err(e)) {
                            switch (e) {
                                case (#InvalidAddress(_)) { #err(#CanisterError("Invalid Bitcoin address")) };
                                case (#InsufficientBalance) { #err(#InsufficientFunds) };
                                case (#TransferFailed(msg)) { #err(#TransferFailed(msg)) };
                                case (_) { #err(#CanisterError("Withdrawal failed")) };
                            };
                        };
                    };
                };
                case (#Err(e)) { #err(#TransferFailed(e)) };
            };
        } catch (e) {
            #err(#CanisterError(Error.message(e)))
        };
    };




    // Registration Functions
    public shared({ caller }) func register() : async Result.Result<RegistrationSuccess, RegistrationError> {
        /*if (Principal.isAnonymous(caller)) {
            return #err(#UserNotAuthenticated);
        };*/

        switch (registeredUsers.get(caller)) {
            case (?registration) {
                return #err(#AlreadyRegistered({ registrationTime = registration.registrationTime }));
            };
            case null {};
        };

        let userBalance = await ckbtc.icrc1_balance_of({ owner = caller; subaccount = null });
        if (userBalance < REGISTRATION_FEE) {
            return #err(#InsufficientFee({ required = REGISTRATION_FEE; provided = userBalance }));
        };

        try {
            let transferResult = await ckbtc.icrc1_transfer({
                from_subaccount = null;
                to = { owner = FEE_RECIPIENT; subaccount = null };
                amount = REGISTRATION_FEE;
                fee = null;
                memo = null;
                created_at_time = null;
            });

            switch (transferResult) {
                case (#Ok(_)) {
                    let registration : UserRegistration = {
                        user = caller;
                        registrationTime = Time.now();
                        transactionId = nextTransactionId;
                    };
                    
                    nextTransactionId += 1;
                    registeredUsers.put(caller, registration);
                    
                    #ok({
                        transactionId = registration.transactionId;
                        registrationTime = registration.registrationTime;
                        fee = REGISTRATION_FEE;
                    })
                };
                case (#Err(e)) {
                    #err(#TransferFailed(e))
                };
            };
        } catch (e) {
            #err(#CanisterError(Error.message(e)))
        };
    };

    // Project Management Functions
    public shared({ caller }) func createFundingProject(
        fundingGoal : Nat,
        durationInDays : Nat,
        title : Text,
        description : Text,
    ) : async Result.Result<Nat, RegistrationError> {
        /*if (Principal.isAnonymous(caller)) {
            return #err(#UserNotAuthenticated);
        };*/

        if (not validateProjectDuration(durationInDays)) {
            return #err(#InvalidAmount);
        };


        let deadline = Time.now() + (durationInDays * 24 * 60 * 60 * 1_000_000_000);
        let projectId = nextProjectId;
        let escrowAccount = getEscrowAccount(projectId);



        let newProject : ProjectFunding = {
            creator = caller;
            beneficiary = caller;
            escrowAccount = escrowAccount.owner;
            fundingGoal = fundingGoal;
            deadline = deadline;
            totalFunds = 0;
            isActive = true;
            contributions = [];
            createdAt = Time.now();
            title = title;
            description = description;
        };

        projectFundings.put(projectId, newProject);
        nextProjectId += 1;

        #ok(projectId)
    };

    public shared({ caller }) func contribute(projectId : Nat, amount : Nat) : async Result.Result<(), RegistrationError> {
        /*if (Principal.isAnonymous(caller)) {
            return #err(#UserNotAuthenticated);
        };*/

        if (amount == 0) {
            return #err(#InvalidAmount);
        };

        switch (projectFundings.get(projectId)) {
            case (null) { return #err(#ProjectNotFound); };
            case (?project) {
                if (not project.isActive) {
                    return #err(#ProjectInactive);
                };

                if (Time.now() > project.deadline) {
                    return #err(#ProjectExpired);
                };

                let balance = await ckbtc.icrc1_balance_of({ owner = caller; subaccount = null });
                if (balance < amount) {
                    return #err(#InsufficientFunds);
                };

                try {
                    let escrowAccount = getEscrowAccount(projectId);
                    let transferResult = await ckbtc.icrc1_transfer({
                        from_subaccount = null;
                        to = escrowAccount;
                        amount = amount;
                        fee = null;
                        memo = null;
                        created_at_time = null;
                    });

                    switch (transferResult) {
                        case (#Ok(_)) {
                            let newContribution : Contribution = {
                                contributor = caller;
                                amount = amount;
                                timestamp = Time.now();
                            };

                            let updatedContributions = Array.append(project.contributions, [newContribution]);
                            let updatedProject : ProjectFunding = {
                                project with
                                totalFunds = project.totalFunds + amount;
                                contributions = updatedContributions;
                            };
                            projectFundings.put(projectId, updatedProject);
                            #ok(())
                        };
                        case (#Err(e)) { #err(#TransferFailed(e)) };
                    };
                } catch (e) {
                    #err(#CanisterError(Error.message(e)))
                };
            };
        };
    };

    public shared({ caller }) func withdrawContribution(projectId : Nat) : async Result.Result<(), RegistrationError> {
        switch (projectFundings.get(projectId)) {
            case (null) { return #err(#ProjectNotFound); };
            case (?project) {
                let contributionOpt = Array.find<Contribution>(
                    project.contributions,
                    func(contribution : Contribution) : Bool { contribution.contributor == caller }
                );

                switch (contributionOpt) {
                    case (null) { return #err(#InsufficientFunds); };
                    case (?contribution) {
                        try {
                            let escrowAccount = getEscrowAccount(projectId);
                            let transferResult = await ckbtc.icrc1_transfer({
                                from_subaccount = escrowAccount.subaccount;
                                to = { owner = caller; subaccount = null };
                                amount = contribution.amount;
                                fee = null;
                                memo = null;
                                created_at_time = null;
                            });

                            switch (transferResult) {
                                case (#Ok(_)) {
                                    let updatedContributions = Array.filter<Contribution>(
                                        project.contributions,
                                        func(c : Contribution) : Bool { c.contributor != caller }
                                    );
                                    let updatedProject : ProjectFunding = {
                                        creator = project.creator;
                                        beneficiary = project.beneficiary;
                                        escrowAccount = project.escrowAccount;
                                        fundingGoal = project.fundingGoal;
                                        deadline = project.deadline;
                                        totalFunds = project.totalFunds - contribution.amount;
                                        isActive = project.isActive;
                                        contributions = updatedContributions;
                                        createdAt = project.createdAt;
                                        title = project.title;
                                        description = project.description;
                                    };
                                    projectFundings.put(projectId, updatedProject);
                                    #ok(())
                                };
                                case (#Err(e)) { #err(#TransferFailed(e)) };
                            };
                        } catch (e) {
                            #err(#CanisterError(Error.message(e)))
                        };
                    };
                };
            };
        };
    };

    public shared({ caller }) func releaseFunds(projectId : Nat) : async Result.Result<(), RegistrationError> {
        switch (projectFundings.get(projectId)) {
            case (null) { return #err(#ProjectNotFound); };
            case (?project) {
                if (caller != project.creator) {
                    return #err(#Unauthorized);
                };

                if (project.totalFunds < project.fundingGoal) {
                    return #err(#FundingGoalNotMet);
                };

                if (not project.isActive) {
                    return #err(#ProjectInactive);
                };

                try {
                    let escrowAccount = getEscrowAccount(projectId);
                    let escrowBalance = await ckbtc.icrc1_balance_of(escrowAccount);
                    
                    if (escrowBalance < project.totalFunds) {
                        return #err(#InsufficientFunds);
                    };

                    let transferResult = await ckbtc.icrc1_transfer({
                        from_subaccount = escrowAccount.subaccount;
                        to = { owner = project.beneficiary; subaccount = null };
                        amount = project.totalFunds;
                        fee = null;
                        memo = null;
                        created_at_time = null;
                    });

                    switch (transferResult) {
                        case (#Ok(_)) {
                            let updatedProject : ProjectFunding = {
                                project with
                                totalFunds = 0;
                                isActive = false;
                                contributions = [];
                            };
                            projectFundings.put(projectId, updatedProject);
                            #ok(())
                        };
                        case (#Err(e)) { #err(#TransferFailed(e)) };
                    };
                } catch (e) {
                    #err(#CanisterError(Error.message(e)))
                };
            };
        };
    };

    // Query Functions 
    public query func getProject(projectId : Nat) : async Result.Result<ProjectFunding, RegistrationError> {
        switch (projectFundings.get(projectId)) {
            case (null) { #err(#ProjectNotFound) };
            case (?project) { #ok(project) };
        };
    };

    public query func getAllProjects() : async [ProjectFunding] {
        Iter.toArray(projectFundings.vals())
    };

    public query func getActiveProjects() : async [ProjectFunding] {
        let activeProjects = Buffer.Buffer<ProjectFunding>(0);
        for (project in projectFundings.vals()) {
            if (isProjectActive(project)) {
                activeProjects.add(project);
            };
        };
        Buffer.toArray(activeProjects)
    };

    public query func getProjectsByCreator(creator : Principal) : async [ProjectFunding] {
        let creatorProjects = Buffer.Buffer<ProjectFunding>(0);
        for (project in projectFundings.vals()) {
            if (project.creator == creator) {
                creatorProjects.add(project);
            };
        };
        Buffer.toArray(creatorProjects)
    };

    public query func getUserContributions(user : Principal) : async [(Nat, ProjectFunding, Nat)] {
        let userContributions = Buffer.Buffer<(Nat, ProjectFunding, Nat)>(0);
        for ((projectId, project) in projectFundings.entries()) {
            let contributionOpt = Array.find<Contribution>(
                project.contributions,
                func(contribution : Contribution) : Bool { contribution.contributor == user }
            );
            switch (contributionOpt) {
                case (?contribution) {
                    userContributions.add((projectId, project, contribution.amount));
                };
                case (null) {};
            };
        };
        Buffer.toArray(userContributions)
    };

    public query func getRegistrationFee() : async Nat {
        REGISTRATION_FEE
    };

    public query func isRegistered(user : Principal) : async Bool {
        Option.isSome(registeredUsers.get(user))
    };

    public shared query({ caller }) func getAllRegisteredUsers() : async Result.Result<[UserRegistration], RegistrationError> {
        /*        if (not isAdmin(caller)) {
            return #err(#Unauthorized);
        };*/

        let registrations = Buffer.Buffer<UserRegistration>(registeredUsers.size());
        for ((_, registration) in registeredUsers.entries()) {
            registrations.add(registration);
        };
        #ok(Buffer.toArray(registrations))
    };

    // Admin Functions
    public shared({ caller }) func addAdmin(newAdmin : Principal) : async Result.Result<(), RegistrationError> {
        /*        if (not isAdmin(caller)) {
            return #err(#Unauthorized);
        };*/
        adminPrincipals := Array.append(adminPrincipals, [newAdmin]);
        #ok(())
    };

    public shared({ caller }) func removeAdmin(adminToRemove : Principal) : async Result.Result<(), RegistrationError> {
        /*        if (not isAdmin(caller)) {
            return #err(#Unauthorized);
        };*/
        
        if (Array.size(adminPrincipals) <= 1) {
            return #err(#Unauthorized);
        };
        
        adminPrincipals := Array.filter<Principal>(
            adminPrincipals,
            func(p : Principal) : Bool { p != adminToRemove }
        );
        #ok(())
    };

    // System Functions
    system func preupgrade() {
        registeredUsersEntries := Iter.toArray(registeredUsers.entries());
        projectFundingEntries := Iter.toArray(projectFundings.entries());
    };

    system func postupgrade() {
        registeredUsers := HashMap.fromIter<Principal, UserRegistration>(
            registeredUsersEntries.vals(),
            10,
            Principal.equal,
            Principal.hash
        );
        registeredUsersEntries := [];

        projectFundings := HashMap.fromIter<Nat, ProjectFunding>(
            projectFundingEntries.vals(),
            10,
            Nat.equal,
            Hash.hash
        );
        projectFundingEntries := [];
    };
}