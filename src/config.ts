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

interface TokenPropertyOrRole {
  name: string;
  description: string;
}

export const esdtTokenProperties: TokenPropertyOrRole[] = [
  {
    name: 'canFreeze',
    description:
      'the token manager may freeze the token balance in a specific account, preventing transfers to and from that account',
  },
  {
    name: 'canWipe',
    description:
      'the token manager may wipe out the tokens held by a frozen account, reducing the supply',
  },
  {
    name: 'canPause',
    description:
      'the token manager may prevent all transactions of the token, apart from minting and burning',
  },
  {
    name: 'canChangeOwner',
    description: 'token management can be transferred to a different account',
  },
  {
    name: 'canUpgrade',
    description: 'the token manager may change these properties',
  },
  {
    name: 'canAddSpecialRoles',
    description: 'the token manager can assign a specific role(s)',
  },
  // TODO: not available yet
  // {
  //   name: 'canCreateMultiShard',
  //   description:
  //     'if true, then local mint/burn can be used so the token will be distributed among shards',
  // },
];

export const sftNftTokenProperties: TokenPropertyOrRole[] = [
  ...esdtTokenProperties,
  {
    name: 'canTransferNFTCreateRole',
    description: 'the token manager can transfer NFT/SFT/Meta creation role',
  },
];

const ESDTTransferRole = {
  name: 'ESDTTransferRole',
  description:
    'this role restricts transferability of the token only to the addresses that have the role set, while these addresses can send to any address',
};

const ESDTRoleNFTCreate = {
  name: 'ESDTRoleNFTCreate',
  description: 'this role allows one to create a new NFT/SFT/Meta',
};

const ESDTRoleNFTBurn = {
  name: 'ESDTRoleNFTBurn',
  description:
    'this role allows one to burn quantity of a specific NFT/SFT/Meta',
};

export const esdtTokenSpecialRoles: TokenPropertyOrRole[] = [
  {
    name: 'ESDTRoleLocalBurn',
    description: 'an address with this role can burn tokens',
  },
  {
    name: 'ESDTRoleLocalMint',
    description: 'an address with this role can mint new tokens',
  },
  ESDTTransferRole,
];

export const sftTokenSpecialRoles = [
  ESDTRoleNFTCreate,
  ESDTRoleNFTBurn,
  {
    name: 'ESDTRoleNFTAddQuantity',
    description: 'this role allows one to add quantity of a specific SFT',
  },
  ESDTTransferRole,
];

export const nftTokenSpecialRoles = [
  ESDTRoleNFTCreate,
  ESDTRoleNFTBurn,
  {
    name: 'ESDTRoleNFTUpdateAttributes',
    description:
      'this role allows one to change the attributes of a specific NFT',
  },
  {
    name: 'ESDTRoleNFTAddURI',
    description: 'this role allows one add URIs for a specific NFT',
  },
  ESDTTransferRole,
];

// Build in address for tokens operations
export const builtInSC =
  'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u';

// Predefined one time payment for token issuance (EGLD amount)
export const issueTokenPayment = '0.05';

export const commonOpertationsGasLimit = 60_000_000;
export const commonBuiltInOpertationsGasLimit = 6_000_000;
export const specialOpertationsGasLimit = 3_000_000;

// Resources to download (URLs)
export const downloadUrls: Record<string, string> = {
  nextJsDapp:
    'https://github.com/xdevguild/nextjs-dapp-template/archive/refs/heads/main.zip',
  piggyBankExampleSc:
    'https://github.com/xdevguild/multiversx-simple-sc/archive/refs/heads/master.zip',
};
