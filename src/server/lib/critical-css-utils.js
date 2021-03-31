import allBrands from '../../shared/constants/allBrands'
import { isEmpty, path } from 'ramda'
import { errorReport } from '../../client/lib/reporter'
import { setCriticalCssFiles } from '../handlers/server-side-renderer'
import readFile from './read-file'

export async function setUpCriticalCssFiles() {
  const brands = process.env.BRANDS ? process.env.BRANDS.split(',') : allBrands
  const brandCriticalCssFiles = []

  brands.map((brandName) => {
    const path = `../../../public/${brandName}/critical.css`

    // create an array of promises which reads the source of the content
    brandCriticalCssFiles.push(
      new Promise((resolve) => {
        const emptyReturnValue = { brandName, returnValue: '' }
        try {
          const returnFileContents = readFile(path)
          if (!isEmpty(returnFileContents)) {
            return resolve({ brandName, returnFileContents })
          }
          return resolve(emptyReturnValue)
        } catch (err) {
          errorReport('SSR:CriticalCss', {
            loggerMessage: `Critical CSS error. Path: ${path}. Error: ${
              err.message
            }`,
          })
          return resolve(emptyReturnValue)
        }
      })
    )

    return brandCriticalCssFiles
  })

  // waits until all promises are done and then sets the content
  const preloadCriticalCssFiles = async () => {
    return Promise.all(brandCriticalCssFiles).then((files) => {
      const brandCriticalCssFilesConfig = files.reduce((config, fileConfig) => {
        if (path(['brandName'], fileConfig)) {
          config[fileConfig.brandName] = path(
            ['returnFileContents'],
            fileConfig
          )
        }
        return config
      }, {})
      setCriticalCssFiles(brandCriticalCssFilesConfig)
    })
  }

  // eslint-disable-next-line no-return-await
  return await preloadCriticalCssFiles()
}
