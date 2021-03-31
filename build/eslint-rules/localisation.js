require('@babel/register')

const { default: dictionaries, removeExpressions } = require('../../src/shared/constants/dictionaries')
const keys = Object.keys(dictionaries.topshop['en-GB'])

const couldBeLocalisationFunctionName = (name) => ['l', 'localise'].includes(name)

module.exports = (context) => {
  const sourceCode = context.getSourceCode()

  const getKey = (node) => removeExpressions(sourceCode.getText(node).slice(1, -1))

  const verify = (key, node) => {
    if (!keys.includes(key)) {
      context.report(node, `key '${key}' not present in dictionaries`)
    }
  }

  return {
    CallExpression(node) {
      if (couldBeLocalisationFunctionName(node.callee.name)) {
        const argument = node.arguments[0]
        let key
        if (argument.type === 'TemplateLiteral') {
          key = getKey(argument)
        } else if (argument.type === 'Literal') {
          key = argument.value
        }

        if (key) {
          verify(key, node)
        }
      }
    },

    TaggedTemplateExpression(node) {
      if (couldBeLocalisationFunctionName(node.tag.name)) {
        verify(getKey(node.quasi), node)
      }
    }
  }
}
