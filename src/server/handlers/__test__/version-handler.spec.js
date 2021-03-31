import versionHandler from '../version-handler'
import { resolve } from 'path'

jest.mock('fs', () => {
  const fs = jest.genMockFromModule('fs')
  let mockFiles = Object.create(null)
  return Object.assign({}, fs, {
    __setMockFiles(newMockFiles) {
      mockFiles = newMockFiles
    },
    readFileSync(filePath) {
      const file = mockFiles[filePath]
      if (!file) {
        const error = new Error('ENOENT, no such file or directory')
        error.code = 'ENOENT'
        error.errno = -2
        error.syscall = 'open'
        throw error
      } else if (file === '"ERROR"') {
        const error = new Error('AAAAAA')
        throw error
      }
      return file
    },
  })
})

describe('#Version Handler', () => {
  beforeEach(() => {
    require('fs').__setMockFiles({})
  })

  describe('#versionHandler', () => {
    it('Gets the correct version', () => {
      const value = { AAAAAAAAA: 'BBBBBBB' }
      const key = resolve(__dirname, '../../../../version.json')
      const mockedFiles = {
        [key]: JSON.stringify(value),
      }
      require('fs').__setMockFiles(mockedFiles)
      const v = versionHandler()
      expect(v).toEqual(value)
    })

    it('Returns error message when it fails', () => {
      const v = versionHandler()
      expect(v).toEqual('ENOENT, no such file or directory')
    })

    it('Throws and error when it fails other than normal', () => {
      const value = 'ERROR'
      const key = resolve(__dirname, '../../../../version.json')
      const mockedFiles = {
        [key]: JSON.stringify(value),
      }
      require('fs').__setMockFiles(mockedFiles)
      expect(versionHandler).toThrow()
    })
  })
})
