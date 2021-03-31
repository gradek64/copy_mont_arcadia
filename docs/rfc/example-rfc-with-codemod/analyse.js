const { writeToLog } = require('../utils')
const { join, relative } = require('path')

const findRamda = ({ ImportDeclaration }, ast) =>
  ast.find(ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'ramda',
    },
  })

const findImportNames = ({ Identifier }, ast) => {
  const imports = []
  ast
    .find(Identifier)
    .forEach((path) => path.name === 'imported' && imports.push(path.node.name))
  return imports
}

module.exports = (fileInfo, api) => {
  const { jscodeshift: j } = api
  const ast = j(fileInfo.source)
  const ramda = findRamda(j, ast)
  if (ramda.length) {
    writeToLog({
      file: relative(join(process.env.PWD, 'src'), fileInfo.path),
      namedImports: findImportNames(j, ramda),
    })
  }
  return fileInfo.source
}
