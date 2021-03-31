const path = require('path')
const glob = require('glob')
const config = require('../../config.js')
const traverseDir = require('../../../src/shared/lib/traverse-dir.js')

function gatherVariables(brand) {
  const varFile = {}
  const dirpath = path.join(
    config.get('root_dir'),
    './src/shared/brand/' + brand + '/variables'
  )

  traverseDir(dirpath, (filepath) => {
    delete require.cache[filepath]
    Object.assign(varFile, require(filepath))
  })
  return varFile
}

function removeNullCss(css) {
  return css.walk((node) => {
    if (node.selector && /null/g.test(node.selector)) {
      const lines = node.selector.split('\n')
      node.selector = lines.filter((line) => !/null/g.test(line)).join('\n')
    }
    if (/null/g.test(node.value)) node.remove()
  })
}

function formatter(input) {
  const format = (type, plugin, message, selector, ...rest) => {
    const line = `\u{1b}[33m${type} | ${plugin} |\u{1b}[0m ${message} in \u{1b}[36m${selector}\u{1b}[0m`
    return `${line}${rest.reduce(
      (prev, next) => `${next && `${prev} / \u{1b}[36m${next}\u{1b}[0m`}`,
      ''
    )}\n`
  }

  return input.messages.reduce((prev, next) => {
    if (next.plugin === 'stylelint')
      return next.node.parent.selector
        ? prev +
            format(
              next.type,
              'STYLE',
              next.rule,
              next.node.parent.selector,
              next.node.prop,
              next.node.value
            )
        : prev

    if (next.plugin === 'postcss-bem-linter')
      return prev + format(next.type, 'SUIT', next.text, next.node.selector)

    return prev + next
  }, '')
}

function customPostcss(brand) {
  const defaultVars = gatherVariables('default')
  const brandVars = gatherVariables(brand)
  const plugins = [
    require('postcss-mixins'),
    require('postcss-simple-vars')({
      variables: Object.assign({ brand }, defaultVars, brandVars),
    }),
    require('postcss-conditionals')(),
    removeNullCss,
    require('postcss-cssnext')({
      browsers: ['iOS >= 7', 'Android >= 4', 'Chrome >= 43'],
    }),
    require('postcss-bem-linter')(),
    require('postcss-reporter')({
      clearMessages: true,
      throwError: true,
      formatter,
    }),
  ]

  return plugins
}

function addCssFilePaths(brandName) {
  const sharedPath = path.join(config.get('dir_src'), '/shared/')
  const componentsPath = path.join(sharedPath, '/components')
  const stylesPath = path.join(sharedPath, '/styles')

  return [
    ...glob.sync(`${componentsPath}/**/!(*-*).css`),
    ...glob.sync(`${componentsPath}/**/*-${brandName}.css`),
    // find all brand specific critical css files from the components directory
    ...glob.sync(`${componentsPath}/**/*-${brandName}.criticalBrand.css`),
    // find all critical css files from the styles directory
    ...glob.sync(`${stylesPath}/*\.critical\.css`),
  ]
}

function addBrandsProd(wpc) {
  const srcPath = config.get('dir_src')
  const entryPoints = config.get('brands').reduce(
    (prev, cur) =>
      Object.assign(prev, {
        [cur]: [
          ...addCssFilePaths(cur),
          path.join(srcPath, 'shared/brand', cur, `style-${cur}.js`),
        ],
      }),
    {}
  )
  Object.assign(wpc.entry, entryPoints)
  return wpc
}

// This includes all variables to the watchlist on init
function addBrandsDev(wpc) {
  const srcPath = config.get('dir_src')
  const entryPoints = config
    .get('brands')
    .concat(['default'])
    .reduce((prev, cur) => {
      const brandDir = path.join(srcPath, 'shared/brand', cur)
      const filepaths = cur === 'default' ? [] : [`${brandDir}/style-${cur}.js`]
      filepaths.push(...addCssFilePaths(cur))
      traverseDir(`${brandDir}/variables`, (fp) => filepaths.push(fp))
      return Object.assign(prev, { [cur]: filepaths })
    }, {})
  Object.assign(wpc.entry, entryPoints)
  return wpc
}

module.exports = {
  customPostcss,
  addBrandsProd,
  addBrandsDev,
}
