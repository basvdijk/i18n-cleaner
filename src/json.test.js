import { flattenJson, readJsonFile, flattenJsonFile } from './json.js';

describe('flattenJson()', () => {
  const testJson = {
    generic: 'ok',
    options: {
      option1: 'One',
      option2: 'Two',
      option3: 'Three',
    },
    test: {
      value: 'Interesting value',
    },
    pages: {
      home: 'Home',
    },
  };

  test('to be a function', () => {
    expect(typeof flattenJson).toBe('function');
  });

  test('correctly flatten json', () => {
    const json = { ...testJson };

    const result = {
      generic: 'ok',
      'options.option1': 'One',
      'options.option2': 'Two',
      'options.option3': 'Three',
      'test.value': 'Interesting value',
    };

    expect(flattenJson(json)).toMatchObject(result);
  });
});

describe('readJsonFile()', () => {
  test('to be a function', () => {
    expect(typeof readJsonFile).toBe('function');
  });

  test('correctly read a JSON file', () => {
    const json = {
      generic: 'ok',
      options: {
        option1: 'One',
        option2: 'Two',
        option3: 'Three',
      },
      pages: {
        home: 'Home',
      },
      test: {
        value: 'Interesting value',
      },
    };

    const fileContent = readJsonFile('./test/vue-test/src/i18n/en.json');

    expect(json).toMatchObject(fileContent);
  });
});

describe('flattenJsonFile()', () => {
  test('to be a function', () => {
    expect(typeof flattenJsonFile).toBe('function');
  });

  test('correctly flattens a JSON file', () => {
    const flattenJson = {
      generic: 'ok',
      'options.option1': 'One',
      'options.option2': 'Two',
      'options.option3': 'Three',
      'test.value': 'Interesting value',
    };

    const result = flattenJsonFile('./test/vue-test/src/i18n/en.json');

    expect(flattenJson).toMatchObject(result);
  });
});
