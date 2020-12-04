import { utils, TransformVisitor, SimpleParser } from "visitor-as";
import {
  Expression,
  Parser,
  CallExpression,
  IdentifierExpression,
} from "assemblyscript";
import * as path from "path";
import * as fs from "fs";

class IncludeBytesTransform extends TransformVisitor {
  visitCallExpression(node: CallExpression): Expression {
    if (node.expression instanceof IdentifierExpression) {
      if (node.expression.text == "translationsJSON") {

        let filename = path.join(path.dirname(node.range.source.normalizedPath), "translations.json");

        var jsonData;
        try {
          jsonData = fs.readFileSync(filename);
        } catch (e) {
          throw `[Error] includeBytes '${filename}', ${e}`;
        }

        let res = SimpleParser.parseExpression("\`" + jsonData + "\`;");
        res.range = node.range; //same range

        this.stdout.write("Transformed.\n");
        return res; //replace node
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
