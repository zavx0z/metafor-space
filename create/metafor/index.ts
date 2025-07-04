#!/usr/bin/env node

import prompts from 'prompts';
import chalk from 'chalk';

async function init() {
  console.log(chalk.blue(`
    Create MetaFor App
    -----------------
  `));

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Where would you like to create your app?',
      initial: 'my-metafor-app'
    },
    {
      type: 'select',
      name: 'template',
      message: 'Choose a template',
      choices: [
        { title: 'Basic', value: 'basic' },
        { title: 'TypeScript', value: 'typescript' }
      ]
    }
  ]);

  console.log(chalk.green('\nCreating your MetaFor app...'));
  console.log(`\nTemplate: ${response.template}`);
  console.log(`Directory: ${response.projectName}`);
}

init().catch((e) => {
  console.error(e);
  process.exit(1);
});