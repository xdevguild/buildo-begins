import fs from 'fs';
import { Mnemonic } from '@multiversx/sdk-wallet';
import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';

// Derive PEM file from seed
export const derivePem = async () => {
  const promptQuestion: PromptObject[] = [
    {
      type: 'text',
      name: 'seed',
      message: 'Please provide your seed phrase.',
      validate: (value) => (!value ? 'Required!' : true),
    },
  ];

  try {
    const { seed } = await prompts(promptQuestion);

    if (!seed) {
      console.log('You have to provide the seed phrase value!');
      exit();
    }

    const mnemonic = Mnemonic.fromString(seed);

    const buff = mnemonic.deriveKey();

    const secretKeyHex = buff.hex();
    const pubKeyHex = buff.generatePublicKey().hex();

    const combinedKeys = Buffer.from(secretKeyHex + pubKeyHex).toString(
      'base64'
    );

    const addressFromPubKey = buff.generatePublicKey().toAddress().bech32();

    const header = `-----BEGIN PRIVATE KEY for ${addressFromPubKey}-----`;
    const footer = `-----END PRIVATE KEY for ${addressFromPubKey}-----`;

    const content = `${header}\n${combinedKeys.replace(
      /([^\n]{1,64})/g,
      '$1\n'
    )}${footer}`;

    fs.writeFileSync('walletKey.pem', content);

    console.log('File saved as walletKey.pem');

    exit();
  } catch (e: any) {
    console.log(e.message);
    exit();
  }
};
