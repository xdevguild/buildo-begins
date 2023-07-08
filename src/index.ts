#!/usr/bin/env node

import { exit, argv } from 'process';
import chalk from 'chalk';
import packageJson from '../package.json';

import { derivePem } from './derive-pem';
import { init } from './init';
import { sendEsdt } from './esdt/send-esdt';
import { issueEsdt } from './esdt/issue-esdt';
import { mintBurnEsdt } from './esdt/mint-burn-esdt';
import { toggleSpecialRolesEsdt } from './esdt/toggle-special-roles-esdt';
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
import { toggleSpecialRolesSft } from './sft/toggle-special-roles-sft';
import { createSft } from './sft/create-sft';
import { issueNft } from './nft/issue-nft';
import { toggleSpecialRolesNft } from './nft/toggle-special-roles-nft';
import { createNft } from './nft/create-nft';
import { claimDeveloperRewards } from './claim-dev-rewards';
import { changeOwnerAddress } from './change-owner-address';
import { issueMetaEsdt } from './meta-esdt/issue-meta-esdt';
import { toggleSpecialRolesMetaEsdt } from './meta-esdt/toggle-special-roles-meta-esdt';
import { createMetaEsdt } from './meta-esdt/create-meta-esdt';
import { accountStore } from './account-store';
import { changePropertiesEsdt } from './esdt/change-properties-esdt';
import { changePropertiesNft } from './nft/change-properties-nft';
import { changePropertiesSft } from './sft/change-properties-sft';
import { changePropertiesMetaEsdt } from './meta-esdt/change-properties-meta-esdt';
import { decodeTransaction } from './decode-transaction';
import { multiTransfer } from './multi-transfer';

interface CommandData {
  name: string;
  fn: () => Promise<void>;
  description: string;
}

const commands: Record<string, CommandData[]> = {
  general: [
    {
      name: 'derive-pem',
      fn: derivePem,
      description: 'Derive PEM file from seed phrase',
    },
    {
      name: 'init',
      fn: init,
      description:
        'Initialize project (it can be dapp, example smart contract etc.)',
    },
    {
      name: 'herotag',
      fn: herotag,
      description:
        'Create a herotag and assign it to addres and check addresses of existing ones',
    },
    {
      name: 'converters',
      fn: converters,
      description: 'A set of data converters.',
    },
    {
      name: 'claim-developer-rewards',
      fn: claimDeveloperRewards,
      description:
        "Claim dev rewards from your smart contract. You have to use the owner's wallet address (PEM) when calling it",
    },
    {
      name: 'change-owner-address',
      fn: changeOwnerAddress,
      description:
        'You can change the owner address of the smart contract you own',
    },
    {
      name: 'account-store',
      fn: accountStore,
      description:
        'A wallet owner can store key-value pairs by using the built-in function SaveKeyValue which receives any number of key-value pairs.',
    },
    {
      name: 'decode-transaction',
      fn: decodeTransaction,
      description:
        'You can decode the transaction data by providing a base64 encoded string or just the transaction data string. Plus you will need to provide the sender, receiver, and in case of EGLD transfer also value.',
    },
    {
      name: 'multi-transfer',
      fn: multiTransfer,
      description:
        'Send multiple ESDTs (fungible, NFT, SFT, Meta) with one transaction',
    },
  ],
  egld: [
    {
      name: 'send-egld',
      fn: sendEgld,
      description: 'Send EGLD tokens',
    },
  ],
  esdt: [
    {
      name: 'issue-esdt',
      fn: issueEsdt,
      description: 'Issue new ESDT token',
    },
    {
      name: 'set-special-roles-esdt',
      fn: () => toggleSpecialRolesEsdt('set'),
      description: 'Set special ESDT roles',
    },
    {
      name: 'unset-special-roles-esdt',
      fn: () => toggleSpecialRolesEsdt('unset'),
      description: 'Unset special ESDT roles',
    },
    {
      name: 'mint-burn-esdt',
      fn: mintBurnEsdt,
      description:
        "Mint or Burn the ESDT token supply (requires 'ESDTRoleLocalBurn', 'ESDTRoleLocalMint' roles)",
    },
    {
      name: 'pause-unpause-esdt',
      fn: pauseUnpauseEsdt,
      description:
        "Pause or unpause all transactions of the token (requires 'canPause' role)",
    },
    {
      name: 'freeze-unfreeze-esdt',
      fn: freezeUnfreezeEsdt,
      description:
        "Freeze or unfreeze the token balance in a specific account, preventing transfers to and from that account (requires 'canFreeze' role)",
    },
    {
      name: 'wipe-esdt',
      fn: wipeEsdt,
      description:
        'Wipe out the tokens held by a previously frozen account, reducing the supply (Wiping the tokens of an Account is an operation designed to help token managers to comply with regulations.)',
    },
    {
      name: 'transfer-ownership-esdt',
      fn: transferOwnershipEsdt,
      description:
        "The manager of an ESDT token may transfer the management rights to another Account. This operation requires that the 'canChangeOwner' is set to true.",
    },
    {
      name: 'change-properties-esdt',
      fn: changePropertiesEsdt,
      description:
        "Change ESDT token properties added when issuing the token, the 'canUpgrade' property has to be previously assigned",
    },
    {
      name: 'send-esdt',
      fn: sendEsdt,
      description: 'Send ESDT tokens',
    },
  ],
  sft: [
    {
      name: 'issue-sft',
      fn: issueSft,
      description: 'Issue a new SFT collection',
    },
    {
      name: 'set-special-roles-sft',
      fn: () => toggleSpecialRolesSft('set'),
      description: 'Set special roles for SFT',
    },
    {
      name: 'unset-special-roles-sft',
      fn: () => toggleSpecialRolesSft('unset'),
      description: 'Unset special roles for SFT',
    },
    {
      name: 'create-sft',
      fn: createSft,
      description:
        'Create a new SFT with initial quantity, assets, attributes, etc.',
    },
    {
      name: 'change-properties-sft',
      fn: changePropertiesSft,
      description:
        "Change SFT token properties added when issuing the token, the 'canUpgrade' property has to be previously assigned",
    },
    {
      name: 'send-sft',
      fn: sendSft,
      description: 'Send SFT tokens',
    },
  ],
  nft: [
    {
      name: 'issue-nft',
      fn: issueNft,
      description: 'Issue a new NFT collection',
    },
    {
      name: 'set-special-roles-nft',
      fn: () => toggleSpecialRolesNft('set'),
      description: 'Set special roles for NFT',
    },
    {
      name: 'unset-special-roles-nft',
      fn: () => toggleSpecialRolesNft('unset'),
      description: 'Unset special roles for NFT',
    },
    {
      name: 'create-nft',
      fn: createNft,
      description: 'Create a new NFT with assets, attributes, etc.',
    },
    {
      name: 'change-properties-nft',
      fn: changePropertiesNft,
      description:
        "Change NFT token properties added when issuing the token, the 'canUpgrade' property has to be previously assigned",
    },
    {
      name: 'send-nft',
      fn: sendNft,
      description: 'Send NFT tokens',
    },
  ],
  metaEsdt: [
    {
      name: 'issue-meta-esdt',
      fn: issueMetaEsdt,
      description: 'Issue a new Meta ESDT collection',
    },
    {
      name: 'set-special-roles-meta-esdt',
      fn: () => toggleSpecialRolesMetaEsdt('set'),
      description: 'Set special roles for Meta ESDT',
    },
    {
      name: 'unset-special-roles-meta-esdt',
      fn: () => toggleSpecialRolesMetaEsdt('unset'),
      description: 'Unset special roles for Meta ESDT',
    },
    {
      name: 'create-meta-esdt',
      fn: createMetaEsdt,
      description:
        'Create a new Meta ESDT with initial quantity, assets, attributes, etc.',
    },
    {
      name: 'change-properties-meta-esdt',
      fn: changePropertiesMetaEsdt,
      description:
        "Change Meta ESDT token properties added when issuing the token, the 'canUpgrade' property has to be previously assigned",
    },
    {
      name: 'send-meta-esdt',
      fn: sendMetaEsdt,
      description: 'Send Meta ESDT tokens',
    },
  ],
};

const flatCommandsCollection = Object.values(commands).flat();

const findCommandData = (
  commandsCollection: CommandData[],
  command: string
) => {
  return commandsCollection.find((item) => item.name === command);
};

const args = argv;
const command = args ? args[2] : undefined;

// Show version number
if (command === '--version' || command === '-v') {
  console.log(packageJson.version);
  exit();
}

// Show the list of commands
if (
  !command ||
  ['--help', '-h'].includes(command) ||
  !findCommandData(flatCommandsCollection, command)
) {
  const sections = Object.keys(commands);

  let availableCommands = '';

  for (const section of sections) {
    availableCommands =
      availableCommands +
      chalk.underline(
        `${
          section.charAt(0).toUpperCase() + section.slice(1)
        } operations (example: buildo-begins ${chalk.bold(
          commands[section][0].name
        )})`
      ) +
      '\n\n';

    for (const cmd of commands[section]) {
      availableCommands =
        availableCommands + `${chalk.blue(cmd.name)}\n  ${cmd.description}\n\n`;
    }
  }

  availableCommands =
    availableCommands +
    `${chalk.underline(
      `Check version and list commands (example: buildo-begins ${chalk.bold(
        '--version'
      )})`
    )}\n\n${chalk.blue('--version (-v)\n--help (-h)')}`;

  console.log(
    `\n${chalk.bold(
      'Please provide a proper command. Available commands:'
    )}\n\n${availableCommands}\n\n${chalk.bold(
      'Please provide a proper command from the list above!\n'
    )}`
  );
  exit(9);
}

// Trigger command
findCommandData(flatCommandsCollection, command)?.fn();
