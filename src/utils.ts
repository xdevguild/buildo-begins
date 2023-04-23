import { accessSync, constants, readFileSync } from 'fs';
import decompress from 'decompress';
import getStream from 'get-stream';
import got, { ResponseType } from 'got';
import { pEvent } from 'p-event';
import path from 'path';
import { exit, cwd } from 'process';
import prompts, { PromptObject } from 'prompts';
import {
  Transaction,
  TransactionWatcher,
  Account,
  SmartContract,
  Address,
} from '@multiversx/sdk-core';
import ora from 'ora';
import keccak from 'keccak';
import { parseUserKey, UserSigner } from '@multiversx/sdk-wallet';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers';

import { publicApi, chain, multiversxExplorer } from './config';

const baseDir = cwd();

export const getFileContents = (
  relativeFilePath: string,
  options: { isJSON?: boolean; noExitOnError?: boolean }
) => {
  const isJSON = options.isJSON === undefined ? true : options.isJSON;
  const noExitOnError =
    options.noExitOnError === undefined ? false : options.noExitOnError;

  const filePath = `${baseDir}/${relativeFilePath}`;

  try {
    accessSync(filePath, constants.R_OK | constants.W_OK);
  } catch (err) {
    if (!noExitOnError) {
      console.error(`There is no ${relativeFilePath}!`);
      exit(9);
    } else {
      return undefined;
    }
  }

  const rawFile = readFileSync(filePath);
  const fileString = rawFile.toString('utf8');

  if (isJSON) {
    return JSON.parse(fileString);
  }
  return fileString;
};

export const getProvider = () => {
  return new ApiNetworkProvider(publicApi[chain], {
    timeout: 10000,
  });
};

export const prepareUserSigner = (walletPemKey: string) => {
  return UserSigner.fromPem(walletPemKey);
};

// Prepare main user account from the wallet PEM file
export const prepareUserAccount = async (walletPemKey: string) => {
  const userKey = parseUserKey(walletPemKey);
  const address = userKey.generatePublicKey().toAddress();
  return new Account(address);
};

export const setup = async () => {
  const walletPemKey = getFileContents('walletKey.pem', { isJSON: false });
  // Provider type based on initial configuration
  const provider = getProvider();

  const userAccount = await prepareUserAccount(walletPemKey);
  const userAccountOnNetwork = await provider.getAccount(userAccount.address);
  userAccount.update(userAccountOnNetwork);

  const signer = prepareUserSigner(walletPemKey);

  return {
    signer,
    userAccount,
    provider,
  };
};

export const commonConfirmationPrompt: PromptObject[] = [
  {
    type: 'select',
    name: 'areYouSureAnswer',
    message: 'Are you sure?',
    choices: [
      { title: 'Yes', value: 'yes' },
      { title: 'No', value: 'no' },
    ],
  },
];

export const areYouSureAnswer = async () => {
  const { areYouSureAnswer } = await prompts(commonConfirmationPrompt);

  if (areYouSureAnswer !== 'yes') {
    console.log('Aborted!');
    exit(9);
  }
};

export const commonTxOperations = async (
  tx: Transaction,
  account: Account,
  signer: UserSigner,
  provider: ApiNetworkProvider
) => {
  const spinner = ora('Processing the transaction...');

  try {
    tx.setNonce(account.nonce);
    account.incrementNonce();

    const serialized: Buffer = tx.serializeForSigning();
    const signature: Buffer = await signer.sign(serialized);
    tx.applySignature(signature);

    spinner.start();

    await provider.sendTransaction(tx);

    const watcher = new TransactionWatcher(provider);
    const transactionOnNetwork = await watcher.awaitCompleted(tx);

    const txHash = transactionOnNetwork.hash;
    const txStatus = transactionOnNetwork.status;

    spinner.stop();

    console.log(`\nTransaction status: ${txStatus}`);
    console.log(
      `Transaction link: ${multiversxExplorer[chain]}/transactions/${txHash}\n`
    );
  } catch (e) {
    spinner.stop();
    throw new Error(
      (e as Error)?.message ||
        'Something wen wrond when processing the transaction!'
    );
  }
};

export const dnsScAddressForHerotag = (herotag: string) => {
  const hashedHerotag = keccak('keccak256').update(herotag).digest();

  const initialAddress = Buffer.from(Array(32).fill(1));
  const initialAddressSlice = initialAddress.slice(0, 30);
  const scId = hashedHerotag.slice(31);

  const deployer_pubkey = Buffer.concat([
    initialAddressSlice,
    Buffer.from([0, scId.readUIntBE(0, 1)]),
  ]);

  const scAddress = SmartContract.computeAddress(
    new Address(deployer_pubkey),
    0
  );

  return scAddress;
};

// Based on not maintained: https://github.com/kevva/download (simplified)
export const downloadAndExtract = (
  uri: string,
  output: string | null,
  options: Record<string, unknown>
) => {
  const gotOptions = {
    responseType: 'buffer' as unknown as ResponseType,
    https: {
      rejectUnauthorized: process.env.npm_config_strict_ssl !== 'false',
    },
  };

  const stream = got.stream(uri, gotOptions);

  const promise = pEvent(stream, 'response')
    .then((res) => {
      return Promise.all([
        getStream(stream, { encoding: 'buffer' as BufferEncoding }),
        res,
      ]);
    })
    .then((result) => {
      const [data] = result;

      if (!output) {
        return decompress(data, options);
      }

      const filename = options.filename;
      const outputFilepath = path.join(output, filename as string);

      return decompress(data, path.dirname(outputFilepath), options);
    });

  return {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    ...stream,
  };
};
