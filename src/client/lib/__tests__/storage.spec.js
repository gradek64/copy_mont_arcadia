import 'mock-local-storage'
import * as storage from '../storage'
import { errorReport } from '../reporter'
import { localStoragePaths } from '../../../shared/constants/localStorage'

jest.mock('../reporter', () => ({
  errorReport: jest.fn(),
}))

global.process.browser = true
const testObjA = Object.freeze({ testA: 'exampleA' })
const testObjB = Object.freeze({ testA: 'exampleB' })

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    jest.clearAllMocks()
  })

  describe('isStorageSupported', () => {
    it('should detect when sessionStorage is supported', () => {
      const storageSupported = storage.isStorageSupported('sessionStorage')
      expect(storageSupported).toBe(true)
    })
    it('should detect when localStorage is supported', () => {
      const storageSupported = storage.isStorageSupported('localStorage')
      expect(storageSupported).toBe(true)
    })
  })

  describe('setSelectedStore', () => {
    it('should serialize selected store object as JSON', () => {
      storage.setSelectedStore(testObjA)
      const storedSelectedStore = sessionStorage.getItem('selectedStore')
      expect(storedSelectedStore).toBe(JSON.stringify(testObjA))
    })
  })

  describe('getSelectedStore', () => {
    it('should return selected store object deserialised from JSON', () => {
      storage.setSelectedStore(testObjA)
      const selectedStore = storage.getSelectedStore()
      expect(selectedStore).toEqual(testObjA)
    })

    it('should report an error when deserialisation fails', () => {
      const invalidJSON = '<object>'
      sessionStorage.setItem('selectedStore', invalidJSON)
      const selectedStore = storage.getSelectedStore()
      expect(selectedStore).toEqual({})
      expect(errorReport).toHaveBeenCalledTimes(1)
    })

    it('should return an empty object when there is no selected store', () => {
      const selectedStore = storage.getSelectedStore()
      expect(selectedStore).toEqual({})
    })
  })

  describe('setCacheData', () => {
    it('should serialize data to localStorage', () => {
      storage.setCacheData('test', testObjA)
      expect(localStorage.length).toBe(1)
      const key = localStorage.key(0)
      const storedData = localStorage.getItem(key)
      expect(storedData).toEqual(JSON.stringify(testObjA))
    })
  })

  describe('getCacheData', () => {
    it('should deserialise data from localStorage', () => {
      storage.setCacheData('test', testObjA)
      const cachedData = storage.getCacheData()
      expect(cachedData).toEqual({ test: testObjA })
    })

    it('should deserialise named data from localStorage', () => {
      storage.setCacheData('testA', testObjA)
      storage.setCacheData('testB', testObjB)
      const cachedData = storage.getCacheData('testB')
      expect(cachedData).toEqual(testObjB)
    })

    it('should return an empty object when nothing is cached', () => {
      const cachedData = storage.getCacheData()
      expect(cachedData).toEqual({})
    })
  })

  describe('clearCacheData', () => {
    it('removes all items from cache', () => {
      storage.setCacheData('testA', testObjA)
      storage.setCacheData('testB', testObjB)
      storage.clearCacheData()
      expect(localStorage.length).toBe(0)
    })

    it('removes named item from cache', () => {
      storage.setCacheData('testA', testObjA)
      storage.setCacheData('testB', testObjB)
      storage.clearCacheData('testA')
      const cachedData = storage.getCacheData()
      expect(cachedData).toEqual({ testB: testObjB })
    })
  })

  describe('saveRecentlyViewedState', () => {
    it('should serialise state to localStorage', () => {
      storage.saveRecentlyViewedState(testObjA)
      expect(localStorage.length).toBe(1)
      const key = localStorage.key(0)
      const storedData = localStorage.getItem(key)
      expect(storedData).toBe(JSON.stringify(testObjA))
    })
  })

  describe('loadRecentlyViewedState', () => {
    it('should return an empty array with no prior state', () => {
      const recentlyViewedState = storage.loadRecentlyViewedState()
      expect(recentlyViewedState).toEqual([])
    })

    it('should return an empty array when state deserialisation fails', () => {
      const invalidJSON = '<object>'
      localStorage.setItem(localStoragePaths.recentlyViewed, invalidJSON)
      const recentlyViewedState = storage.loadRecentlyViewedState()
      expect(recentlyViewedState).toEqual([])
    })

    it('should return deserialised state', () => {
      storage.saveRecentlyViewedState(testObjA)
      const recentlyViewedState = storage.loadRecentlyViewedState()
      expect(recentlyViewedState).toEqual(testObjA)
    })
  })
})
