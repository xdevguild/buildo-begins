import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  Transaction,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
  BytesValue,
  TransactionPayload,
} from '@multiversx/sdk-core';

import { areYouSureAnswer, setup, commonTxOperations } from './utils';
import { chain, shortChainId } from './config';

const getKeyValuesForTx = (keyValuesArr: string[]) => {
  return keyValuesArr
    .map((keyValue: string) => {
      if (keyValue.includes(':')) {
        return keyValue
          .replaceAll(' ', '')
          .split(':')
          .map((val) => BytesValue.fromUTF8(val));
      }
      return [];
    })
    .flat();
};

// https://docs.multiversx.com/developers/account-storage/#transaction-format
const getTotalAdditionalGasLimit = (
  data: TransactionPayload,
  keyValuePairs: string
) => {
  const saveKeyValueCost = 100_000;
  const moveBalanceCost = 50_000;
  const costPerByte = data.length() * 1_500;

  let persistPerByteKey = 0;
  let persistPerByteValue = 0;
  let storePerByte = 0;

  for (const keyValue of keyValuePairs) {
    if (keyValue.includes(':')) {
      const split = keyValue.replaceAll(' ', '').split(':');
      const key = split[0];
      const value = split[1];
      persistPerByteKey = persistPerByteKey + key.length * 1_000;
      persistPerByteValue = persistPerByteValue + value.length * 1_000;
      storePerByte = storePerByte + value.length * 10_000;
    }
  }

  return (
    saveKeyValueCost +
    moveBalanceCost +
    costPerByte +
    persistPerByteKey +
    persistPerByteValue +
    storePerByte
  );
};

const promptQuestions: PromptObject[] = [
  {
    type: 'list',
    name: 'keyValuePairs',
    message:
      "Please provide key-value data pairs. Separate with commas (,). Example: key:value,key2:value2. (Keys can't begin with 'ELROND')\n",
    validate: (value) => (!value ? 'Required field!' : true),
  },
];

export const accountStore = async () => {
  const { keyValuePairs } = await prompts(promptQuestions);

  if (!keyValuePairs) {
    console.log('You have to provide the key-value data pairs!');
    exit(9);
  }

  try {
    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = getKeyValuesForTx(keyValuePairs);

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('SaveKeyValue'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      value: 0,
      gasLimit: getTotalAdditionalGasLimit(data, keyValuePairs),
      receiver: signer.getAddress(),
      sender: signer.getAddress(),
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
