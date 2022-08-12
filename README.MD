# i18n Cleaner

Checks for missing translations in your source code, and unused translations in your locale JSON files.

If your website or application supports multiple languages you probably use a library to manage these translations like: 
- [VUE I18n](https://vue-i18n.intlify.dev/) for VUE
- [ngx-translate](https://github.com/ngx-translate/core) for Angular

Over time the locale JSON files contain keys which are not used anymore and the source contains keys which are missing in the translation files.

This project helps to detect:
- If a translation key used in the source code is missing 
- If a translation key in the JSON file is not used in the code

And reports them in your console.

## Acknowlegements
Special thanks to [@christiaanvaneijk](https://github.com/christiaanvaneijk) for reviewing my code!

## Todo
There is still some work I might implement some day:
- Check for differences between the JSON locale files.

## Example projects
The `test` folder contains example projects where some translations are missing. 

Currently there are two example projects:
- VUE `npm run example:vue`
- Angular `npm run example:angular`

## Example output
![image](https://user-images.githubusercontent.com/644550/184345809-b2ae7398-501a-40c8-90ef-e45ceb660d21.png)


## Running the project
In order to run i18n-cleaner you have to create a config file e.g. `i18n-cleaner.conf.json`

This project uses a JSON file as its configuration. Here you define your source folder, filters and locale files. In the test folder there is an example config file `i18n-cleaner.valid.conf.json`

Use `node src/index.js i18n-cleaner.conf.json` to run the i18n-cleaner

Or run one of the example projects:

- VUE `npm run example:vue` which outputs:

![image](https://user-images.githubusercontent.com/644550/184345833-58b5f47b-3720-4acb-8299-0c522acb1970.png)

- Angular `npm run example:angular` which outputs:

![image](https://user-images.githubusercontent.com/644550/184345868-ab51c319-b73e-4a05-8080-fbd21d6349af.png)


## Configuration file options

Example config:
```json
{
  "extensions": ["vue", "ts"],
  "i18nFilters": [
    "(\\ |\"|\\()t\\([\"'](.*)[\"'](.*)\\)",
    "pageTitleTranslationKey:(.*)[\"']"
  ],
  "locales": [
    "./i18n/en.json", 
    "./i18n/nl.json", 
    "./i18n/de.json"
  ],
  "localesFormat": "json",
  "srcFolder": "./src"
}
```

### extensions
*Array* with the file extensions that should be scanned

```json
"extensions": ["vue", "ts"]
```

### i18nFilters
*Array* with **JSON escaped** regex strings to filter the source with.

You can use for example [this JSON escaper](https://www.freeformatter.com/json-escape.html) to escape your regexes.

This example is beging used for to filter the example `.vue` files in the `test` folder. I use [RegEx 101](https://regex101.com/) to compose the correct regexes.

```json
"i18nFilters": [
    "(\\ |\"|\\()t\\([\"'](.*)[\"'](.*)\\)",
    "pageTitleTranslationKey:(.*)\\\""
]
```

Please take in mind that some regexes filter more than you wish. I first thought that filtering `t(` was enough. Till I noticed that `split(` was included as well. 

The same goes with single and double quotes.

### locales
*Array* with path(s) to locale files. The first defined locale is considered to be the reference/main locale.
```json
  "locales": [
    "./i18n/en.json", 
    "./i18n/nl.json", 
    "./i18n/de.json"
  ],
```

### localesFormat
*String* with locales format. Currently only `json` is supported
```json
  "localesFormat": "json",
```

### srcFolder
*String* with path pointing to the source code folder
```json
  "srcFolder": "./src"
```
