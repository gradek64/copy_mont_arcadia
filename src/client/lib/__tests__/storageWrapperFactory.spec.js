import 'mock-local-storage'
import * as reporter from '../reporter'
import { createStorageWrapper } from '../storageWrapperFactory'

jest.mock('../reporter', () => ({
  errorReport: jest.fn(),
}))

describe('storageWrapperFactory', () => {
  beforeEach(() => {
    global.process.browser = true
    localStorage.clear()
    sessionStorage.clear()
    jest.resetAllMocks()
  })

  it('should create an `empty` object with all required methods when not in browser environment', () => {
    global.process.browser = false

    const storageWrapper = createStorageWrapper()
    expect(storageWrapper.setItem).toEqual(expect.any(Function))
    expect(storageWrapper.getItem).toEqual(expect.any(Function))
    expect(storageWrapper.removeItem).toEqual(expect.any(Function))

    global.process.browser = true
  })

  it('should create an `empty` object with all required methods when storage is not supported', () => {
    localStorage.itemInsertionCallback = () => {
      throw new Error('Fake error')
    }

    const storageWrapper = createStorageWrapper()
    expect(storageWrapper.setItem).toEqual(expect.any(Function))
    expect(storageWrapper.getItem).toEqual(expect.any(Function))
    expect(storageWrapper.removeItem).toEqual(expect.any(Function))
    localStorage.itemInsertionCallback = () => {}
  })

  describe('fully functional storage wrapper', () => {
    const state = { bar: 'baz' }

    it('should call setItem on storage and report errors', () => {
      const storageWrapper = createStorageWrapper()

      storageWrapper.setItem('foo', state)
      expect(localStorage.getItem('foo')).toEqual(JSON.stringify(state))

      localStorage.itemInsertionCallback = () => {
        throw new Error('Fake error')
      }
      storageWrapper.setItem('bar', 'cux')
      localStorage.itemInsertionCallback = () => {}
    })

    it('should call getItem on storage and report errors', () => {
      const storageWrapper = createStorageWrapper()
      storageWrapper.setItem('foo', 'test')
      storageWrapper.setItem('bar', state)

      expect(storageWrapper.getItem('foo')).toBe('test')
      expect(storageWrapper.getItem('bar')).toEqual(state)

      const invalidJSON = '<object>'
      localStorage.setItem('baz', invalidJSON)
      expect(storageWrapper.getItem('baz')).toBeNull()
      expect(reporter.errorReport).toHaveBeenCalledWith('storage', {
        loggerMessage: 'Failed to getItem from localStorage with key baz',
      })
    })

    it('should call removeItem on storage and always succeed', () => {
      const storageWrapper = createStorageWrapper()

      storageWrapper.setItem('foo', 'test')
      expect(storageWrapper.removeItem('foo')).toBeUndefined()

      storageWrapper.removeItem('missing-key')
      expect(reporter.errorReport).not.toHaveBeenCalled()
    })
  })
})
