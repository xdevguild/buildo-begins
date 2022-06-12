import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import Bignumber from 'bignumber.js';
import {
  TokenPayment,
  Transaction,
  BytesValue,
  U32Value,
  BigUIntValue,
  Address,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
} from '@elrondnetwork/erdjs';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import {
  chain,
  shortChainId,
  issueTokenPayment,
  builtInTokenIssuanceSC,
  esdtOpertationsGasLimit,
  esdtTokenProperties,
} from '../config';

const promptQuestions: PromptObject[] = [
  {
    type: 'text',
    name: 'name',
    message: 'Please provide the token name (3-20 characters, alphanumeric)\n',
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
      'Please provide the token ticker (3-10 characters, alphanumeric, uppercase)\n',
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
    name: 'initialSupply',
    message: 'Please provide the initial supply\n',
    validate: (value) =>
      !value || new Bignumber(value).isNaN() ? 'Required number!' : true,
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
    message:
      'Please choose token properties. When left empty it will set the property to false.\n',
    choices: esdtTokenProperties.map((property) => ({
      title: property,
      value: property,
    })),
  },
];

export const issueEsdt = async () => {
  try {
    const { name, ticker, initialSupply, numberOfDecimals, tokenProperties } =
      await prompts(promptQuestions);

    if (!name || !ticker || !initialSupply || !numberOfDecimals) {
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
      new BigUIntValue(new Bignumber(initialSupply)),
      new U32Value(numberOfDecimals),
    ];

    for (const property of esdtTokenProperties) {
      let propertyEnabled = false;

      if (tokenProperties.includes(property)) {
        propertyEnabled = true;
      }

      args.push(BytesValue.fromUTF8(property));
      args.push(BytesValue.fromUTF8(propertyEnabled.toString()));
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('issue'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: esdtOpertationsGasLimit,
      receiver: new Address(builtInTokenIssuanceSC.trim()),
      value: payment,
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
