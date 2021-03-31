import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'
import { error } from './logger'

const getFolders = (path, excludes = ['common']) => {
  try {
    return readdirSync(path, 'utf-8')
      .filter((file) => !excludes.includes(file)) // remove excludes folders
      .map((file) => resolve(path, file)) // build absolute path
      .filter((file) => statSync(file).isDirectory()) // remove if not a folder
  } catch (err) {
    error(err)
  }
}

const getAssets = (folderPaths, subFolder, excludes = ['.DS_Store']) => {
  return folderPaths.reduce((assets, path) => {
    const parent = path.split('/').pop() // group by brandName
    const target = resolve(path, subFolder) // assets sub-folder

    try {
      const files = readdirSync(target, 'utf-8')
        .filter((file) => !excludes.includes(file)) // remove excludes files
        .map((file) => resolve(target, file)) // build full path to file
        .filter((file) => statSync(file).isFile()) // remove if not a file
        .map((file) => file.split('/').pop()) // persist fileName only

      assets[parent] = { subFolder, files, path }
    } catch (err) {
      error(err)
    }

    return assets
  }, {})
}

export const getStaticAssets = () => {
  const publicPath = resolve(__dirname, '../../../public/')
  const folders = getFolders(publicPath)
  return getAssets(folders, 'images')
}
