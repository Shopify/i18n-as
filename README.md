# i18n-as

[About this project](#about-this-project) | [Commands](#commands) | [How to use this project](#how-to-use-this-project) | [Development](#development) | [Technical details](#technical-details)

## About this project
i18n-as is a localization package for [AssemblyScript](https://www.assemblyscript.org/) projects.
It works by using a compiler [transform](https://github.com/Shopify/i18n-as/blob/master/assembly/transform.ts) to make [translations](https://github.com/Shopify/i18n-as/tree/master/tests/integration/translations) locally accessible within the WebAssembly binary. 

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

## Technical details
- A custom AssemblyScript transform using the [visitor-as](https://github.com/willemneal/visitor-as) package replaces `__translations()` calls within i18n-as library sources with a JSON string representing a map of the defined [translations](https://github.com/Shopify/i18n-as/tree/209fcd3fbce742aca38f85314f8cbc8fec444198/tests/integration/translations) at compilation.
- The JSON is parsed into a readable Map using [assemblyscript-json](https://github.com/nearprotocol/assemblyscript-json) in [assembly/index.ts](https://github.com/Shopify/i18n-as/blob/209fcd3fbce742aca38f85314f8cbc8fec444198/assembly/index.ts).
- Calls to `translate(locale: string, key: string)` will lookup the translation from this map. If no translation exists, it returns the key. 
- String templates:
  - Users can specify translations like `"This is {users}'s translation"` and optionally pass an array of [Variables](https://github.com/Shopify/i18n-as/blob/209fcd3fbce742aca38f85314f8cbc8fec444198/assembly/index.ts#L3-L11) to `translate(...)`. 
  - When the translation is returned, all Variable keys within the string will be replaced with the Variable value.

