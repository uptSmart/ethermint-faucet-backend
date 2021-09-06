export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DB=faucet
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=test
export PROM_USER=prom
export PROM_PASSWORD=client
export NETWORK_RPC_NODE="http://127.0.0.1:26657"
export FAUCET_WAIT_PERIOD=1d
export FAUCET_DISTRIBUTION_AMOUNT=1000000000000000000
export FAUCET_DENOM=aphoton
export FAUCET_FEES=5000
export FAUCET_GAS=180000
export FAUCET_MEMO="Sent from Hanchon's Faucet"
export ADDRESS_PREFIX="ethm"
export AUTH0_DOMAIN="hanchon.eu.auth0.com"
export AUTH0_AUDIENCE="https://faucet.hanchon.live"
export FAUCET_MNEMONIC="visual trend scene cake abstract farm fee orchard child deposit power mean capable chalk enough orange make vendor direct enlist pill dragon early autumn"

yarn start
# yarn migrate
