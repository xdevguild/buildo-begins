import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  Transaction,
  BytesValue,
  Address,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
} from '@multiversx/sdk-core';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import {
  chain,
  shortChainId,
  builtInSC,
  commonOpertationsGasLimit,
  sftNftTokenProperties,
} from '../config';

const promptQuestions: PromptObject[] = [
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'multiselect',
    name: 'tokenProperties',
    message: `Please choose a new set of the properties for the token.\n`,
    choices: sftNftTokenProperties.map((property) => ({
      title: property.name,
      value: property.name,
      description: property.description,
    })),
  },
];

export const changePropertiesMetaEsdt = async () => {
  try {
    const { ticker, tokenProperties } = await prompts(promptQuestions);

    if (!ticker) {
      console.log('You have to provide the ticker!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = [BytesValue.fromUTF8(ticker)];

    for (const property of sftNftTokenProperties) {
      let propertyEnabled = false;

      if (tokenProperties.includes(property.name)) {
        propertyEnabled = true;
      }

      args.push(BytesValue.fromUTF8(property.name));
      args.push(BytesValue.fromUTF8(propertyEnabled.toString()));
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('controlChanges'))
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
