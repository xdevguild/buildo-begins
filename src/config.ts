import { cosmiconfigSync } from 'cosmiconfig';
import { cwd } from 'process';

// You can change the name of the config file here
const explorerSync = cosmiconfigSync('buildobegins');
const customConfig = explorerSync.search(cwd());

// Chain to be used (local, devnet, testnet, mainnet)
export const chain = customConfig?.config?.chain || 'devnet';

// Default will be devnet, based on chain value, if the local is chosen you can change the proxy host
export const publicApi: { [key: string]: string } = {
  local: customConfig?.config?.customApi || 'http://localhost:7950',
  testnet: customConfig?.config?.customApi || 'https://testnet-api.elrond.com',
  devnet: customConfig?.config?.customApi || 'https://devnet-api.elrond.com',
  mainnet: customConfig?.config?.customApi || 'https://api.elrond.com',
};

export const shortChainId: { [key: string]: string } = {
  testnet: 'T',
  devnet: 'D',
  mainnet: '1',
};

export const elrondExplorer: { [key: string]: string } = {
  devnet: 'https://devnet-explorer.elrond.com',
  testnet: 'https://testnet-explorer.elrond.com',
  mainnet: 'https://explorer.elrond.com',
};

export const esdtTokenProperties = [
  'canFreeze',
  'canWipe',
  'canPause',
  'canMint',
  'canBurn',
  'canChangeOwner',
  'canUpgrade',
  'canAddSpecialRoles',
];

export const esdtTokenSpecialRoles = ['ESDTRoleLocalBurn', 'ESDTRoleLocalMint'];

// Build in address for token issuance
export const builtInEsdtSC =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u';

// Predefined one time payment for token issuance (EGLD amount)
export const issueTokenPayment = '0.05';

export const esdtOpertationsGasLimit = 60000000;
export const esdtLocalOpertationsGasLimit = 300000;
