import { utils, TransformVisitor, SimpleParser } from "visitor-as";
import {
  Parser,
  IdentifierExpression,
  CallExpression,
  Expression,
} from "../as";
import * as path from "path";
import * as fs from "fs";
import * as pkgDir from "pkg-dir";

class IncludeBytesTransform extends TransformVisitor {
  private rootDir: string;

  visitCallExpression(node: CallExpression): Expression {
    if (node.expression instanceof IdentifierExpression) {
      if (node.expression.text == "__translations") {
        let res = SimpleParser.parseExpression(`\`${this.getTranslations()}\``);
        res.range = node.range;
        return res;
      }
    }
    return super.visitCallExpression(node);
  }

  afterParse(parser: Parser): void {
    this.rootDir =
      pkgDir.sync(
        parser.sources.filter(utils.not(utils.isLibrary))[0].normalizedPath
      ) || "./";
    this.visit(
      parser.sources.filter(
        (s) =>
          utils.isLibrary(s) && s.normalizedPath.includes("@shopify/i18n-as")
      )
    );
  }

  getTranslations(): string {
    let config = new Config(this.rootDir);

    var translationMap: { [key: string]: string } = {};
    try {
      fs.readdirSync(config.localeFilesDirectory).forEach(
        (filename: string) => {
          let language: string = filename.substr(0, filename.lastIndexOf("."));
          let filepath: string = path.join(
            config.localeFilesDirectory,
            filename
          );
          translationMap[language] = JSON.parse(
            fs.readFileSync(filepath).toString()
          );
        }
      );
    } catch (e) {
      console.warn(
        `[i18n-as] no locale files found in '${config.localeFilesDirectory}', ${e}`
      );
    }

    return JSON.stringify(translationMap);
  }
}

class Config {
  localeFilesDirectory: string;

  constructor(projectRootDir: string) {
    let pathToConfigFile = path.join(projectRootDir, "i18n.config.json");
    let configData = fs.existsSync(pathToConfigFile)
      ? JSON.parse(fs.readFileSync(pathToConfigFile).toString())
      : {};

    this.localeFilesDirectory = path.join(
      projectRootDir,
      configData.localeFilesDirectory || "./locales"
    );
  }
}

export = IncludeBytesTransform;
