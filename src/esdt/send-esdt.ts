import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  TokenPayment,
  Transaction,
  ESDTTransferPayloadBuilder,
  Address,
} from '@elrondnetwork/erdjs';
import axios from 'axios';

import { areYouSureAnswer, setup, commonTxOperations } from '../utils';
import { chain, shortChainId, publicApi } from '../config';

const promptQuestions: PromptObject[] = [
  {
    type: 'text',
    name: 'address',
    message: 'Please provide the erd address (receiver)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'token',
    message: 'Please provide the ESDT token ticker/id (ex. ABCD-ds323d)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'amount',
    message:
      'Please provide the amount of ESDT to send (ex. 1.5 is 1.5 amount of an ESDT token)\n',
    validate: (value) =>
      value && !Number.isNaN(value) && Number(value) > 0
        ? true
        : `Please provide a number, should be a proper ESDT amount for that specific token, bigger than 0`,
  },
];

export const sendEsdt = async () => {
  try {
    const { address, amount, token } = await prompts(promptQuestions);

    if (!address || !amount || !token) {
      console.log('You have to provide the address, token ticker and amount!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const esdtOnNetwork = await axios.get<{ decimals: number }>(
      `${publicApi[chain]}/tokens/${token.trim()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const numDecimals = esdtOnNetwork?.data?.decimals;

    if (numDecimals !== undefined && numDecimals !== null) {
      const payment = TokenPayment.fungibleFromAmount(
        token,
        amount,
        numDecimals
      );
      const data = new ESDTTransferPayloadBuilder().setPayment(payment).build();

      const tx = new Transaction({
        data,
        gasLimit: 50000 + 1500 * data.length() + 300000,
        receiver: new Address(address.trim()),
        chainID: shortChainId[chain],
      });

      await commonTxOperations(tx, userAccount, signer, provider);
    } else {
      console.log(
        "Can't get the information about the ESDT token on the network. Check configuration and chain type."
      );
    }
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
