//     This file prevents compilation errors where the transform is importing a 
// different version of AssemblyScript than the root project uses. To get around
// this, we use the AssemblyScript dependenies found root project's node modules.
//
// Ref: https://github.com/AssemblyScript/assemblyscript/issues/1695

const path = require("path");

let ascPath = Object.getOwnPropertyNames(require.cache).filter((s) =>
  s.endsWith("asc.js")
)[0];

let assemblyscriptPath = Object.getOwnPropertyNames(require.cache).filter((s) =>
  s.endsWith("assemblyscript.js")
)[0];

let transformerPath;
if (assemblyscriptPath) {
  let splitPath = assemblyscriptPath.split(path.sep).slice(0, -2);
  transformerPath = splitPath.concat(["cli", "transform"]).join(path.sep);
} else {
  assemblyscriptPath = require.resolve("assemblyscript");
  ascPath = require.resolve("assemblyscript/cli/asc");
  transformerPath = require.resolve("assemblyscript/cli/transform");
}
const assemblyscript = require(assemblyscriptPath);

module.exports.Transform = require(transformerPath).Transform;
module.exports = {
  ...require(ascPath),
  ...module.exports,
  ...assemblyscript,
  ...assemblyscript.util, // Need to add because newer version adds namespace
};
