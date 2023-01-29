import prompts, { PromptObject } from 'prompts';
import spawn from 'cross-spawn';
import { exit } from 'process';
import { downloadUrls } from './config';
import { downloadAndExtract } from './utils';

const directoryNameRegex =
  // eslint-disable-next-line no-control-regex
  /^[^\s^\x00-\x1f\\?*:"";<>|/.][^\x00-\x1f\\?*:"";<>|/]*[^\s^\x00-\x1f\\?*:"";<>|/.]+$/g;

const triggerDownload = (
  dappDirectoryName: string,
  resourceUrl: string,
  isNextJSDapp: boolean
) => {
  downloadAndExtract(resourceUrl, `${process.cwd()}/${dappDirectoryName}`, {
    extract: true,
    strip: 1,
    filename: resourceUrl.split('/').slice(-1)[0],
  })
    .then(() => {
      if (isNextJSDapp) {
        process.chdir(dappDirectoryName);
        spawn.sync('npm', ['install'], { stdio: 'inherit' });
        spawn.sync('cp', ['.env.example', '.env.local'], { stdio: 'inherit' });
        process.chdir('..');
      }
      console.log('\n');
      console.log(
        isNextJSDapp
          ? `The NextJS Dapp template is initialized in the ${dappDirectoryName} directory. Npm dependencies installed. .env.example copied into .env.local - change the settings there.`
          : `The PiggyBank Smart Contract is initialized in ${dappDirectoryName}. You can now use VS Code and MultiversX IDE extension to configure your workspace and work with it. Check https://youtu.be/y0beoihLppA on how to start!`
      );
      console.log('\n');
    })
    .catch((err: any) => {
      if (err)
        console.log(
          `Can't download the ${resourceUrl} (${err.statusCode}:${err.statusMessage})`
        );
    });
};

export const init = async () => {
  const promptsQuestions: PromptObject[] = [
    {
      type: 'select',
      name: 'resourceType',
      message:
        'Please choose which resource you would like to download and initialize',
      choices: [
        {
          title: 'Piggy Bank Smart Contract example',
          description:
            'The simple MultiversX smart contract for learning purposes.',
          value: 'piggyBankExampleSc',
        },
        {
          title: 'NextJS Dapp template',
          description:
            'The MultiversX Dapp template built with NextJS, Chakra UI and MultiversX JS SDK',
          value: 'nextJsDapp',
        },
      ],
    },
    {
      type: 'text',
      name: 'dappDirectoryName',
      message:
        'Please provide the directory name. It will be created in the current location.',
      validate: (value) => {
        if (!value) return 'Required!';
        if (!new RegExp(directoryNameRegex).test(value)) {
          return 'Wrong format for the directory name!';
        }
        return true;
      },
    },
  ];

  try {
    const { dappDirectoryName, resourceType } = await prompts(promptsQuestions);

    if (!dappDirectoryName) {
      console.log('You have to provide the directory name!');
      exit(9);
    }

    const isDappTemplate = resourceType === 'nextJsDapp';

    triggerDownload(
      dappDirectoryName,
      downloadUrls[resourceType],
      isDappTemplate
    );
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
