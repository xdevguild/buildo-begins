import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  Transaction,
  BytesValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
  Address,
  AddressValue,
} from '@multiversx/sdk-core';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import {
  chain,
  shortChainId,
  commonOpertationsGasLimit,
  builtInSC,
} from '../config';

const promptQuestions: PromptObject[] = [
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'address',
    message:
      'Please provide the address to from which the token will be wiped\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

export const wipeEsdt = async () => {
  try {
    const { ticker, address } = await prompts(promptQuestions);

    if (!ticker) {
      console.log('You have to provide the ticker and address!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = [
      BytesValue.fromUTF8(ticker),
      new AddressValue(new Address(address)),
    ];

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('wipe'))
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
