### [0.12.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.12.0) (2023-04-23)
- update dependencies including `sdk-core` and `sdk-wallet`
- code ajustments because of changes in core dependencies

### [0.11.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.11.0) (2023-02-04)
- added `ESDTTransferRole` for ESDT (fungible)
- dependencies update
- descriptions for token properties and special roles selectors

### [0.10.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.10.0) (2023-01-29)
- new `buildo-begins init` functionality. For now, it lets to initialize an example smart contract and NextJS dapp template. There will be more in the future.
- dependencies updates

### [0.9.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.9.0) (2023-01-14)
- rebrand to multiversx (continuation)
    - npm packages are replaced
    -public api/explorer endpoints are replaced
- update dependencies

### [0.8.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.8.0) (2023-01-07)
- added 
  - `buildo-begins unset-special-roles-esdt`
  - `buildo-begins unset-special-roles-sft`
  - `buildo-begins unset-special-roles-nft`
  - `buildo-begins unset-special-roles-meta-esdt`
  - `buildo-begins change-properties-esdt`
  - `buildo-begins change-properties-sft`
  - `buildo-begins change-properties-nft`
  - `buildo-begins change-properties-meta-esdt`
- removed deprecated ESDT properties: `canMint` and `canBurn`, these are replaced with special roles `ESDTRoleLocalMint` and `ESDTRoleLocalBurn`
- better display of the commands when using `--help` flag

### [0.7.2](https://github.com/xdevguild/buildo-begins/releases/tag/v0.7.2) (2022-12-17)
- adjust gas limit calculation for the `buildo-begins account-store`

### [0.7.1](https://github.com/xdevguild/buildo-begins/releases/tag/v0.7.1) (2022-12-11)
- added `buildo-begins account-store` (Account storage) - you can now save custom data under an account as key-value pairs
- updated dependencies

### [0.7.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.7.0) (2022-12-02)
- added some of the Meta ESDT operations (issue, roles, create), more soon
- updated dependencies

### [0.6.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.6.0) (2022-11-01)
- added some of the NFT operations (issue, roles, create), more soon
- updated dependencies (erdjs etc.)

### [0.5.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.5.0) (2022-10-02)
- added `buildo-begins claim-developer-rewards` - Claim dev rewards from your smart contract. You have to use the owner's wallet address (PEM) when calling it
- added `buildo-begins change-owner-address` - You can change the owner address of the smart contract you own
- bump versions for erdjs related dependencies and dev dependencies

### [0.4.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.4.0) (2022-08-31)
- added some of the SFT operations (issue, roles, create), more soon
- updated dependencies (erdjs etc.)
- MIT license

### [0.3.2](https://github.com/xdevguild/buildo-begins/releases/tag/v0.3.2) (2022-08-24)
- added ESDT `transferOwnership` - thanks to @waqasideofuzion 

### [0.3.1](https://github.com/xdevguild/buildo-begins/releases/tag/v0.3.1) (2022-07-24)
- fix misleading label for `buildo-begins converters`

### [0.3.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.3.0) (2022-07-23)
- added `buildo-begins converters` - a s et of Elrond converters based on http://207.244.241.38/elrond-converters/

### [0.2.2](https://github.com/xdevguild/buildo-begins/releases/tag/v0.2.2) (2022-07-08)
- added `buildo-begins wipe-esdt` - a command for wipe out the tokens held by a previously frozen account, reducing the supply (Wiping the tokens of an Account is an operation designed to help token managers to comply with regulations.)

### [0.2.1](https://github.com/xdevguild/buildo-begins/releases/tag/v0.2.1) (2022-06-20)
- added `buildo-begins pause-unpause-esdt` - a command for pause or unpause all transactions of the token (of course you need `canPause` role on such ESDT)
- added `buildo-begins freeze-unfreeze-esdt` - a command to freeze/unfreeze the token balance in a specific account, preventing transfers to and from that account (of course you need `canFreeze` role on such ESDT)

### [0.2.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.2.0) (2022-06-16)
- added `buildo-begins herotag` - a command for creating Elrond herotag (dns) and checking the address of the existing one

### [0.1.0](https://github.com/xdevguild/buildo-begins/releases/tag/v0.1.0) (2022-06-12)
- added `buildo-begins issue-esdt` command for issuing new ESDT tokens
- added `buildo-begins set-special-roles-esdt` command for setting and unsetting special ESDT roles - local mint, and local burn
- added `buildo-begins mint-burn-esdt` command for minting or burning ESDT token supply (requires special roles from the command above)
- more operations on ESDT soon. Stay tuned!

### [0.0.3](https://github.com/xdevguild/buildo-begins/releases/tag/v0.0.3) (2022-06-04)
- added `buildo-begins send-esdt` command for sending ESDT tokens
- added `buildo-begins send-nft` command for sending NFT tokens
- added `buildo-begins send-sft` command for sending SFT tokens
- added `buildo-begins send-meta-esdt` command for sending Meta ESDT tokens

### [0.0.2](https://github.com/xdevguild/buildo-begins/releases/tag/v0.0.2) (2022-06-04)
- initial functionality and configuration
- added `buildo-begins derive-pem` command for deriving the PEM file, it is then used for all transactions, and it is automatically detected when located in the same directory
- added `buildo-begins send-egld` command for sending EGLD tokens
