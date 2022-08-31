import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import Bignumber from 'bignumber.js';
import {
  Transaction,
  BytesValue,
  BigUIntValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
} from '@elrondnetwork/erdjs';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import { chain, shortChainId, specialOpertationsGasLimit } from '../config';

const promptQuestions: PromptObject[] = [
  {
    type: 'select',
    name: 'type',
    message: 'Do you want to mint or burn supply?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      { title: 'Mint', value: 'mint' },
      { title: 'Burn', value: 'burn' },
    ],
  },
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'supply',
    message: 'Please provide the supply\n',
    validate: (value) =>
      !value || new Bignumber(value).isNaN() ? 'Required number!' : true,
  },
];

export const mintBurnEsdt = async () => {
  try {
    const { ticker, supply, type } = await prompts(promptQuestions);

    if (!ticker || !supply) {
      console.log('You have to provide the ticker and supply!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = [
      BytesValue.fromUTF8(ticker),
      new BigUIntValue(new Bignumber(supply)),
    ];

    const data = new ContractCallPayloadBuilder()
      .setFunction(
        new ContractFunction(
          type === 'mint' ? 'ESDTLocalMint' : 'ESDTLocalBurn'
        )
      )
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: specialOpertationsGasLimit,
      receiver: userAccount.address,
      sender: signer.getAddress(),
      value: 0,
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
