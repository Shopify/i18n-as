# i18n-as

[About this project](#about-this-project) | [How to use this project](#how-to-use-this-project) | [Development](#development)

## About this project
i18n-as is a localization package for [AssemblyScript](https://www.assemblyscript.org/) projects.
It works by using a compiler [transform](https://github.com/Shopify/i18n-as/blob/06bf5586fbf41a8b2cda8103016f3223eeb118dd/src/transform.ts) to make [translations](https://github.com/Shopify/i18n-as/tree/06bf5586fbf41a8b2cda8103016f3223eeb118dd/tests/integration/locales) locally accessible within the WebAssembly binary. 

## How to use this project
### Requirements
- Node is installed locally.

### Installation
```
# npm
$ npm install @shopify/i18n-as --save

# yarn
$ yarn add @shopify/i18n-as
```

### Using the Transform
Since i18n-as uses a compiler transform to read and parse translations, you need to tell the compiler to use the transform. Options:
  1. During all `asc` calls, add `--transform @shopify/i18n-as/dist/transform.js`
      - Ex. `asc entryFile.ts --transform @shopify/i18n-as/dist/transform.js`
      - If you use additional projects that compile your code like [as-pect](https://github.com/jtenner/as-pect), ensure those are configured to use this transform as well.
  2. Add a `transform` option to your `asconfig.json` file.
  ```
  // asconfig.json
  {
    ...
    "options": {
      ...
      "transform": "@shopify/i18n-as/dist/transform.js"
    }
  }
  ```

### Configuration
By default, i18n-as will look for locale files in the `/locales` folder at the project root. To configure this location, you can optionally add a `i18n.config.json` file:
```
// i18n.config.json
{
  "localeFilesDirectory": "/path/to/your/folder"
}
```


### Locale Files
Locale files should be written in JSON files and abide by the following folder structure:
```
.
├── assembly/
├── locales/
│   ├── en.json
│   └── fr.json
|   └── <locale>.json
└── i18n.config.json
```

```
// locales/<locale>.json
{
  "my translation key": "some translated value",
  "another key: "another value"
}
```

### AssemblyScript example

```
// locales/fr.json
{
  "hello": "bonjour",
}
```
```
// locales/es.json
{
  "hello": "hola",
}
```
```
// index.ts
import { translate } from '@shopify/i18n-as'

translate("fr", "hello") // => "bonjour"
translate("es", "hello") // => "hola"
translate("en", "hello") // => defaults to the key, "hello"
```

### More Documentation
Additional documentation can be found in the [wiki](https://github.com/Shopify/i18n-as/wiki).

## Development
### Quick Start
```
$ git clone https://github.com/Shopify/i18n-as.git
$ cd i18n-as
$ npm install
$ npm run test
```

### Commands
* `npm run asbuild` - build the WebAssembly binary.
* `npm run build` - compile the TypeScript transform into JavaScript.
* `npm run test` - run the tests.
