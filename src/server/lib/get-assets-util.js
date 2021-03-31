import { readFileSync } from 'fs'
import { resolve } from 'path'

export const generateAssets = () => {
  if (process.env.NODE_ENV !== 'production') {
    delete require.cache[
      require.resolve('../../../public/generated-assets.json')
    ]
  }
  return require('../../../public/generated-assets.json') // eslint-disable-line import/no-unresolved
}

export const disableClientAppAccess = () => {
  return (
    process.env.ENABLE_CLIENT_SIDE_ACCESS !== '1' &&
    readFileSync(resolve(__dirname, './disable-app-access.js'), 'utf8')
  )
}
