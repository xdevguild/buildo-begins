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
  testnet:
    customConfig?.config?.customApi || 'https://testnet-api.multiversx.com',
  devnet:
    customConfig?.config?.customApi || 'https://devnet-api.multiversx.com',
  mainnet: customConfig?.config?.customApi || 'https://api.multiversx.com',
};

export const shortChainId: { [key: string]: string } = {
  testnet: 'T',
  devnet: 'D',
  mainnet: '1',
};

export const multiversxExplorer: { [key: string]: string } = {
  devnet: 'https://devnet-explorer.multiversx.com',
  testnet: 'https://testnet-explorer.multiversx.com',
  mainnet: 'https://explorer.multiversx.com',
};

export const esdtTokenProperties = [
  'canFreeze',
  'canWipe',
  'canPause',
  'canChangeOwner',
  'canUpgrade',
  'canAddSpecialRoles',
];

export const sftNftTokenProperties = [
  'canFreeze',
  'canWipe',
  'canPause',
  'canTransferNFTCreateRole',
  'canChangeOwner',
  'canUpgrade',
  'canAddSpecialRoles',
];

export const esdtTokenSpecialRoles = ['ESDTRoleLocalBurn', 'ESDTRoleLocalMint'];

export const sftTokenSpecialRoles = [
  'ESDTRoleNFTCreate',
  'ESDTRoleNFTBurn',
  'ESDTRoleNFTAddQuantity',
  'ESDTTransferRole',
];

export const nftTokenSpecialRoles = [
  'ESDTRoleNFTCreate',
  'ESDTRoleNFTBurn',
  'ESDTRoleNFTUpdateAttributes',
  'ESDTRoleNFTAddURI',
  'ESDTTransferRole',
];

// Build in address for tokens operations
export const builtInSC =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u';

// Predefined one time payment for token issuance (EGLD amount)
export const issueTokenPayment = '0.05';

export const commonOpertationsGasLimit = 60_000_000;
export const commonBuiltInOpertationsGasLimit = 6_000_000;
export const specialOpertationsGasLimit = 3_000_000;
