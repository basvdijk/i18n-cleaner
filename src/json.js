import fs from 'fs';

/**
 * Converts an object to its flatten version
 * {
 *    user: {
 *      name: 'John'
 *    },
 *    pages: {
 *      settings: {
 *          title: 'Settings',
 *          url: '/settings'
 *      }
 *    }
 * }
 *
 * becomes:
 * {
 *    user.name: 'John',
 *    pages.settings.title: 'Settings',
 *    pages.settings.url: '/settings'
 * }
 *
 * @param data Object with data to flatten
 * @see https://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
 * @returns the flattened version of the JSON object
 */
export const flattenJson = (data) => {
  var result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + '[' + i + ']');
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
};

/**
 * Reads a JSON file and returns it as an Object
 * @param file Path of JSON to read
 * @returns Object
 */
export const readJsonFile = (file) => {
  const fileContents = fs.readFileSync(file);
  const json = JSON.parse(fileContents.toString());
  return json;
};

/**
 * Reads a file and returns its content flattened
 * @see flattenJson
 * @param file Path to JSON file to flatten
 * @returns Object with flattened version of the file content
 */
export const flattenJsonFile = async (file) => {
  const fileContents = fs.readFileSync(file);
  const json = JSON.parse(fileContents.toString());

  return flattenJson(json);
};
