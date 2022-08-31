import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  Transaction,
  BytesValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
  Address,
} from '@elrondnetwork/erdjs';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import {
  chain,
  shortChainId,
  commonOpertationsGasLimit,
  builtInSC,
} from '../config';

const promptQuestions: PromptObject[] = [
  {
    type: 'select',
    name: 'type',
    message: 'Do you want to pause or unpause all transactions of the token?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      { title: 'Pause', value: 'pause' },
      { title: 'Unpause', value: 'unpause' },
    ],
  },
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

export const pauseUnpauseEsdt = async () => {
  try {
    const { ticker, type } = await prompts(promptQuestions);

    if (!ticker) {
      console.log('You have to provide the ticker!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = [BytesValue.fromUTF8(ticker)];

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction(type === 'pause' ? 'pause' : 'unPause'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: commonOpertationsGasLimit,
      receiver: new Address(builtInSC),
      sender: signer.getAddress(),
      value: 0,
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
