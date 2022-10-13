export HOST='0.0.0.0'
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DB=faucet
export PROM_USER=postgres
export PROM_PASSWORD=test
export NETWORK_RPC_NODE="http://peer0.testnet.uptick.network:8545"
export FAUCET_WAIT_PERIOD=1d
export FAUCET_DISTRIBUTION_AMOUNT="5000000000000000000"
export FAUCET_DENOM=auptick
export FAUCET_FEES=1000
export FAUCET_GAS=200000
export FAUCET_MEMO="send amount"
export ADDRESS_PREFIX="uptick"
export AUTH0_DOMAIN="uptick-faucet.jp.auth0.com";
export AUTH0_AUDIENCE="http://zhangboxing.com";
# export FAUCET_MNEMONIC="predict buyer manual sniff decline shell relief cheese gossip abandon bullet opera"
# export FAUCET_MNEMONIC="island hammer teach mystery rain rib goddess stem sweet junior term pluck large rebel scare solid prepare water secret art assume color comfort where"
export FAUCET_MNEMONIC="island hammer teach mystery rain rib goddess stem sweet junior term pluck large rebel scare solid prepare water secret art assume color comfort where"


if [ ! -d "./logs" ]; then
  mkdir logs
fi

bash supportEthermint.sh
bash supportUptick.sh
docker-compose  -f db-compose.yml up -d
yarn migrate
nohup yarn start > ./logs/faucet.log 2>&1 &