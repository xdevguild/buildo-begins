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
