import { utils, TransformVisitor, SimpleParser } from "visitor-as";
import {
  Expression,
  Parser,
  CallExpression,
  IdentifierExpression,
  StringLiteralExpression
} from "./as";
import * as path from "path";
import * as fs from "fs";

class IncludeBytesTransform extends TransformVisitor {
  visitCallExpression(node: CallExpression): Expression {
    if (node.expression instanceof IdentifierExpression) {
      // readfile implementation
      if (node.expression.text == "readfile") {
        let arg0 = node.args[0] as StringLiteralExpression;
        let filename = path.join(
          path.dirname(node.range.source.normalizedPath),
          arg0.value
        );

        var jsonData;
        try {
          jsonData = fs.readFileSync(filename);
        } catch (e) {
          throw `[Error] readfile '${filename}', ${e}`;
        }

        let res = SimpleParser.parseExpression("\`" + jsonData + "\`;");
        res.range = node.range;

        return res;
      }

      // readfolder implementation
      if (node.expression.text == "readfolder") {
        let arg0 = node.args[0] as StringLiteralExpression;
        let folder = path.join(
          path.dirname(node.range.source.normalizedPath),
          arg0.value
        );

        var translationMap: any = {}
        try {
          fs.readdirSync(folder).forEach((filename: string) => {
            let language: string = filename.substr(0, filename.lastIndexOf("."));
            let filepath: string = path.join(folder, filename);
            translationMap[language] = JSON.parse(fs.readFileSync(filepath).toString());
          });
        } catch (e) {
          throw `[Error] readfolder '${folder}', ${e}`;
        }

        let jsonStr = JSON.stringify(translationMap);
        let res = SimpleParser.parseExpression("\`" + jsonStr + "\`;");
        res.range = node.range;

        return res;
      }
    }
    return super.visitCallExpression(node);
  }

  afterParse(_: Parser): void {
    let sources = _.sources.filter(utils.not(utils.isLibrary));
    this.visit(sources);
  }
}

export = IncludeBytesTransform;
