import prompts, { PromptObject } from 'prompts';
import spawn from 'cross-spawn';
import { exit } from 'process';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { downloadUrls } from './config';

const directoryNameRegex =
  // eslint-disable-next-line no-control-regex
  /^[^\s^\x00-\x1f\\?*:"";<>|/.][^\x00-\x1f\\?*:"";<>|/]*[^\s^\x00-\x1f\\?*:"";<>|/.]+$/g;

/** For now it downloads smart contract example and Next.js dapp template */
const triggerDownloadAndExtract = async (
  dappDirectoryName: string,
  resourceUrl: string,
  isNextJSDapp: boolean
) => {
  try {
    const response = await axios.get(resourceUrl, {
      responseType: 'arraybuffer',
    });

    const dirPath = `${process.cwd()}/${dappDirectoryName}`;

    const zip = new AdmZip(response.data);
    const zipEntries = zip.getEntries();

    const mainDirInZipName = isNextJSDapp
      ? 'nextjs-dapp-template-main'
      : 'multiversx-simple-sc-master';

    zipEntries.forEach((entry) => {
      const entryName = entry.entryName;
      const flattenedEntryName = entryName.replace(mainDirInZipName, '');

      // If the entry is a directory, create it in the extraction directory
      if (entry.isDirectory) {
        const targetDir = path.join(dirPath, flattenedEntryName);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir);
        }
      } else {
        // If the entry is a file, extract it to the extraction directory
        const targetFilePath = path.join(dirPath, flattenedEntryName);
        fs.writeFileSync(targetFilePath, entry.getData());
      }
    });

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
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(
        `Can't download the ${resourceUrl} (${err.code}:${err.status})`
      );
    }
  }
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

    await triggerDownloadAndExtract(
      dappDirectoryName,
      downloadUrls[resourceType],
      isDappTemplate
    );
  } catch (e) {
    console.log((e as Error)?.message);
  }
};
