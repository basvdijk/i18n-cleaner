import { flattenJsonFile } from './json.js';

const unusedTranslationKeys = [];

/**
 * Checks which translation keys are not used in the source
 * @param locales Array with paths to locales files
 * @param lines Lines of code to validate
 * @returns Unused translation keys and lines with number of occurences
 */
export const validateLocaleKeysUsed = async (locales, lines) => {
  const flatJSON = await flattenJsonFile(locales[0]);

  for (const key in flatJSON) {
    if (!Object.hasOwnProperty.call(flatJSON, key)) continue;

    const searchString = key;

    let isKeyUsed;

    for (const line of lines) {
      const result = line.data.indexOf(searchString);

      if (result < 1) continue;

      line.used++;
      isKeyUsed = true;
    }

    if (isKeyUsed) continue;

    unusedTranslationKeys.push({
      key: searchString,
    });
  }

  return { unusedTranslationKeys, lines };
};

export const preprocessLocalesToCompare = async (locales) => {
  const localesToCompare = [];

  for (const locale of locales) {
    const flattenedJson = await flattenJsonFile(locale);
    localesToCompare.push({
      fileName: locale.split('/').pop(),
      flattenedJson,
    });
  }

  return localesToCompare;
};

export const checkMissingKeysBetweenLocaleFiles = async (locales) => {
  if (locales.length < 2) {
    return false;
  }

  const localesToCompare = await preprocessLocalesToCompare(locales);

  const mainLocale = localesToCompare[0];

  const missingKeysPerFile = {};

  // we skip the 0th because this is our main locale
  for (let i = 1; i < localesToCompare.length; i++) {
    const localeToCompare = localesToCompare[i];
    missingKeysPerFile[localeToCompare.fileName] = [];

    const localeKeysAsString = JSON.stringify(localeToCompare.flattenedJson);

    for (const key in mainLocale.flattenedJson) {
      if (!Object.hasOwnProperty.call(mainLocale.flattenedJson, key)) continue;

      if (localeKeysAsString.indexOf(key) === -1) {
        missingKeysPerFile[localeToCompare.fileName].push(key);
      }
    }
  }

  return missingKeysPerFile;
};
