import { isConfigFileJsonValid, readConfigFile } from './config.js';

describe('isConfigFileJsonValid()', () => {
  const defaultValidConfig = {
    extensions: ['vue', 'ts'],
    i18nFilters: [
      '(\\ |"|\\()t\\(["\'](.*)["\'](.*)\\)',
      'pageTitleTranslationKey:(.*)\\"',
    ],
    locales: ['./src/i18n/nl.json'],
    localesFormat: 'json',
    srcFolder: './src',
  };

  test('to be a function', () => {
    expect(typeof isConfigFileJsonValid).toBe('function');
  });

  test('extensions config field empty string', () => {
    const testConfig = { ...defaultValidConfig };
    testConfig.extensions = null;
    expect(() => {
      isConfigFileJsonValid(testConfig);
    }).toThrow('no extensions defined in config');
  });

  test('extensions config field empty array', () => {
    const testConfig = { ...defaultValidConfig };
    testConfig.extensions = [];
    expect(() => {
      isConfigFileJsonValid(testConfig);
    }).toThrow('no extensions defined in config');
  });

  test('extensions config field string', () => {
    const testConfig = { ...defaultValidConfig };
    testConfig.extensions = 'vue';
    expect(() => {
      isConfigFileJsonValid(testConfig);
    }).toThrow('extensions field is not an array');
  });
});

describe('readConfigFile()', () => {
  test('to be a function', () => {
    expect(typeof readConfigFile).toBe('function');
  });

  test('reads config file correctly', () => {
    const result = readConfigFile('./test/i18n-cleaner.conf.valid.conf.json');

    const fileContents = {
      extensions: ['vue', 'ts'],
      i18nFilters: [
        `(\\ |"|\\()t\\(["'](.*)["'](.*)\\)`,
        'pageTitleTranslationKey:(.*)[\\"\']',
      ],
      locales: ['./src/i18n/en.json'],
      localesFormat: 'json',
      srcFolder: './src',
    };

    expect(fileContents).toMatchObject(result);
  });
});
