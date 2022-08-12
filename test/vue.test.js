import { readConfigFile } from '../src/config.js';
import { readSource } from '../src/sourceCode.js';
import { validateLocaleKeysUsed } from '../src/locale.js';

describe('VUE Test', () => {
  test('Lines matching i18n filters', async () => {
    const expectedResult = [
      {
        fileName: 'button.vue:2',
        lineNumbers: [2],
        data: 't("generic.ok")',
        used: 0,
      },
      {
        fileName: 'home.vue:2',
        lineNumbers: [2],
        data: "t('generic.ok')",
        used: 0,
      },
      {
        fileName: 'home.vue:3',
        lineNumbers: [3],
        data: "t('generic.yes')",
        used: 0,
      },
      {
        fileName: 'home.vue:4',
        lineNumbers: [4],
        data: "t('test.label') }} {{ t('test.value')",
        used: 0,
      },
      {
        fileName: 'home.vue:6',
        lineNumbers: [6],
        data: `"t('user.name')`,
        used: 0,
      },
      {
        fileName: 'home.vue:24',
        lineNumbers: [24],
        data: "(t('logout-warning'))",
        used: 0,
      },
      {
        fileName: 'router.ts:7',
        lineNumbers: [7],
        data: "pageTitleTranslationKey: 'pages.home'",
        used: 0,
      },
      {
        fileName: 'router.ts:13',
        lineNumbers: [13],
        data: "pageTitleTranslationKey: 'pages.settings'",
        used: 0,
      },
    ];

    let config = readConfigFile('./test/vue-test/i18n-cleaner.test.conf.json');

    config.locales = ['./test/vue-test/src/i18n/en.json'];
    config.srcFolder = './test/vue-test/src';

    const linesMatchingI18nFilters = await readSource(config);

    expect(linesMatchingI18nFilters).toMatchObject(expectedResult);
  });

  test('Not used translation keys', async () => {
    const expectedResult = [
      { key: 'options.option1' },
      { key: 'options.option2' },
      { key: 'options.option3' },
    ];

    const expectedLines = [
      {
        fileName: 'button.vue:2',
        lineNumbers: [2],
        data: 't("generic.ok")',
        used: 1,
      },
      {
        fileName: 'home.vue:2',
        lineNumbers: [2],
        data: "t('generic.ok')",
        used: 1,
      },
      {
        fileName: 'home.vue:3',
        lineNumbers: [3],
        data: "t('generic.yes')",
        used: 1,
      },
      {
        fileName: 'home.vue:4',
        lineNumbers: [4],
        data: "t('test.label') }} {{ t('test.value')",
        used: 1,
      },
      {
        fileName: 'home.vue:6',
        lineNumbers: [6],
        data: `"t('user.name')`,
        used: 0,
      },
      {
        fileName: 'home.vue:24',
        lineNumbers: [24],
        data: "(t('logout-warning'))",
        used: 0,
      },
      {
        fileName: 'router.ts:7',
        lineNumbers: [7],
        data: "pageTitleTranslationKey: 'pages.home'",
        used: 1,
      },
      {
        fileName: 'router.ts:13',
        lineNumbers: [13],
        data: "pageTitleTranslationKey: 'pages.settings'",
        used: 0,
      },
    ];

    let config = readConfigFile('./test/vue-test/i18n-cleaner.test.conf.json');

    config.locales = ['./test/vue-test/src/i18n/en.json'];
    config.srcFolder = './test/vue-test/src';

    const linesMatchingI18nFilters = await readSource(config);

    const { unusedTranslationKeys, lines } = await validateLocaleKeysUsed(
      config.locales,
      linesMatchingI18nFilters
    );

    expect(unusedTranslationKeys).toMatchObject(expectedResult);
    expect(lines).toMatchObject(expectedLines);
  });
});
