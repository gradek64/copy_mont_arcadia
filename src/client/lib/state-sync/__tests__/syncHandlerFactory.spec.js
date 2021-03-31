import { createSyncHandler } from '../syncHandlerFactory'
import { createStorageWrapper } from '../../storageWrapperFactory'

const mockSetItem = jest.fn()
const mockGetItem = jest.fn()

jest.mock('../../storageWrapperFactory', () => ({
  createStorageWrapper: jest.fn(() => ({
    getItem: mockGetItem,
    setItem: mockSetItem,
  })),
}))

describe('storageHandlerFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error when missing key', () => {
    expect(() => {
      createSyncHandler({
        storedActions: ['FOO'],
      })
    }).toThrowError('Missing key')
  })

  it('should throw error when missing storedActions', () => {
    expect(() => {
      createSyncHandler({
        key: ['FOO'],
      })
    }).toThrowError('Missing storedActions')
  })

  it('should return a functional storage sync handler', () => {
    const updateActionMock = jest.fn()
    const config = {
      key: 'foo',
      storedActions: ['SET_FOO', 'SET_BAR'],
      updateAction: updateActionMock,
    }
    const data = { foo: 'baz' }
    const handler = createSyncHandler(config)

    expect(handler).toEqual({
      key: 'foo',
      storage: expect.any(Object),
      storedActions: expect.any(Array),
      mergeActionType: `FOO_MERGE_STATE`,
      updateAction: updateActionMock,
      retrieve: expect.any(Function),
      persist: expect.any(Function),
      merge: expect.any(Function),
    })

    expect(createStorageWrapper).toHaveBeenCalledWith('localStorage')

    expect(mockSetItem).not.toBeCalledWith(config.key, data)
    handler.persist(data)
    expect(mockSetItem).toBeCalledWith(config.key, data)

    expect(mockGetItem).not.toBeCalledWith(config.key)
    handler.retrieve()
    expect(mockGetItem).toBeCalledWith(config.key)
  })

  describe('storageType is provided', () => {
    it('should return the proper functional storage sync handler', () => {
      const updateActionMock = jest.fn()
      const config = {
        key: 'foo',
        storedActions: ['SET_FOO', 'SET_BAR'],
        updateAction: updateActionMock,
        storageType: 'sessionStorage',
      }
      const data = { foo: 'baz' }
      const handler = createSyncHandler(config)

      expect(handler).toEqual({
        key: 'foo',
        storage: expect.any(Object),
        storedActions: expect.any(Array),
        mergeActionType: `FOO_MERGE_STATE`,
        updateAction: updateActionMock,
        retrieve: expect.any(Function),
        persist: expect.any(Function),
        merge: expect.any(Function),
      })

      expect(createStorageWrapper).toHaveBeenCalledWith('sessionStorage')

      expect(mockSetItem).not.toBeCalledWith(config.key, data)
      handler.persist(data)
      expect(mockSetItem).toBeCalledWith(config.key, data)

      expect(mockGetItem).not.toBeCalledWith(config.key)
      handler.retrieve()
      expect(mockGetItem).toBeCalledWith(config.key)
    })
  })

  describe('without an updateAction', () => {
    it('should persist all data', () => {
      const lastPersistTime = { lastPersistTime: 123213213 }
      const config = {
        key: 'foo',
        storedActions: ['SET_FOO', 'SET_BAR'],
      }
      const data = { foo: 'baz', cux: 'bar', ...lastPersistTime }
      const handler = createSyncHandler(config)

      handler.persist(data)
      expect(mockSetItem).toBeCalledWith(config.key, data)
    })

    it('should retrieve all data', () => {
      const lastPersistTime = { lastPersistTime: 123213213 }
      const persistedData = { foo: 'bar', ...lastPersistTime }
      mockGetItem.mockReturnValue(persistedData)
      const config = {
        key: 'foo',
        storedActions: ['SET_FOO', 'SET_BAR'],
      }
      const handler = createSyncHandler(config)

      expect(handler.retrieve()).toEqual(persistedData)
      expect(mockGetItem).toBeCalledWith(config.key)
    })

    describe('should return a correctly merged object', () => {
      it('should return a correctly merged object when some properties are added', () => {
        const config = {
          key: 'foo',
          storedActions: ['SET_FOO', 'SET_BAR'],
        }
        const state = { foo: 'bar' }
        const data = { foo: 'baz', cux: 'bar' }
        const handler = createSyncHandler(config)

        expect(handler.merge(state, data)).toEqual(data)
      })

      it('should return a correctly merged object when some properties are removed', () => {
        const config = {
          key: 'foo',
          storedActions: ['SET_FOO', 'SET_BAR'],
        }
        const state = { foo: 'bar', cux: 'bar' }
        const data = { foo: 'baz' }
        const handler = createSyncHandler(config)

        expect(handler.merge(state, data)).toEqual(data)
      })

      it('should return a correctly merged object when empty object merged in', () => {
        const config = {
          key: 'foo',
          storedActions: ['SET_FOO', 'SET_BAR'],
        }
        const state = { foo: 'bar', cux: 'bar' }
        const data = {}
        const handler = createSyncHandler(config)

        expect(handler.merge(state, data)).toEqual(data)
      })
    })
  })

  describe('with an updateAction', () => {
    const updateActionMock = jest.fn()

    describe('should return a correctly merged object', () => {
      it('should return a correctly merged object when some properties are added', () => {
        const config = {
          key: 'foo',
          storedActions: ['SET_FOO', 'SET_BAR'],
          updateAction: updateActionMock,
        }
        const state = { foo: 'bar' }
        const data = { foo: 'baz', cux: 'bar' }
        const handler = createSyncHandler(config)

        expect(handler.merge(state, data)).toEqual(data)
      })

      it('should return a correctly merged object when some properties are removed', () => {
        const config = {
          key: 'foo',
          storedActions: ['SET_FOO', 'SET_BAR'],
          updateAction: updateActionMock,
        }
        const state = { foo: 'bar', cux: 'bar' }
        const data = { foo: 'baz' }
        const handler = createSyncHandler(config)

        expect(handler.merge(state, data)).toEqual({ foo: 'baz', cux: 'bar' })
      })

      it('should return a correctly merged object when empty object merged in', () => {
        const config = {
          key: 'foo',
          storedActions: ['SET_FOO', 'SET_BAR'],
          updateAction: updateActionMock,
        }
        const state = { foo: 'bar', cux: 'bar' }
        const data = {}
        const handler = createSyncHandler(config)

        expect(handler.merge(state, data)).toEqual(state)
      })
    })

    it('should only persist lastPersistTime', () => {
      const lastPersistTime = { lastPersistTime: 123213213 }
      const config = {
        key: 'foo',
        storedActions: ['SET_FOO', 'SET_BAR'],
        updateAction: updateActionMock,
      }
      const data = { foo: 'baz', cux: 'bar', ...lastPersistTime }
      const handler = createSyncHandler(config)

      handler.persist(data)
      expect(mockSetItem).toBeCalledWith(config.key, lastPersistTime)
    })

    it('should only retrieve lastPersistTime', () => {
      const lastPersistTime = { lastPersistTime: 123213213 }
      mockGetItem.mockReturnValue({
        ignore: 'me',
        ...lastPersistTime,
      })
      const updateActionMock = jest.fn()
      const config = {
        key: 'foo',
        storedActions: ['SET_FOO', 'SET_BAR'],
        updateAction: updateActionMock,
      }
      const handler = createSyncHandler(config)

      expect(handler.retrieve()).toEqual(lastPersistTime)
      expect(mockGetItem).toBeCalledWith(config.key)
    })
  })
})
