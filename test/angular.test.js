import { readConfigFile } from '../src/config.js';
import { readSource } from '../src/sourceCode.js';
import { validateLocaleKeysUsed } from '../src/locale.js';

describe('VUE Test', () => {
  test('Lines matching i18n filters', async () => {
    const expectedResult = [
      {
        fileName: 'angular-template-test.html:2',
        lineNumbers: [2],
        data: "{{ 'account.removeAccountReason' | translate }}",
        used: 0,
      },
      {
        fileName: 'angular-template-test.html:11',
        lineNumbers: [11],
        data: "{{ 'account.genderMale' | translate }}",
        used: 0,
      },
      {
        fileName: 'angular-typescript-test.ts:5',
        lineNumbers: [5],
        data:
          ".instant('share.title'),\n" +
          "        text: this.translate.instant('share.text'),\n" +
          '    })',
        used: 0,
      },
      {
        fileName: 'angular-typescript-test.ts:9',
        lineNumbers: [9],
        data: ".instant('parameter-string', { parameter })",
        used: 0,
      },
      {
        fileName: 'angular-typescript-test.ts:12',
        lineNumbers: [12],
        data:
          ".instant('account.friendRequestAcceptSuccess', {\n" +
          '        user: displayName\n' +
          '    })',
        used: 0,
      },
      {
        fileName: 'angular-typescript-test.ts:15',
        lineNumbers: [15],
        data: ".instant('account.friendRequestAcceptSuccess'))",
        used: 0,
      },
    ];

    let config = readConfigFile(
      './test/angular-test/i18n-cleaner.test.conf.json'
    );

    config.locales = ['./test/angular-test/src/i18n/en.json'];
    config.srcFolder = './test/angular-test/src';

    const linesMatchingI18nFilters = await readSource(config);

    expect(linesMatchingI18nFilters).toMatchObject(expectedResult);
  });

  test('Not used translation keys', async () => {
    const expectedResult = [
      { key: 'generic' },
      { key: 'options.option1' },
      { key: 'options.option2' },
      { key: 'options.option3' },
      { key: 'test.value' },
      { key: 'pages.home' },
    ];

    const expectedLines = [
      {
        fileName: 'angular-template-test.html:2',
        lineNumbers: [2],
        data: "{{ 'account.removeAccountReason' | translate }}",
        used: 0,
      },
      {
        fileName: 'angular-template-test.html:11',
        lineNumbers: [11],
        data: "{{ 'account.genderMale' | translate }}",
        used: 0,
      },
      {
        fileName: 'angular-typescript-test.ts:5',
        lineNumbers: [5],
        data:
          ".instant('share.title'),\n" +
          "        text: this.translate.instant('share.text'),\n" +
          '    })',
        used: 2,
      },
      {
        fileName: 'angular-typescript-test.ts:9',
        lineNumbers: [9],
        data: ".instant('parameter-string', { parameter })",
        used: 0,
      },
      {
        fileName: 'angular-typescript-test.ts:12',
        lineNumbers: [12],
        data:
          ".instant('account.friendRequestAcceptSuccess', {\n" +
          '        user: displayName\n' +
          '    })',
        used: 0,
      },
      {
        fileName: 'angular-typescript-test.ts:15',
        lineNumbers: [15],
        data: ".instant('account.friendRequestAcceptSuccess'))",
        used: 0,
      },
    ];

    let config = readConfigFile(
      './test/angular-test/i18n-cleaner.test.conf.json'
    );

    config.locales = ['./test/angular-test/src/i18n/en.json'];
    config.srcFolder = './test/angular-test/src';

    const linesMatchingI18nFilters = await readSource(config);

    const { unusedTranslationKeys, lines } = await validateLocaleKeysUsed(
      config.locales,
      linesMatchingI18nFilters
    );

    expect(unusedTranslationKeys).toMatchObject(expectedResult);
    expect(lines).toMatchObject(expectedLines);
  });
});
