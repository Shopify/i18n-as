exports.afterParse = function(parser) {
    const assemblyscript = require('./as');
    const {
      CommonFlags,
      Node,
      NodeKind,
      SourceKind,
      TypeKind,
      parseFile
    } = assemblyscript;
    

    const entrySrcIdx = parser.program.sources.findIndex(s => s.isEntry)
    const entrySrc = parser.program.sources[entrySrcIdx]

    parser.program.sources.forEach(source => {
        console.log("path" + source.path);
        console.log(source.isEntry);
    })
    // entrySrc.statements.forEach(stmt => {
    // if (
    //     stmt.kind === NodeKind.FUNCTIONDECLARATION &&
    //     stmt.decorators &&
    //     stmt.decorators.length &&
    //     stmt.decorators.some(d => d.name.text === "rosetta_transations")
    // ) {
    //     // unpack what we need from this function
    //     const func = {
    //         name: stmt.signature.parent.name.text,
    //         params: stmt.signature.parameters.map((param) => {
    //         return {name: param.name.text, type: param.type.name.text}
    //         }),
    //         returnType: stmt.signature.returnType.name.text
    //     }

    //     // rename the old function to be prefixed with an underscore
    //     stmt.signature.parent.name.text = "_" + func.name;

    //     let codeStr = `
    //     function translations(): string {
    //         return '';
    //     }
    //     `
    //     // create a new function with the same name that does the unwrapping and 
    //     // calls the old function
    //     const callWrapperStmt = parseFile(
    //         makeFunctionString(func),
    //         entrySrc.range.source.normalizedPath, 
    //         true,
    //         null
    //     ).program.sources[0].statements[0];


    //     let toStringCode = `
    // toString(): string {
    // return '{'+${formatList}+'}';
    //     }
    //     `
    //     // insert it in to the code
    //     let source = s.range.source.text;
    //     let updatedSource = source.slice(0, s.range.end) + toStringCode + source.slice(s.range.end)

    //     // build the whole thing again
    //     const newMember = parseFile(
    //     updatedSource,
    //     entrySrc.range.source.normalizedPath, 
    //     true,
    //     null
    //     ).program.sources[0].statements[i].members[0];

    //     // insert it in the tree
    //     s.members.push(newMember);
    // }
    // })
}

// function getTranslations(): string {
//     let folder = path.join(
//         path.dirname(node.range.source.normalizedPath),
//         arg0.value
//     );

//       var translationMap: any = {}
//       try {
//         fs.readdirSync(folder).forEach((filename: string) => {
//           let language: string = filename.substr(0, filename.lastIndexOf("."));
//           let filepath: string = path.join(folder, filename);
//           translationMap[language] = JSON.parse(fs.readFileSync(filepath).toString());
//         });
//       } catch (e) {
//         throw `[Error] readfolder '${folder}', ${e}`;
//       }

//       let jsonStr = JSON.stringify(translationMap);
//       let res = SimpleParser.parseExpression("\`" + jsonStr + "\`;");
// }
