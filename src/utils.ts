import { accessSync, constants, readFileSync } from 'fs';
import { exit, cwd } from 'process';
import prompts, { PromptObject } from 'prompts';
import { Transaction, TransactionWatcher } from '@elrondnetwork/erdjs';
import ora from 'ora';

import { Account } from '@elrondnetwork/erdjs';
import { parseUserKey, UserSigner } from '@elrondnetwork/erdjs-walletcore';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';

import { publicApi, chain, elrondExplorer } from './config';

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
  tx.setNonce(account.nonce);
  account.incrementNonce();
  signer.sign(tx);

  const spinner = ora('Processing the transaction...');
  spinner.start();

  await provider.sendTransaction(tx);

  const watcher = new TransactionWatcher(provider);
  const transactionOnNetwork = await watcher.awaitCompleted(tx);

  const txHash = transactionOnNetwork.hash;
  const txStatus = transactionOnNetwork.status;

  spinner.stop();

  console.log(`\nTransaction status: ${txStatus}`);
  console.log(
    `Transaction link: ${elrondExplorer[chain]}/transactions/${txHash}\n`
  );
};
