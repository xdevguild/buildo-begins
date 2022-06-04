#!/usr/bin/env node

import { exit, argv } from 'process';
import packageJson from '../package.json';
import { derivePem } from './derive-pem';
import { sendEgld } from './send-egld';
import { sendEsdt } from './send-esdt';
import { sendMetaEsdt } from './send-meta-esdt';
import { sendNft } from './send-nft';
import { sendSft } from './send-sft';

const COMMANDS = {
  derivePem: 'derive-pem',
  sendEgld: 'send-egld',
  sendEsdt: 'send-esdt',
  sendNft: 'send-nft',
  sendSft: 'send-sft',
  sendMetaEsdt: 'send-meta-esdt',
};

const args = argv;
const command = args ? args[2] : undefined;

// Show version number
if (command === '--version' || command === '-v') {
  console.log(packageJson.version);
  exit();
}

if (!command || !Object.values(COMMANDS).includes(command)) {
  const availableCommands = Object.values(COMMANDS);
  console.log(
    `\nPlease provide a proper command. Available commands:\n\n${[
      ...availableCommands,
      '--version',
      '-v',
      '--help',
    ].join('\n')}\n`
  );
  exit(9);
}

switch (command) {
  case COMMANDS.derivePem:
    derivePem();
    break;
  case COMMANDS.sendEgld:
    sendEgld();
    break;
  case COMMANDS.sendEsdt:
    sendEsdt();
    break;
  case COMMANDS.sendNft:
    sendNft();
    break;
  case COMMANDS.sendSft:
    sendSft();
    break;
  case COMMANDS.sendMetaEsdt:
    sendMetaEsdt();
    break;
  default:
    break;
}
