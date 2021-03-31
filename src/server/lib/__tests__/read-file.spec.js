import readFile from '../read-file'

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
        throw error
      }
      return file
    },
  })
})

describe('readFile', () => {
  beforeEach(() => {
    require('fs').__setMockFiles({})
  })

  it('reads file content into variable', () => {
    const mockedFiles = {
      '/mock/path/to/file.txt': 'this is a mocked file',
    }
    require('fs').__setMockFiles(mockedFiles)
    const fileContent = readFile('/mock/path/to/file.txt')
    expect(fileContent).toBe('this is a mocked file')
  })

  it('throws error if the file does not exist', (done) => {
    try {
      readFile('definitelyNotExist')
    } catch (error) {
      expect(error).toHaveProperty(
        'message',
        'ENOENT, no such file or directory'
      )
      expect(error).toHaveProperty('code', 'ENOENT')
      done()
    }
  })
})
