## Buildo Begins 👷

Meet Buildo. He is here to help you start creating in the Elrond blockchain ecosystem. Here is where everything begins.

> I'm going on an adventure!
> The road goes ever on and on.

### With what he will help you (not all is available yet!):

1. Deriving PEM files
2. Making transactions
3. Deploying smart contracts
4. Smart contracts interactions
5. Common API interactions and filtering
4. Sky is the limit...

### TODO

For now, the first version gives you basic stuff and an example of making the transaction. But there will be much more:

- examples for interaction with smart contracts,
- proper erdjs interactions,
- ABI usage,
- custom operations on API
- Gandalf's wizarding shit and stuff, you will be amazed for sure!

### How to work with Buildo:

1. Derive the pem from seed phrase: `buildo-begins derive-pem`
2. The walletKey.pem file will be created
3. Send some EGLD `buildo-begins send-egld`
4. You will get some prompts, fill up the required data
5. For now, that's it. There will be much more!

### Hot to use the config file?

Internally Buildo uses the config.ts file, but when you use it as a globally installed npm CLI tool, you don't have to touch that file. What you need to do is to create the `.buildobeginsrc` file, where you can change values (here default values):

```json
{
  "chain": "devnet",
  "customApi": "https://devnet-api.elrond.com"
}
```

### Development:

1. Clone the repo
2. Each change needs `npm run build`
3. You can link the lib locally by `npm link`
4. If you want to build your version, find all the `buildo-begins` names and replace them with yours.

### Real live examples that use a similar approach: 

- [elven-tools](https://github.com/juliancwirko/elven-tools-cli)
- [nft-art-maker](https://github.com/juliancwirko/nft-art-maker)
