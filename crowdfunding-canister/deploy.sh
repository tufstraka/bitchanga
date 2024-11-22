!/bin/bash

# Install dependencies
mops install

# Start local replica if not running
dfx start --background

# Deploy ckBTC ledger canister (for local testing)
dfx deploy ckbtc_ledger

# Get the ckBTC ledger canister ID
CKBTC_LEDGER_ID=$(dfx canister id ckbtc_ledger)

# Deploy crowdfunding platform with initialization arguments
dfx deploy crowdfunding --argument "(
  principal \"$CKBTC_LEDGER_ID\", # ckBTC ledger
  principal \"rwlgt-iiaaa-aaaaa-aaaaa-cai\", # Bitcoin API (using placeholder)
  principal \"$(dfx identity get-principal)\", # project owner
  100_000_000, # minimum contribution (1 ckBTC)
  variant { Testnet } # network type
)"