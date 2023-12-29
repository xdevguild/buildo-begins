import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';
import { inspect } from 'util';
import { Buffer } from 'buffer';
import { TransactionDecoder } from '@multiversx/sdk-transaction-decoder/lib/src/transaction.decoder.js';

const promptQuestions: PromptObject[] = [
  {
    type: 'text',
    name: 'senderAddress',
    message: 'Please provide the sender address\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'receiverAddress',
    message:
      'Please provide the receiver address. (The same as sender in case of all ESDT tokens (including SFTs and NFTs))\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'dataString',
    message:
      'Please provide the data string in base64 encoded form or not encoded\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'number',
    name: 'value',
    message:
      'Please provide the value for the transaction (only for EGLD transactions, otherwise 0)\n',
    initial: 0,
  },
];

export const decodeTransaction = async () => {
  try {
    const { senderAddress, receiverAddress, dataString, value } =
      await prompts(promptQuestions);

    if (!senderAddress || !receiverAddress || !dataString) {
      console.log(
        'You must provide at least the sender, receiver, and data string!'
      );
      exit(9);
    }

    const transactionDecoder = new TransactionDecoder();

    const isBase64Encoded =
      Buffer.from(dataString, 'base64').toString('base64') === dataString;

    const decoded = transactionDecoder.getTransactionMetadata({
      sender: senderAddress,
      receiver: receiverAddress,
      data: isBase64Encoded
        ? dataString
        : Buffer.from(dataString).toString('base64'),
      value,
    });

    const parsed = JSON.parse(
      JSON.stringify(
        decoded,
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
        2
      )
    );

    // Print parsed result to the console
    console.log('\nDecoded transaction metadata:\n');
    console.log(
      inspect(parsed, { showHidden: false, depth: null, colors: true })
    );
    console.log('\n');
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
