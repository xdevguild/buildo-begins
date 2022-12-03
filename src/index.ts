#!/usr/bin/env node

import { exit, argv } from 'process';
import packageJson from '../package.json';

import { derivePem } from './derive-pem';
import { sendEsdt } from './esdt/send-esdt';
import { issueEsdt } from './esdt/issue-esdt';
import { mintBurnEsdt } from './esdt/mint-burn-esdt';
import { setSpecialRolesEsdt } from './esdt/set-special-roles-esdt';
import { sendEgld } from './egld/send-egld';
import { sendNft } from './nft/send-nft';
import { sendSft } from './sft/send-sft';
import { sendMetaEsdt } from './meta-esdt/send-meta-esdt';
import { herotag } from './herotag';
import { pauseUnpauseEsdt } from './esdt/pause-unpause';
import { freezeUnfreezeEsdt } from './esdt/freeze-unfreeze-esdt';
import { transferOwnershipEsdt } from './esdt/transfer-ownership-esdt';
import { wipeEsdt } from './esdt/wipe-esdt';
import { converters } from './converters';
import { issueSft } from './sft/issue-sft';
import { setSpecialRolesSft } from './sft/set-special-roles-sft';
import { createSft } from './sft/create-sft';
import { issueNft } from './nft/issue-nft';
import { setSpecialRolesNft } from './nft/set-special-roles-nft';
import { createNft } from './nft/create-nft';
import { claimDeveloperRewards } from './claim-dev-rewards';
import { changeOwnerAddress } from './change-owner-address';
import { issueMetaEsdt } from './meta-esdt/issue-meta-esdt';
import { setSpecialRolesMetaEsdt } from './meta-esdt/set-special-roles-meta-esdt';
import { createMetaEsdt } from './meta-esdt/create-meta-esdt';

const COMMANDS = {
  derivePem: 'derive-pem',
  herotag: 'herotag',
  converters: 'converters',
  claimDevRewards: 'claim-developer-rewards',
  changeOwnerAddress: 'change-owner-address',
  sendEgld: 'send-egld',
  sendEsdt: 'send-esdt',
  issueEsdt: 'issue-esdt',
  mintBurnEsdt: 'mint-burn-esdt',
  setSpecialRolesEsdt: 'set-special-roles-esdt',
  pauseUnpauseEsdt: 'pause-unpause-esdt',
  freezeUnfreezeEsdt: 'freeze-unfreeze-esdt',
  transferOwnershipEsdt: 'transfer-ownership-esdt',
  wipeEsdt: 'wipe-esdt',
  sendNft: 'send-nft',
  issueNft: 'issue-nft',
  setSpecialRolesNft: 'set-special-roles-nft',
  createNft: 'create-nft',
  sendSft: 'send-sft',
  issueSft: 'issue-sft',
  setSpecialRolesSft: 'set-special-roles-sft',
  createSft: 'create-sft',
  sendMetaEsdt: 'send-meta-esdt',
  issueMetaEsdt: 'issue-meta-esdt',
  setSpecialRolesMetaEsdt: 'set-special-roles-meta-esdt',
  createMetaEsdt: 'create-meta-esdt',
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
  case COMMANDS.issueEsdt:
    issueEsdt();
    break;
  case COMMANDS.mintBurnEsdt:
    mintBurnEsdt();
    break;
  case COMMANDS.setSpecialRolesEsdt:
    setSpecialRolesEsdt();
    break;
  case COMMANDS.herotag:
    herotag();
    break;
  case COMMANDS.pauseUnpauseEsdt:
    pauseUnpauseEsdt();
    break;
  case COMMANDS.freezeUnfreezeEsdt:
    freezeUnfreezeEsdt();
    break;
  case COMMANDS.transferOwnershipEsdt:
    transferOwnershipEsdt();
    break;
  case COMMANDS.wipeEsdt:
    wipeEsdt();
    break;
  case COMMANDS.converters:
    converters();
    break;
  case COMMANDS.issueSft:
    issueSft();
    break;
  case COMMANDS.setSpecialRolesSft:
    setSpecialRolesSft();
    break;
  case COMMANDS.createSft:
    createSft();
    break;
  case COMMANDS.issueNft:
    issueNft();
    break;
  case COMMANDS.setSpecialRolesNft:
    setSpecialRolesNft();
    break;
  case COMMANDS.createNft:
    createNft();
    break;
  case COMMANDS.claimDevRewards:
    claimDeveloperRewards();
    break;
  case COMMANDS.changeOwnerAddress:
    changeOwnerAddress();
    break;
  case COMMANDS.issueMetaEsdt:
    issueMetaEsdt();
    break;
  case COMMANDS.setSpecialRolesMetaEsdt:
    setSpecialRolesMetaEsdt();
    break;
  case COMMANDS.createMetaEsdt:
    createMetaEsdt();
    break;
  default:
    break;
}
