import dree from 'dree';
import fs from 'fs';

let i18nFiltersRx;

/**
 * Iterates over a branch of the file tree and checks which lines in the file
 * match the defined i18nFilters
 * @param branch Branch of tree of dree
 * @returns
 */
const parseFileTreeBranch = async (branch) => {
  let matchingFileLines = [];

  for (let i = 0; i < branch.children.length; i++) {
    const leaf = branch.children[i];
    if (leaf.children?.length > 0) {
      const matchedLines = await parseFileTreeBranch(leaf);
      matchingFileLines = matchingFileLines.concat(matchedLines);
    } else if (leaf.type === 'file') {
      if (leaf.name.includes('.test.js')) break;

      const matchedLines = await parseFile(leaf);
      matchingFileLines = matchingFileLines.concat(matchedLines);
    }
  }

  return matchingFileLines;
};

/**
 * Searches for a query in the text
 * @param text Total text to search in
 * @param query Query test to search for
 * @returns Linenumbers of matching query in text
 */
const getLineNumbersOfQueryInText = (text, query) => {
  const fileLines = text.split(/\r?\n/);
  const lineNumbersWithQuery = [];

  fileLines.forEach((line, i) => {
    if (!line.includes(query)) return;
    lineNumbersWithQuery.push(i + 1);
  });

  return lineNumbersWithQuery;
};

/**
 * Reads a file and checks all lines for lines matching the i18nFilters RegExes
 * @param file File object of dree
 * @returns lines matching the i18nFilters defined in the config
 */
const parseFile = async (file) => {
  const fileContents = fs.readFileSync(file.path).toString();
  const matchingFileLines = [];

  i18nFiltersRx.forEach((filterRx) => {
    const matches = fileContents.match(filterRx);

    if (!matches?.length) return;

    matches.forEach((match) => {
      const firstLineOfMatch = match.split(/\r?\n/)[0];

      const lineNumbers = getLineNumbersOfQueryInText(
        fileContents,
        firstLineOfMatch
      );

      if (lineNumbers.length === 0) return;

      matchingFileLines.push({
        fileName: `${file.name}:${lineNumbers.join(',')}`,
        lineNumbers: lineNumbers,
        data: match.trim(),
        used: 0,
      });
    });
  });

  return matchingFileLines;
};

/**
 * Reads the source code folder and parses all matching files defined in the config
 * @param config Config as Object
 * @returns lines matching the i18nFilters defined in the config
 */
export const readSource = async (config) => {
  const { srcFolder, extentions, i18nFilters } = config;

  i18nFiltersRx = i18nFilters.map((filter) => new RegExp(filter, 'gim'));

  const dreeOptions = {
    stat: false,
    hash: false,
    sizeInBytes: false,
    size: false,
    normalize: true,
    extensions: extentions,
  };

  const tree = dree.scan(srcFolder, dreeOptions);
  const linesMatchingI18nFilters = await parseFileTreeBranch(tree);

  return linesMatchingI18nFilters;
};
