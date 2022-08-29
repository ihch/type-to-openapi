import * as fs from 'fs';
import * as path from 'path';

import * as prettier from 'prettier';

const commander = require('commander');

import { type2openapiSchemes } from './index';

const main = () => {
  commander.option('-o, --output <path>')

  const command = commander.parse(process.argv);
  const args = command.rawArgs;
  const outputPath = command.opts().output || 'schemes.json';

  const filePath = args[2];
  if (filePath == null) {
    console.error('File path is required.')
    process.exit(1);
  }

  const file = fs.readFileSync(path.resolve(filePath), { encoding: 'utf-8' });
  if (file == null) {
    console.log('No such file.', filePath);
    process.exit(1);
  }

  const openapiSchemes = type2openapiSchemes(file);
  const formattedSrc = prettier.format(openapiSchemes, { parser: 'json' });

  try {
    fs.writeFileSync(outputPath, formattedSrc);
    console.log(`Successfully generated to "${outputPath}"`);
  } catch (error) {
    console.error('Failed generating', error);
  }
}

export default main;
