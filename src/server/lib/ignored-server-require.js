import path from 'path'

const sourceRoot = '../'

// eslint-disable-next-line import/no-dynamic-require
const ignoredServerRequire = (target) => require(path.join(sourceRoot, target))

export default ignoredServerRequire
