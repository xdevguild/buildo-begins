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
import {
  chain,
  shortChainId,
  builtInSC,
  commonOpertationsGasLimit,
  nftTokenSpecialRoles,
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
      'Please provide the address to assign the role. Can be also yours\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'multiselect',
    name: 'specialRoles',
    message: 'Please choose special roles to assign.\n',
    choices: nftTokenSpecialRoles.map((property) => ({
      title: property,
      value: property,
    })),
  },
];

export const setSpecialRolesNft = async () => {
  try {
    const { ticker, address, specialRoles } = await prompts(promptQuestions);

    if (!ticker || !address) {
      console.log('You have to provide the ticker and address!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = [
      BytesValue.fromUTF8(ticker),
      new AddressValue(new Address(address.trim())),
    ];

    for (const role of nftTokenSpecialRoles) {
      if (specialRoles.includes(role)) {
        args.push(BytesValue.fromUTF8(role));
      }
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('setSpecialRole'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: commonOpertationsGasLimit,
      receiver: new Address(builtInSC.trim()),
      sender: signer.getAddress(),
      value: 0,
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
