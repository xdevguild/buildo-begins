import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  TokenPayment,
  Transaction,
  ESDTNFTTransferPayloadBuilder,
  Address,
} from '@elrondnetwork/erdjs';
import axios from 'axios';

import { areYouSureAnswer, setup, commonTxOperations } from './utils';
import { chain, shortChainId, publicApi } from './config';

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
    message: 'Please provide the NFT token id (ex. ABCD-ds323d-0d)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

export const sendNft = async () => {
  try {
    const { address, token } = await prompts(promptQuestions);

    if (!address || !token) {
      console.log(
        'You have to provide the address and NFT token id and amount!'
      );
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const nftOnNetwork = await axios.get<{ nonce: number; ticker: string }>(
      `${publicApi[chain]}/nfts/${token}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const nonce = nftOnNetwork?.data?.nonce;
    const collectionTicker = nftOnNetwork?.data?.ticker;

    if (
      nonce !== undefined &&
      nonce !== null &&
      collectionTicker !== undefined &&
      collectionTicker !== null
    ) {
      const payment = TokenPayment.nonFungible(collectionTicker, nonce);
      const data = new ESDTNFTTransferPayloadBuilder()
        .setPayment(payment)
        .setDestination(new Address(address))
        .build();

      const tx = new Transaction({
        nonce,
        data,
        gasLimit: 50000 + 1500 * data.length() + 1000000,
        receiver: signer.getAddress(), // Same as sender address!
        chainID: shortChainId[chain],
      });

      await commonTxOperations(tx, userAccount, signer, provider);
    } else {
      console.log(
        "Can't get the information about the NFT token on the network. Check configuration and chain type."
      );
    }
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
