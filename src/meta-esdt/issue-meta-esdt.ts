import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  TokenPayment,
  Transaction,
  BytesValue,
  Address,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
  U32Value,
} from '@elrondnetwork/erdjs';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import {
  chain,
  shortChainId,
  issueTokenPayment,
  builtInSC,
  commonOpertationsGasLimit,
  sftNftTokenProperties,
} from '../config';

const promptQuestions: PromptObject[] = [
  {
    type: 'text',
    name: 'name',
    message:
      'Please provide the collection token name (3-20 characters, alphanumeric)\n',
    validate: (value) => {
      if (!value) return 'Required!';
      if (value.length > 20 || value.length < 3) {
        return 'Length between 3 and 20 characters!';
      }
      if (!new RegExp(/^[a-zA-Z0-9]+$/).test(value)) {
        return 'Alphanumeric characters only!';
      }
      return true;
    },
  },
  {
    type: 'text',
    name: 'ticker',
    message:
      'Please provide the collection token ticker (3-10 characters, alphanumeric, uppercase)\n',
    validate: (value) => {
      if (!value) return 'Required!';
      if (value.length > 10 || value.length < 3) {
        return 'Length between 3 and 10 characters!';
      }
      if (!new RegExp(/^[A-Z0-9]+$/).test(value)) {
        return 'Alphanumeric UPPERCASE only!';
      }
      return true;
    },
  },
  {
    type: 'text',
    name: 'numberOfDecimals',
    message: 'Please provide the number of decimals\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'multiselect',
    name: 'tokenProperties',
    message: 'Please choose token properties.\n',
    choices: sftNftTokenProperties.map((property) => ({
      title: property,
      value: property,
    })),
  },
];

export const issueMetaEsdt = async () => {
  try {
    const { name, ticker, tokenProperties, numberOfDecimals } = await prompts(
      promptQuestions
    );

    if (!name || !ticker || !numberOfDecimals) {
      console.log(
        'You have to provide the name, ticker, initial supply and number of decimals for your token!'
      );
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const payment = TokenPayment.egldFromAmount(issueTokenPayment);

    const args: TypedValue[] = [
      BytesValue.fromUTF8(name),
      BytesValue.fromUTF8(ticker),
      new U32Value(numberOfDecimals),
    ];

    for (const property of sftNftTokenProperties) {
      let propertyEnabled = false;

      if (tokenProperties.includes(property)) {
        propertyEnabled = true;
      }

      args.push(BytesValue.fromUTF8(property));
      args.push(BytesValue.fromUTF8(propertyEnabled.toString()));
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('registerMetaESDT'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: commonOpertationsGasLimit,
      receiver: new Address(builtInSC.trim()),
      sender: signer.getAddress(),
      value: payment,
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
