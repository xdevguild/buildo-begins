import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  Transaction,
  BytesValue,
  AddressValue,
  Address,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
} from '@elrondnetwork/erdjs';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import { chain, shortChainId, esdtTransferOwnershipGasLimit } from '../config';

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
    message: 'Please provide the address to transfer. Can be also yours\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

export const transferOwnershipESDT = async () => {
  try {
    const { ticker, address } = await prompts(promptQuestions);

    if (!ticker || !address) {
      console.log('You have to provide the ticker and new owner address!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = [
      BytesValue.fromUTF8(ticker),
      new AddressValue(new Address(address.trim())),
    ];

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('transferOwnership'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: esdtTransferOwnershipGasLimit,
      receiver: new Address(address.trim()),
      value: 0,
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
