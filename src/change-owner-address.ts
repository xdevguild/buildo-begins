import { areYouSureAnswer, setup, commonTxOperations } from './utils';
import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  Transaction,
  ContractCallPayloadBuilder,
  ContractFunction,
  Address,
  TypedValue,
  AddressValue,
} from '@multiversx/sdk-core';
import {
  chain,
  shortChainId,
  commonBuiltInOpertationsGasLimit,
} from './config';

export const changeOwnerAddress = async () => {
  const promptQuestion: PromptObject[] = [
    {
      type: 'text',
      name: 'smartContractAddress',
      message:
        'Please provide the smart contract address where the wallet (PEM) you use is an owner.\n',
      validate: (value) => (!value ? 'Required!' : true),
    },
    {
      type: 'text',
      name: 'newOwnerAddress',
      message:
        'Please provide the wallet address of the new smart contract owner.\n',
      validate: (value) => (!value ? 'Required!' : true),
    },
  ];

  try {
    const { smartContractAddress, newOwnerAddress } =
      await prompts(promptQuestion);

    if (!smartContractAddress || !newOwnerAddress) {
      console.log(
        "You have to provide the smart contract address and the new owner's address!"
      );
      exit();
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args: TypedValue[] = [new AddressValue(new Address(newOwnerAddress))];

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('ChangeOwnerAddress'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: commonBuiltInOpertationsGasLimit,
      receiver: new Address(smartContractAddress),
      sender: signer.getAddress(),
      value: 0,
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e: any) {
    console.log(e.message);
    exit();
  }
};
