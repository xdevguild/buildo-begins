## Buildo Begins 👷

Meet Buildo. He is here to help you start creating in the MultiversX blockchain ecosystem. Here is where everything begins.

> Buildo is a cool guy 👊 \
&mdash; Beniamin Mincu (@beniaminmincu) <a href="https://twitter.com/beniaminmincu/status/1532977949842059264?ref_src=twsrc%5Etfw">June 4, 2022</a></blockquote>

### Walkthrough videos

- sending tokens: https://youtu.be/NijTSZhswns
- issuing, minting and burning ESDT supply: https://youtu.be/_Jj0zCaATVU
- issuing and creating an SFTs: https://youtu.be/ozOYli4qQx4
- issuing and creating an NFTs: https://youtu.be/B4vahursgkQ
- issuing and creating Meta ESDTs: https://youtu.be/dsRswHhIteU
- creating and checking the herotag for wallet address without the xPortal App: https://youtu.be/nvda-zCffck
- data converters: https://youtu.be/soUq9eX9-0s
- storing data under an account as key-value pairs: https://youtu.be/gPVUkOgak1E
- init dapp and smart contract example: https://youtu.be/9J9sJ5kaCJc
- decode transaction: https://youtu.be/oxyIhUd5Yxo
- send multiple ESDTs (FT|NFT|SFT|META) in one transaction: https://youtu.be/6YvT5nHNB8U

### With what he will help you (not all is available yet!):

1. Deriving PEM files
2. All tokens-related operations (ESDTs (FT|NFT|SFT|META) issuing, sending, management)
3. Making transactions
4. Deploying smart contracts
5. Smart contracts interactions
6. Common API interactions and filtering

### How to work with Buildo:

1. Install globally `npm install buildo-begins -g` or you can also run commands with npx, for example `npx buildo-begins@latest issue-esdt`
2. Derive the pem from seed phrase: `buildo-begins derive-pem`
3. The walletKey.pem file will be created (**Be careful with this file when working with the mainnet. Please don't share it with anyone!**). (Other ways of signing, for example with hardware wallet are in plans)
4. Check the commands with `buildo-begins --help`
5. Use one of available commands, check them below.
5. You will get some prompts, fill up the required data (report [here](https://github.com/xdevguild/buildo-begins/issues) if prompts are not clear enough)

### Available commands for Buildo (there will be more):

**Not all commands are ready yet, but you will find a complete list of token operations at: [buildo.dev](https://www.buildo.dev)**

Each command will display a set of self-explanatory prompts. If there is something that needs more explanation please let me know about it [here](https://github.com/xdevguild/buildo-begins/issues).

#### General operations

- `buildo-begins derive-pem` - derive PEM file from seed phrase
- `buildo-begins init` - initialize the NextJS dapp template, Piggy Bank smart contract and dapp for learning purposes or Buildo.dev dapp
- `buildo-begins herotag` - create a herotag and assign it to address and check addresses of existing ones
- `buildo-begins converters` - a set of converters based on excellent [MultiversX (Elrond) Converters](http://207.244.241.38/elrond-converters/) but in the CLI, always at hand!
- `buildo-begins claim-developer-rewards` - Claim dev rewards from your smart contract. You have to use the owner's wallet address (PEM) when calling it
- `buildo-begins change-owner-address` - You can change the owner address of the smart contract you own
- `buildo-begins account-store` - A wallet owner can store key-value pairs by using the built-in function SaveKeyValue which receives any number of key-value pairs.
- `buildo-begins decode-transaction` - It uses [sdk-transaction-decoder](https://www.npmjs.com/package/@multiversx/sdk-transaction-decoder). It takes base64 encoded data, or data string.
- `buildo-begins multi-transfer` - You can transfer multiple ESDTs at once (FT, NFT, SFT, meta)

#### FT ESDT (fungible tokens) operations

To create fungible ESDT keep the order of operations: `issue-esdt` -> `set-special-roles-esdt`

- `buildo-begins issue-esdt` - issue new ESDT token
- `buildo-begins set-special-roles-esdt` - set special ESDT roles
- `buildo-begins unset-special-roles-esdt` - unset special ESDT roles
- `buildo-begins mint-burn-esdt` - mint/burn the ESDT token supply (requires `ESDTRoleLocalBurn`, `ESDTRoleLocalMint` roles)
- `buildo-begins pause-unpause-esdt` - pause/unpause all transactions of the token (requires `canPause` role)
- `buildo-begins freeze-unfreeze-esdt` - freeze/unfreeze the token balance in a specific account, preventing transfers to and from that account (requires `canFreeze` role)
- `buildo-begins wipe-esdt` - wipe out the tokens held by a previously frozen account, reducing the supply (Wiping the tokens of an Account is an operation designed to help token managers to comply with regulations.)
- `buildo-begins transfer-ownership-esdt` - The manager of an ESDT token may transfer the management rights to another Account. This operation requires that the `canChangeOwner` is set to true.
- `buildo-begins change-properties-esdt` - change ESDT token properties added when issuing the token, the `canUpgrade` property has to be previously assigned
- `buildo-begins send-esdt` - send ESDT tokens

#### NFT ESDT operations (will be more...)

To create NFTs keep the order of operations: `issue-nft` -> `set-special-roles-nft` -> `create-nft`

- `buildo-begins issue-nft` - issue a new NFT collection
- `buildo-begins set-special-roles-nft` - set special roles for NFT
- `buildo-begins unset-special-roles-nft` - unset special roles for NFT
- `buildo-begins create-nft` - create a new NFT, assets, attributes, etc.
- `buildo-begins change-properties-nft` - change NFT token properties added when issuing the token, the `canUpgrade` property has to be previously assigned
- `buildo-begins send-nft` - send NFT token

#### SFT ESDT operations (will be more...)

To create SFTs keep the order of operations: `issue-sft` -> `set-special-roles-sft` -> `create-sft`

- `buildo-begins issue-sft` - issue a new SFT collection
- `buildo-begins set-special-roles-sft` - set special roles for SFT
- `buildo-begins unset-special-roles-sft` - unset special roles for SFT
- `buildo-begins create-sft` - create a new SFT with initial quantity, assets, attributes, etc.
- `buildo-begins change-properties-sft` - change SFT token properties added when issuing the token, the `canUpgrade` property has to be previously assigned
- `buildo-begins send-sft` - send SFT tokens

#### Meta ESDT operations (will be more...)

To create Meta ESDTs keep the order of operations: `issue-meta-esdt` -> `set-special-roles-meta-esdt` -> `create-meta-esdt`

- `buildo-begins issue-meta-esdt` - issue a new Meta ESDT collection
- `buildo-begins set-special-roles-meta-esdt` - set special roles for Meta ESDT
- `buildo-begins unset-special-roles-meta-esdt` - unset special roles for Meta ESDT
- `buildo-begins create-meta-esdt` - create a new Meta ESDT, assets, attributes, etc.
- `buildo-begins change-properties-meta-esdt` - change Meta ESDT token properties added when issuing the token, the `canUpgrade` property has to be previously assigned
- `buildo-begins send-meta-esdt` - send Meta ESDT tokens

Meta ESDTs are usually managed and used through smart contracts, but here you can issue, create and also set optional attributes as strings.

#### EGLD operations (will be more...)

- `buildo-begins send-egld` - send EGLD tokens

### How to use the config file?

Internally Buildo uses the config.ts file, but when you use it as a globally installed npm CLI tool, you don't have to touch that file. What you need to do is to create the `.buildobeginsrc` file, where you can change values (here are default values):

```json
{
  "chain": "devnet",
  "customApi": "https://devnet-api.multiversx.com"
}
```

### TODO

For now, the first version gives you basic stuff. But there will be much more:

- examples for interaction with smart contracts,
- proper JS SDK interactions,
- ABI usage,
- custom operations on API
- Gandalf's wizarding shit and stuff, you will be amazed for sure!

### Development:

1. Clone the repo
2. Each change needs `npm run build`
3. You can link the lib locally by `npm link`
4. If you want to build your version, find all the `buildo-begins` names and replace them with yours.

The Buildo tool is supposed to be not only a tool/product but also the source code for learning purposes and further derived tools.

The code is structured into directories based on the token type. The general-purpose functionality is in the root directory. 
Each Typescript file is a separate functionality. Some of them have to be triggered in proper order, like when issuing the token.

For now, some of the code is copied across token directories, and some functionality is almost the same for some token types. This is done for a purpose, to keep the logic for one token in one place and give the possibility for other developers to copy parts of the code without thinking much about what is where. It is also to make the learning path simpler. It may change in the future.

### Other tools:

- [buildo.dev](https://www.buildo.dev) - Buildo.dev is a MultiversX app that helps with blockchain interactions, like issuing tokens and querying smart contracts.
- [elven.js](https://www.elvenjs.com) - Authenticate, sign, and send transactions on the MultiversX blockchain in the browser. No need for bundlers, frameworks, etc. Just import from the static script source, and you are ready to go. One static file to rule it all on the MultiversX blockchain!
- [Elven Tools](https://www.elven.tools) - The PFP NFT toolset: NFT minter smart contract (decentralized way of minting), minter Nextjs dapp (interaction on the frontend side), CLI tool (deploy, configuration, interaction).
- [Next.js Dapp Template](https://github.com/xdevguild/nextjs-dapp-template) - general purpose Next.js dapp template for interacting with MultiversX blockchain
