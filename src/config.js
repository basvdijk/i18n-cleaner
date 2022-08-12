import { readJsonFile } from './json.js';

/**
 * Validates if the config JSON has the correct field, type and values
 * @param jsonConfigObject Config in JSON format
 * @errorMessage =s valid when no errors are found, error message otherwise
 */
export const isConfigFileJsonValid = (jsonConfigObject) => {
  const { extensions, i18nFilters, locales, localesFormat, srcFolder } = jsonConfigObject;

  let errorMessage;

  if (!extensions) errorMessage = 'extensions field missing in config';
  if (!extensions || extensions.length === 0)
    errorMessage = 'no extensions defined in config';
  if (typeof extensions !== 'object') errorMessage = 'extensions field is not an array';

  if (!i18nFilters) errorMessage = 'i18nFilters field missing in config';
  if (i18nFilters.length === 0) errorMessage = 'no i18nFilters defined in config';
  if (typeof i18nFilters !== 'object')
    errorMessage = 'i18nFilters field is not an array';

  if (!localesFormat) errorMessage = 'localesFormat field missing in config';
  if (typeof localesFormat !== 'string')
    errorMessage = 'localesFormat field is not a string';
  if (localesFormat !== 'json' && localesFormat !== 'yaml')
    errorMessage = 'localesFormat field is not "json" or "yaml"';

  if (!locales) errorMessage = 'locales field missing in config';
  if (locales.length === 0) errorMessage = 'no locales defined in config';
  if (typeof locales !== 'object') errorMessage = 'locales field is not an array';

  if (!srcFolder) errorMessage = 'srcFolder field missing in config';
  if (typeof srcFolder !== 'string') errorMessage = 'srcFolder field is not a string';

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return true;
  
};

/**
 * Reads the config file and validates the config file's content
 * @param file Path to config file
 * @errorMessage =s Config as JSON object
 */
export const readConfigFile = (file) => {
  const configJson = readJsonFile(file);

  try {
    const configFileValid = isConfigFileJsonValid(configJson);
    if (!configFileValid) {
      process.exit(-1);
    }
  } catch (e) {
    console.error(e);
  }

  return configJson;
  
};
