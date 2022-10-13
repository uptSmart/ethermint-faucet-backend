// import { DirectSecp256k1HdWallet } from "@uptsmart/proto-signing";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, coins, parseCoins } from "@uptsmart/stargate";
import { stringToPath } from "@cosmjs/crypto";
import parse from "parse-duration";
import { Wallet } from '@ethersproject/wallet'
const { ethers } = require('ethers');

const NETWORK_RPC_NODE = process.env.NETWORK_RPC_NODE || "http://localhost:26657";
const FAUCET_MNEMONIC = process.env.FAUCET_MNEMONIC;
const FAUCET_WAIT_PERIOD = process.env.FAUCET_WAIT_PERIOD || "24h";
const FAUCET_DISTRIBUTION_AMOUNT = process.env.FAUCET_DISTRIBUTION_AMOUNT || "100000000000000000";
const FAUCET_DENOM = process.env.FAUCET_DENOM || "auptick";
const FAUCET_FEES = process.env.FAUCET_FEES || 1000;
const FAUCET_GAS = process.env.FAUCET_GAS || "200000";
const FAUCET_MEMO = process.env.FAUCET_MEMO || "send amount";
const ADDRESS_PREFIX = process.env.ADDRESS_PREFIX || "uptick";

export const getWallet = () => {

  return DirectSecp256k1HdWallet.fromMnemonic(FAUCET_MNEMONIC as any, {
    prefix: ADDRESS_PREFIX,
    hdPaths: [stringToPath("m/44'/60'/0'/0")],
  });

};

export const getEthWallet = () => {

  console.log("xxl FAUCET_MNEMONIC is ",FAUCET_MNEMONIC,ADDRESS_PREFIX);
  // const ethProvider = new ethers.provider.JsonRpcProvider(NETWORK_RPC_NODE);
  const ethProvider = new ethers.providers.JsonRpcProvider(NETWORK_RPC_NODE);

  const wallet = Wallet.fromMnemonic(FAUCET_MNEMONIC as any).connect(ethProvider);
  console.log("evmos ",wallet);


  return wallet;
};

export const getDenom = () => {
  return FAUCET_DENOM;
};

export const getWaitPeriod = () => {
  return parse(FAUCET_WAIT_PERIOD);
};

export const getDistributionAmount = () => {
  return FAUCET_DISTRIBUTION_AMOUNT;
};

export const getChainId = async () => {
  const wallet = await getWallet();
  const client = await SigningStargateClient.connectWithSigner(
    NETWORK_RPC_NODE as any,
    wallet
  );
  return await client.getChainId();
};

export const sendTokens = async (recipient: any, amount: any) => {

  const wallet = await getEthWallet();
  console.log("xxl sendTokens : ",wallet.address,recipient,FAUCET_DISTRIBUTION_AMOUNT);


  
  try{
      let result = await wallet.sendTransaction(
          { 
            from:wallet.address,
            to:recipient,
            value:FAUCET_DISTRIBUTION_AMOUNT
          }
        );

      console.log("xxl result : ",result);
      return result;
  }catch(e){
      console.log("xxl e ",e);
      return e;
  }


  // const [account] = await wallet.getAccounts();
  // console.log("xxl wallet is :",account);


  // const client = await SigningStargateClient.connectWithSigner(
  //   NETWORK_RPC_NODE as any,
  //   wallet
  // );

  // console.log("12");
  // if (!amount) amount = getDistributionAmount();

  // console.log("13");
  // const sendMsg = {
  //   typeUrl: "/cosmos.bank.v1beta1.MsgSend",
  //   value: {
  //     fromAddress: account.address,
  //     toAddress: recipient,
  //     amount: parseCoins(`${amount}${FAUCET_DENOM}`),
  //   },
  // };

  // console.log("14");
  // const fee = {
  //   amount: coins(parseInt(FAUCET_FEES as any), FAUCET_DENOM),
  //   gas: FAUCET_GAS,
  // };

  // console.log("15",account.address,sendMsg);
  // return await client.signAndBroadcast(
  //   account.address,
  //   [sendMsg],
  //   fee as any,
  //   FAUCET_MEMO
  // );
};
