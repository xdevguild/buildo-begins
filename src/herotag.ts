import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  Transaction,
  ContractCallPayloadBuilder,
  ContractFunction,
  TypedValue,
  BytesValue,
  SmartContract,
} from '@elrondnetwork/erdjs';

import axios from 'axios';

import {
  areYouSureAnswer,
  setup,
  commonTxOperations,
  dnsScAddressForHerotag,
} from './utils';
import { chain, shortChainId, publicApi } from './config';

const promptQuestions: PromptObject[] = [
  {
    type: 'select',
    name: 'type',
    message: 'What do you want to do with the herotag?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      { title: 'Create one', value: 'create' },
      { title: 'Check the address for one', value: 'check' },
    ],
  },
  {
    type: 'text',
    name: 'herotag',
    message: 'Please provide the herotag name (without .elrond suffix)\n',
    validate: (value) => {
      if (!value) return 'Required!';
      if (value.length > 25 || value.length < 3) {
        return 'Length between 3 and 25 characters!';
      }
      if (!new RegExp(/^[a-z0-9]+$/).test(value)) {
        return 'Lowercase alphanumeric characters only!';
      }
      return true;
    },
  },
];

export const herotag = async () => {
  const { herotag, type } = await prompts(promptQuestions);

  if (!herotag) {
    console.log('You have to provide the herotag name!');
    exit(9);
  }

  if (type === 'check') {
    try {
      const response = await axios.get<{ address: string }>(
        `${publicApi[chain]}/usernames/${herotag.trim()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log(
        `\nAddress of ${herotag}.elrond is: ${response?.data?.address}\n`
      );
    } catch {
      console.log(
        '\nThere is no such herotag registered. Please also check the chain type. By default it checks on the devnet.\n'
      );
    }
  } else {
    try {
      await areYouSureAnswer();

      const dnsScAddress = dnsScAddressForHerotag(`${herotag}.elrond`);
      const heroBytes = BytesValue.fromUTF8(`${herotag}.elrond`);

      const { signer, userAccount, provider } = await setup();

      const dnsSc = new SmartContract({ address: dnsScAddress });
      const dnsCanRegisterQuery = dnsSc.createQuery({
        func: new ContractFunction('canRegister'),
        args: [heroBytes],
      });

      await provider.queryContract(dnsCanRegisterQuery);

      const args: TypedValue[] = [heroBytes];

      const data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('register'))
        .setArgs(args)
        .build();

      const tx = new Transaction({
        data,
        value: 0,
        gasLimit: 50000 + 1500 * data.length() + 20000000,
        receiver: dnsScAddress,
        chainID: shortChainId[chain],
      });

      await commonTxOperations(tx, userAccount, signer, provider);
    } catch (e) {
      console.log((e as Error)?.message);
    }
  }
};
