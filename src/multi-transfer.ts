import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import {
  TokenTransfer,
  GasEstimator,
  TransferTransactionsFactory,
  Address,
  ITokenTransfer,
} from '@multiversx/sdk-core';
import axios from 'axios';

import { areYouSureAnswer, setup, commonTxOperations } from './utils';
import { chain, shortChainId, publicApi } from './config';

enum TokenType {
  FungibleESDT = 'FungibleESDT',
  MetaESDT = 'MetaESDT',
  NonFungibleESDT = 'NonFungibleESDT',
  SemiFungibleESDT = 'SemiFungibleESDT',
}

const promptQuestions: PromptObject[] = [
  {
    type: 'text',
    name: 'address',
    message: 'Please provide the receiver address\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'list',
    name: 'tokens',
    message:
      'Please provide tokens data to send. Separate with "," and "|". Example: ABCD-ds323d|1,ABCD-ds323d-0d|0.5 where: (tokenId|amount)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

export const multiTransfer = async () => {
  try {
    const { address, tokens } = await prompts(promptQuestions);

    if (!address || !tokens) {
      console.log('You have to provide the address and tokens list!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const getTokenTransfers: () => Promise<ITokenTransfer[]> = async () => {
      return tokens.map(async (tokenString: string) => {
        const tokenId = tokenString.split('|')?.[0];
        const amount = tokenString.split('|')?.[1];

        const tokenIdSegmentsLength = tokenId?.split('-').length;

        if (!tokenIdSegmentsLength) {
          console.log(
            'The input data is broken, please double check your input data.'
          );
          exit(9);
        }

        let decimals = 0;
        let nonce = 0;
        let collectionTicker = '';
        let tokenType = '';

        if (tokenIdSegmentsLength === 2) {
          const tokenOnNetwork = await axios.get<{
            decimals: number;
            nonce: number;
            ticker: string;
            type: string;
          }>(`${publicApi[chain]}/tokens/${tokenId.trim()}`, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          nonce = tokenOnNetwork?.data?.nonce;
          collectionTicker = tokenOnNetwork?.data?.ticker;
          tokenType = tokenOnNetwork?.data?.type;
          decimals = tokenOnNetwork?.data?.decimals;
        }

        if (tokenIdSegmentsLength === 3) {
          const tokenOnNetwork = await axios.get<{
            nonce: number;
            ticker: string;
            type: string;
          }>(`${publicApi[chain]}/nfts/${tokenId.trim()}`, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          nonce = tokenOnNetwork?.data?.nonce;
          collectionTicker = tokenOnNetwork?.data?.ticker;
          tokenType = tokenOnNetwork?.data?.type;
        }

        const checkAmount = () => {
          if (!amount) {
            console.log(
              'The input data is broken, please double check your input data.'
            );
            exit(9);
          }
        };

        if (tokenType === TokenType.FungibleESDT) {
          checkAmount();
          return TokenTransfer.fungibleFromAmount(tokenId, amount, decimals);
        }

        if (tokenType === TokenType.NonFungibleESDT) {
          return TokenTransfer.nonFungible(collectionTicker, nonce);
        }

        if (tokenType === TokenType.SemiFungibleESDT) {
          checkAmount();
          return TokenTransfer.semiFungible(
            collectionTicker,
            nonce,
            parseInt(amount, 10)
          );
        }

        if (tokenType === TokenType.MetaESDT) {
          checkAmount();
          return TokenTransfer.metaEsdtFromAmount(
            collectionTicker,
            nonce,
            amount,
            decimals
          );
        }
      });
    };

    const factory = new TransferTransactionsFactory(new GasEstimator());

    const tokenTransfers: ITokenTransfer[] = await Promise.all(
      await getTokenTransfers()
    );

    const tx = factory.createMultiESDTNFTTransfer({
      tokenTransfers,
      sender: signer.getAddress(),
      destination: new Address(address.trim()),
      chainID: shortChainId[chain],
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
