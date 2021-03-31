const APP_PREFIX = 'MONTY/'

export default (prefix, keys) =>
  Object.keys(keys).reduce((newKeys, key) => {
    newKeys[key] = `${APP_PREFIX}${prefix}.${key}`
    return newKeys
  }, {})
