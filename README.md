# Rosetta

[About this repo](#about-this-repo) | [Commands](#commands) | [How to use this repo](#how-to-use-this-repo) | [Technical details](#technical-details)

## About this repo
This is a prototype for how to support localization for [AssemblyScript](https://www.assemblyscript.org/) projects.
It works by using a [transform](https://github.com/Shopify/rosetta/blob/master/assembly/transform.ts) to make a [translations.json file](https://github.com/Shopify/rosetta/blob/master/assembly/translations.json) locally assessable within the WebAssembly binary at compilation. 

|                |                                                            |
|----------------|------------------------------------------------------------|
| Current status | Prototype                                                  |
| Owner          | #scripts-v2-experience                                     |

## Commands
* `npm run asbuild` - build the WebAssembly binary.
* `npm run test` - run the tests.


## How to use this repo
### Requirements
- Node is installed locally.

### Quick Start
```
$ dev cd rosetta
$ npm install
$ npm run test
```

<!--
Examples:
* [Storefront Renderer- Quick start guide ](https://github.com/Shopify/storefront-renderer#development-quick-start)
* [CloudSQLBuddy - How it works content and formatting](https://github.com/Shopify/cloudbuddies/tree/master/buddies/cloudsqlbuddy/README.md)
* [gjtorikian/html-proofer - Configuration and real life examples](https://github.com/gjtorikian/html-proofer/blob/main/README.md#configuration)
* [Polaris Icons - Separate contribution guide](https://github.com/Shopify/polaris-icons/blob/master/README.md#contributing-)
* [Magellan - Collecting in production content](https://github.com/Shopify/magellan/blob/master/README.md#connecting-to-magellan-in-production)
-->

## Technical details
- A custom AssemblyScript transform using the [visitor-as](https://github.com/willemneal/visitor-as) package replaces `translationsJSON()` calls with a JSON string containing the contents of [translations.json](https://github.com/Shopify/rosetta/blob/master/assembly/translations.json) at compilation.
- The JSON is parsed into a readable Map using [assemblyscript-json](https://github.com/nearprotocol/assemblyscript-json) in [gettext.ts](https://github.com/Shopify/rosetta/blob/master/assembly/gettext.ts).
- Calls to `gettext(locale: string, key: string)` will lookup the translation from this map. If no translation exists, it returns the key. 
- String templates:
  - AssemblyScript does not yet support string templates/interpolation natively, so we add our own helper methods to do this for the time being.
  - Users can specify translations like `"This is {users}'s translation"` and optional pass an array of [Variables](https://github.com/Shopify/rosetta/blob/fe6dad3da8cd2f956fe5e4e8c6e8c1a281edab06/assembly/gettext.ts#L3) to `gettext(...)`. 
  - When the translation is returned, all Variable keys within the string will be replaced with the Variable value.
