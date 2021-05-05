"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var visitor_as_1 = require("visitor-as");
var as_1 = require("./as");
var path = require("path");
var fs = require("fs");
var IncludeBytesTransform = /** @class */ (function (_super) {
    __extends(IncludeBytesTransform, _super);
    function IncludeBytesTransform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IncludeBytesTransform.prototype.visitCallExpression = function (node) {
        if (node.expression instanceof as_1.IdentifierExpression) {
            // readfile implementation
            if (node.expression.text == "readfile") {
                var arg0 = node.args[0];
                var filename = path.join(path.dirname(node.range.source.normalizedPath), arg0.value);
                var jsonData;
                try {
                    jsonData = fs.readFileSync(filename);
                }
                catch (e) {
                    throw "[Error] readfile '" + filename + "', " + e;
                }
                var res = visitor_as_1.SimpleParser.parseExpression("\`" + jsonData + "\`;");
                res.range = node.range;
                return res;
            }
            // readfolder implementation
            if (node.expression.text == "readfolder") {
                var arg0 = node.args[0];
                var folder_1 = path.join(path.dirname(node.range.source.normalizedPath), arg0.value);
                var translationMap = {};
                try {
                    fs.readdirSync(folder_1).forEach(function (filename) {
                        var language = filename.substr(0, filename.lastIndexOf("."));
                        var filepath = path.join(folder_1, filename);
                        translationMap[language] = JSON.parse(fs.readFileSync(filepath).toString());
                    });
                }
                catch (e) {
                    throw "[Error] readfolder '" + folder_1 + "', " + e;
                }
                var jsonStr = JSON.stringify(translationMap);
                var res = visitor_as_1.SimpleParser.parseExpression("\`" + jsonStr + "\`;");
                res.range = node.range;
                return res;
            }
        }
        return _super.prototype.visitCallExpression.call(this, node);
    };
    IncludeBytesTransform.prototype.afterParse = function (_) {
        var sources = _.sources.filter(visitor_as_1.utils.not(visitor_as_1.utils.isLibrary));
        this.visit(sources);
    };
    return IncludeBytesTransform;
}(visitor_as_1.TransformVisitor));
module.exports = IncludeBytesTransform;
