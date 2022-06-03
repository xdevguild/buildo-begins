#!/usr/bin/env node

import { exit, argv } from 'process';
import packageJson from '../package.json';
import { derivePem } from './derive-pem';
import { sendEgld } from './send-egld';

const COMMANDS = {
  derivePem: 'derive-pem',
  sendEgld: 'send-egld',
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
  default:
    break;
}
