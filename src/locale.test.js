import {
  validateLocaleKeysUsed,
  preprocessLocalesToCompare,
  checkMissingKeysBetweenLocaleFiles,
} from './locale';

describe('preprocessLocalesToCompare()', () => {
  test('to be a function', () => {
    expect(typeof preprocessLocalesToCompare).toBe('function');
  });

  test('to return correct file content', async () => {
    const locales = [
      './test/vue-test/src/i18n/en.json',
      './test/vue-test/src/i18n/nl.json',
    ];

    const expectedResult = [
      {
        fileName: 'en.json',
        flattenedJson: {
          generic: 'ok',
          'options.option1': 'One',
          'options.option2': 'Two',
          'options.option3': 'Three',
          'test.value': 'Interesting value',
          'pages.home': 'Home',
        },
      },
      {
        fileName: 'nl.json',
        flattenedJson: {
          generic: 'ok',
          'options.option1': 'Een',
          'options.option2': 'Twee',
          'options.option3': 'Drie',
          'test.value': 'waarde',
        },
      },
    ];

    const result = await preprocessLocalesToCompare(locales);

    expect(result).toMatchObject(expectedResult);
  });
});

describe('checkMissingKeysBetweenLocaleFiles()', () => {
  test('to be a function', () => {
    expect(typeof checkMissingKeysBetweenLocaleFiles).toBe('function');
  });

  test('to return correct file content', async () => {
    const locales = [
      './test/vue-test/src/i18n/en.json',
      './test/vue-test/src/i18n/nl.json',
      './test/vue-test/src/i18n/de.json',
    ];

    const expectedResult = {
      'nl.json': ['pages.home'],
      'de.json': ['options.option2', 'pages.home'],
    };

    const result = await checkMissingKeysBetweenLocaleFiles(locales);

    expect(result).toMatchObject(expectedResult);
  });
});

describe('validateLocaleKeysUsed()', () => {
  test('to be a function', () => {
    expect(typeof validateLocaleKeysUsed).toBe('function');
  });

  test('correctly validates source lines', async () => {
    const linesData = [
      {
        fileName: 'button.vue',
        lineNumber: 2,
        data: '<button>{{ t("generic.ok") }}</button>',
        used: 0,
      },
      {
        fileName: 'home.vue',
        lineNumber: 2,
        data: "<p>{{ t('generic.ok') }}</p>",
        used: 0,
      },
      {
        fileName: 'home.vue',
        lineNumber: 3,
        data: "<p>{{ t('generic.yes') }}</p>",
        used: 0,
      },
      {
        fileName: 'home.vue',
        lineNumber: 4,
        data: "<p>{{ t('test.label') }} {{ t('test.value') }}</p>",
        used: 0,
      },
      {
        fileName: 'home.vue',
        lineNumber: 6,
        data: `<ListItem :label="t('user.name')" />`,
        used: 0,
      },
      {
        fileName: 'home.vue',
        lineNumber: 21,
        data: "alert(t('logout-warning'));",
        used: 0,
      },
    ];
    const locales = ['./test/vue-test/src/i18n/en.json'];

    const { unusedTranslationKeys, lines } = await validateLocaleKeysUsed(
      locales,
      linesData
    );

    const expectedResultLines = [
      {
        fileName: 'button.vue',
        lineNumber: 2,
        data: '<button>{{ t("generic.ok") }}</button>',
        used: 1,
      },
      {
        fileName: 'home.vue',
        lineNumber: 2,
        data: "<p>{{ t('generic.ok') }}</p>",
        used: 1,
      },
      {
        fileName: 'home.vue',
        lineNumber: 3,
        data: "<p>{{ t('generic.yes') }}</p>",
        used: 1,
      },
      {
        fileName: 'home.vue',
        lineNumber: 4,
        data: "<p>{{ t('test.label') }} {{ t('test.value') }}</p>",
        used: 1,
      },
      {
        fileName: 'home.vue',
        lineNumber: 6,
        data: `<ListItem :label="t('user.name')" />`,
        used: 0,
      },
      {
        fileName: 'home.vue',
        lineNumber: 21,
        data: "alert(t('logout-warning'));",
        used: 0,
      },
    ];

    const expectedResultunusedTranslationKeys = [
      { key: 'options.option1' },
      { key: 'options.option2' },
      { key: 'options.option3' },
      { key: 'pages.home' },
    ];

    expect(unusedTranslationKeys).toMatchObject(
      expectedResultunusedTranslationKeys
    );
    expect(lines).toMatchObject(expectedResultLines);
  });
});
