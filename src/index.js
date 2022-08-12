import { readConfigFile } from './config.js';
import { readSource } from './sourceCode.js';
import {
  validateLocaleKeysUsed,
  checkMissingKeysBetweenLocaleFiles,
} from './locale.js';
import chalk from 'chalk';

/**
 * Prints the unused translation keys as a table
 * @param unusedTranslateKeys Array of unused translation keys
 */
const unusedTranslationKeysReport = (unusedTranslateKeys) => {
  console.log(
    chalk.bgYellow(
      chalk.black(`\n NOT BEING USED IN SOURCE (${unusedTranslateKeys.length})`)
    )
  );
  unusedTranslateKeys.forEach((data) => {
    console.log(data.key);
  });

  console.log('');
};

/**
 * Prints the mising translate keys as table
 * @param lines Lines of code with translate keys
 */
const missingTranslationKeysReport = (lines) => {
  const missingKeys = lines.filter((line) => line.used === 0);
  const tableData = [];

  console.log(
    chalk.bgYellow(
      chalk.black(`\n MISSING IN LOCALE FILES (${missingKeys.length})\n`)
    )
  );
  missingKeys.forEach((line) => {
    tableData.push(line);
  });
  // console.table(tableData, ['fileName', 'data']);

  tableData.forEach((rowData) => {
    console.log(chalk.yellow(`${rowData.fileName} >>> missing in locale`));

    console.log(rowData.data);
    console.log('');
  });
};

/**
 * Prints the missing translation keys compared to the main locale
 * @param missingTranslationKeysPerLocaleFile Object with missing translation keys
 */
const missingTranslationKeysPerLocaleFileReport = (
  missingTranslationKeysPerLocaleFile
) => {
  for (const file in missingTranslationKeysPerLocaleFile) {
    const keys = missingTranslationKeysPerLocaleFile[file];

    console.log(
      chalk.bgYellow(chalk.black(`\n KEYS MISSING IN ${file} (${keys.length})`))
    );

    keys.forEach((data) => {
      console.log(data);
    });
  }

  console.log('');
};

/**
 * Validates the command line arguments and prints help when invalid
 * @returns True when the command line arguments are valid
 */
const validateCommandLineArguments = () => {
  const args = process.argv;

  if (args.length !== 3) {
    console.log(
      'invalid arguments. Usage: node ./src/index.js i18n-cleaner.conf.json'
    );
    return false;
  }

  return true;
};

const app = async () => {
  if (!validateCommandLineArguments()) return;

  const config = readConfigFile(process.argv[2]);
  const linesMatchingI18nFilters = await readSource(config);

  const { unusedTranslationKeys } = await validateLocaleKeysUsed(
    config.locales,
    linesMatchingI18nFilters
  );

  unusedTranslationKeysReport(unusedTranslationKeys);
  missingTranslationKeysReport(linesMatchingI18nFilters);

  const missingTranslationKeys = await checkMissingKeysBetweenLocaleFiles(
    config.locales
  );

  if (!missingTranslationKeys) {
    console.log(
      'No locales needed to compare. Please define more than one locale in the locales array of your config file'
    );
    return;
  }

  missingTranslationKeysPerLocaleFileReport(missingTranslationKeys);
};

app();
