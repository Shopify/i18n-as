import { utils, TransformVisitor, SimpleParser } from "visitor-as";
import {
  Parser,
  FunctionDeclaration,
  IdentifierExpression,
  StringLiteralExpression,
  CallExpression,
  Expression
} from "./as";
import * as path from "path";
import * as fs from "fs";
import * as pkgDir from "pkg-dir";

class IncludeBytesTransform extends TransformVisitor {
//   private readonly defaultTranslationsPath: './translations';
  private rootDir: string;

//   visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
//     // if (node.decorators && node.decorators.length && node.decorators.some(d => d.name.text == "rosetta_translations")) {
//     //     node.signature.parent.name.text = "_" + node.signature.parent.name.text

//     //     const newFunctionStr = `
//     //     function translations(): string {
//     //         return \`${this.getTranslations(node.range.source.normalizedPath)}\`;
//     //     }
//     //     `
//     // }

//     // if (node.decorators && node.decorators.length && node.decorators.some(d => d.name.text == "rosetta_translations")) {
//     //     const sourceFilePath = node.range.source.normalizedPath;
//     //     const newFunctionStr = `
//     //     function translations(): string {
//     //         return \`${this.getTranslations(sourceFilePath)}\`;
//     //     }
//     //     `
//     //     const newFunctionStatement = this.parser.parseFile(newFunctionStr, sourceFilePath, false);
//     // }

//     if (node.decorators && node.decorators.length && node.decorators.some(d => d.name.text == "rosetta_translations")) {
//         const sourceFilePath = node.range.source.normalizedPath;
//         const newFunctionStr = `
//         function translations(): string {
//             return \`${this.getTranslations(sourceFilePath)}\`;
//         }
//         `
//         const newFunctionStatement = this.parser.parseFile(newFunctionStr, sourceFilePath, false);
//     }

//     return node;
//   }

    visitCallExpression(node: CallExpression): Expression {
        if (node.expression instanceof IdentifierExpression){
            if (node.expression.text == "translations") {
                let res = SimpleParser.parseExpression(`\`${this.getTranslations(node.range.source.normalizedPath)}\``);
                res.range = node.range;
                return res;
            }
        }
        return super.visitCallExpression(node);
    }

  afterParse(parser: Parser): void {
    // let sources = _.sources.filter(utils.not(utils.isLibrary));
    this.rootDir = pkgDir.sync(parser.sources.filter(utils.not(utils.isLibrary))[0].normalizedPath);
    this.visit(parser.sources.filter(s => utils.isLibrary(s) && s.normalizedPath.includes("@shopify/rosetta")));

    parser.sources.forEach(s => {
        console.log(s.normalizedPath);
    })
  }

  getTranslations(sourceFilePath: string): string {
    let config = new Config(this.rootDir);
    console.log(JSON.stringify(config));

    // let folder = path.join(this.rootDir, config.translationsPath);

      var translationMap: any = {}
      try {
        fs.readdirSync(config.translationsPath).forEach((filename: string) => {
          let language: string = filename.substr(0, filename.lastIndexOf("."));
          let filepath: string = path.join(config.translationsPath, filename);
          translationMap[language] = JSON.parse(fs.readFileSync(filepath).toString());
        });
      } catch (e) {
        throw `[Error] no translations found in '${config.translationsPath}', ${e}`;
      }

      return JSON.stringify(translationMap);
  }
}

class Config {
    translationsPath: string;

    constructor(projectRootDir: string) {
        let pathToConfigFile = path.join(projectRootDir, 'i18n.config.json')
        let configData = (fs.existsSync(pathToConfigFile)) ? JSON.parse(fs.readFileSync(pathToConfigFile).toString()) : {}

        this.translationsPath = path.join(projectRootDir, configData.translationsPath || './translations');
    }
}

export = IncludeBytesTransform;
