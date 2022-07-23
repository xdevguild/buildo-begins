import prompts, { PromptObject } from 'prompts';
import { exit } from 'process';

import { Address, TokenPayment } from '@elrondnetwork/erdjs';
import BigNumber from 'bignumber.js';

enum ConverterType {
  BECH32_TO_HEX,
  HEX_TO_BECH32,
  DECIMAL_TO_HEXADECIMAL,
  HEXADECIMAL_TO_DECIMAL,
  DECIMAL_TO_BASE64,
  BASE64_TO_DECIMAL,
  AMOUNT_TO_DENOMINATED,
  DENOMINATED_TO_AMOUNT,
  STRING_TO_HEX,
  HEX_TO_STRING,
  STRING_TO_BASE64,
  BASE64_TO_STRING,
  HEX_STRING_TO_BASE64,
  BASE64_STRING_TO_HEX_STRING,
}

const promptQuestions: PromptObject[] = [
  {
    type: 'select',
    name: 'type',
    message: 'What do you want to do with the herotag?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      {
        title: 'Convert from Bech32 address to Hex address',
        value: ConverterType.BECH32_TO_HEX,
      },
      {
        title: 'Convert from Hex address to Bech32 address',
        value: ConverterType.HEX_TO_BECH32,
      },
      {
        title: 'Convert decimal to hexadecimal',
        value: ConverterType.DECIMAL_TO_HEXADECIMAL,
      },
      {
        title: 'Convert hexadecimal to decimal',
        value: ConverterType.HEXADECIMAL_TO_DECIMAL,
      },
      {
        title: 'Convert decimal to base64',
        value: ConverterType.DECIMAL_TO_BASE64,
      },
      {
        title: 'Convert base64 to decimal',
        value: ConverterType.BASE64_TO_DECIMAL,
      },
      {
        title: 'Convert EGLD amount to denominated amount',
        value: ConverterType.AMOUNT_TO_DENOMINATED,
      },
      {
        title: 'Convert EGLD denominated amount to amount',
        value: ConverterType.DENOMINATED_TO_AMOUNT,
      },
      {
        title: 'Convert string to hexadecimal encoded string',
        value: ConverterType.STRING_TO_HEX,
      },
      {
        title: 'Convert hexadecimal encoded string to string',
        value: ConverterType.HEX_TO_STRING,
      },
      {
        title: 'Convert string to base64',
        value: ConverterType.STRING_TO_BASE64,
      },
      {
        title: 'Convert base64 encoded string to string',
        value: ConverterType.BASE64_TO_STRING,
      },
      {
        title: 'Convert hex string to base64',
        value: ConverterType.HEX_STRING_TO_BASE64,
      },
      {
        title: 'Convert base64 encoded string to hex encoded string',
        value: ConverterType.BASE64_STRING_TO_HEX_STRING,
      },
    ],
  },
  {
    type: 'text',
    name: 'inputValue',
    message: 'Please provide the input value\n',
    validate: (value) => {
      if (!value) return 'Required!';
      return true;
    },
  },
];

const bech32ToHex = (inputValue: string) => {
  if (inputValue.length !== 62) {
    console.log("You've provided wrong bech32, try again.");
    exit(9);
  }
  const account = Address.fromBech32(inputValue);
  console.log('\nBech32 to Hex result:');
  console.log(`${account.hex()}\n`);
};

const hexToBech32 = (inputValue: string) => {
  if (inputValue.length !== 64) {
    console.log("You've provided wrong hex address, try again.");
    exit(9);
  }
  const account = Address.fromHex(inputValue);
  console.log('\nHex address to Bech32 result:');
  console.log(`${account.bech32()}\n`);
};

const decimalToHex = (inputValue: string) => {
  const bigNumberVal = new BigNumber(inputValue, 10);
  let bigNumberString = bigNumberVal.toString(16);
  if (bigNumberString.length % 2 !== 0) {
    bigNumberString = `0${bigNumberString}`;
  }
  console.log('\nDecimal to hex result:');
  console.log(`${bigNumberString}\n`);
};

const hexToDecimal = (inputValue: string) => {
  const bigNumber = new BigNumber(inputValue, 16);
  console.log('\nHex to decimal result:');
  console.log(`${bigNumber.toString(10)}\n`);
};

const decimalToBase64 = (inputValue: string) => {
  const buff = Buffer.from(inputValue, 'ascii');
  console.log('\nDecimal to base64 result:');
  console.log(`${buff.toString('base64')}\n`);
};

const base64ToDecimal = (inputValue: string) => {
  const buff = Buffer.from(inputValue, 'base64');
  console.log('\nBase64 to decimal result:');
  console.log(`${buff.toString('ascii')}\n`);
};

const amountToDenominated = (inputValue: string) => {
  const balance = TokenPayment.egldFromAmount(inputValue);
  console.log('\nEGLD amount to denominated amount result:');
  console.log(`${balance.toString()}\n`);
};

const denominatedToAmount = (inputValue: string) => {
  const balance = TokenPayment.egldFromBigInteger(inputValue);
  console.log('\nEGLD denominated amount to amount result:');
  console.log(`${balance.toPrettyString()}\n`);
};

const stringToHex = (inputValue: string) => {
  const hexString = Buffer.from(inputValue, 'ascii').toString('hex');
  console.log('\nString to hex result:');
  console.log(`${hexString}\n`);
};

const hexToString = (inputValue: string) => {
  const stringValue = Buffer.from(inputValue, 'hex').toString('utf8');
  console.log('\nHex to string result:');
  console.log(`${stringValue}\n`);
};

const stringToBase64 = (inputValue: string) => {
  const base64Value = Buffer.from(inputValue, 'ascii').toString('base64');
  console.log('\nString to base64 string result:');
  console.log(`${base64Value}\n`);
};

const base64ToString = (inputValue: string) => {
  const stringValue = Buffer.from(inputValue, 'base64').toString('ascii');
  console.log('\nString to base64 string result:');
  console.log(`${stringValue}\n`);
};

const hexToBase64 = (inputValue: string) => {
  const hexValue = Buffer.from(inputValue, 'hex');
  console.log('\nHex to base64 string result:');
  console.log(`${hexValue.toString('base64')}\n`);
};

const base64ToHex = (inputValue: string) => {
  const base64Value = Buffer.from(inputValue, 'base64');
  console.log('\nBase64 to hex string result:');
  console.log(`${base64Value.toString('hex')}\n`);
};

export const converters = async () => {
  const { type, inputValue } = await prompts(promptQuestions);

  if (typeof type === 'undefined' || !inputValue) {
    console.log('You have to provide the type of conversion and input!');
    exit(9);
  }

  switch (type) {
    case ConverterType.BECH32_TO_HEX:
      bech32ToHex(inputValue);
      break;
    case ConverterType.HEX_TO_BECH32:
      hexToBech32(inputValue);
      break;
    case ConverterType.DECIMAL_TO_HEXADECIMAL:
      decimalToHex(inputValue);
      break;
    case ConverterType.HEXADECIMAL_TO_DECIMAL:
      hexToDecimal(inputValue);
      break;
    case ConverterType.DECIMAL_TO_BASE64:
      decimalToBase64(inputValue);
      break;
    case ConverterType.BASE64_TO_DECIMAL:
      base64ToDecimal(inputValue);
      break;
    case ConverterType.AMOUNT_TO_DENOMINATED:
      amountToDenominated(inputValue);
      break;
    case ConverterType.DENOMINATED_TO_AMOUNT:
      denominatedToAmount(inputValue);
      break;
    case ConverterType.STRING_TO_HEX:
      stringToHex(inputValue);
      break;
    case ConverterType.HEX_TO_STRING:
      hexToString(inputValue);
      break;
    case ConverterType.STRING_TO_BASE64:
      stringToBase64(inputValue);
      break;
    case ConverterType.BASE64_TO_STRING:
      base64ToString(inputValue);
      break;
    case ConverterType.HEX_STRING_TO_BASE64:
      hexToBase64(inputValue);
      break;
    case ConverterType.BASE64_STRING_TO_HEX_STRING:
      base64ToHex(inputValue);
      break;
    default:
      break;
  }
};
