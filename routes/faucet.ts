import express from "express";

const router = express.Router();

import got from "got";
import {User, Transaction, BlockedAddress, UserRecord} from "../database";
import * as faucet from "../faucet";
import {ensureAuthenticated, blockedAddresses, userLimit} from "../utils";
import {ethToEthermint, ethermintToEth} from "@hanchon/ethermint-address-converter";

const DOMAIN = process.env.AUTH0_DOMAIN;
const ADDRESS_PREFIX = process.env.ADDRESS_PREFIX || "uptick";

import client from "prom-client";
import { BelongsToManyGetAssociationsMixin } from "sequelize/types";

const counterDrip = new client.Counter({
    name: "faucet_transaction_count",
    help: "faucet_transaction_count is the number of times the faucet dripped",
});

const counterDripError = new client.Counter({
    name: "faucet_transaction_error",
    help: "faucet_transaction_count is the number of times the faucet errored while dripping",
});

function invalidAddress(res: any) {
    counterDripError.inc();
    res.status(422).send(JSON.stringify({error: "invalid address"}));
}

const { bech32 } = require('bech32');

// const toHexString = bytes=>
//     bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

function toHexString(bytes:Array<any>) {
    return bytes.reduce(
        (str, byte) => str + byte.toString(16).padStart(2, '0'), 
        '');
}

router.post(
    "/",
    blockedAddresses,
    userLimit,
    async (req: any, res: any, next: any) => {

        console.log("facut 0001");

        let {address, userName} = req.body;
        let addressHex = address
        console.log("facut 0002 address",address);
        try {

            console.log("facut 00031");
            if (address.length < 2) return invalidAddress(res);
            console.log("facut 00032");
            // Hex encoded address
            if (address[0] === "0" && address[1] === "x") {
                console.log("facut 0004");
                // if (ethermintToEth(ethToEthermint(address)) !== address) return invalidAddress(res);
                // address = ethToEthermint(address)
            } else {
                // addressHex = ethermintToEth(address)
                // // Ethermint address
                // if (!address.includes(ADDRESS_PREFIX)) return invalidAddress(res);
                // if (ethToEthermint(ethermintToEth(address)) !== address) return invalidAddress(res);
                console.log("facut 0005");
                let decode = bech32.decode(address);
                console.log("facut 00051");
                let array = bech32.fromWords(decode.words);
                console.log("facut 00052");
                let evmAddress = toHexString(array);

                console.log("facut 0006");
                address = "0x" + evmAddress;
            }
        } catch (error) {
            return invalidAddress(res)
        }

        try {
            const result = await faucet.sendTokens(address, null);
            await BlockedAddress.create({
                address: addressHex,
            })

            await UserRecord.create({
                userName: userName,
            })

            res
                .status(201)
                .send(JSON.stringify({transactionHash: result.hash}));
        } catch (error) {
            counterDripError.inc();
            res.status(422).send(JSON.stringify({error: error.message}));
        }
    }
);



export {router};
