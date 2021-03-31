import {
  setupLoaders,
  deferredLoadImage,
  getIntersectionObserverRootMargin,
} from './image-loader'
import setupConnectionType from '../../../../test/unit/helpers/setup-connection-type'

describe('deferred image loading', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getIntersectionObserverRootMargin()', () => {
    it('returns a high margin when the network connection is slow', () => {
      setupConnectionType('3g')
      const margin = getIntersectionObserverRootMargin()
      expect(margin).toBe('100% 0px 100% 0px')
    })

    it('returns a low margin when the network connection is not slow', () => {
      setupConnectionType('4g')
      const margin = getIntersectionObserverRootMargin()
      expect(margin).toBe('50% 0px 50% 0px')
    })
  })

  describe('setupLoaders()', () => {
    it('piggybacks an existing window.onload handler', () => {
      const existingOnLoad = jest.fn()
      const mockWindow = { onload: existingOnLoad }
      setupLoaders(mockWindow)

      expect(mockWindow.onload).not.toBe(existingOnLoad)

      mockWindow.onload()

      expect(existingOnLoad).toHaveBeenCalledTimes(1)
    })

    it('loads the image immediately for partial IntersectionObserver support, such as chrome v51-57', () => {
      const dispatchEventMock = jest.fn()
      const entries = [
        {
          isIntersecting: undefined,
          intersectionRatio: 1,
          target: { dispatchEvent: dispatchEventMock },
        },
      ]
      let callback
      class IntersectionObserver {
        constructor(cb) {
          callback = cb
        }
        unobserve() {}
      }
      const mockWindow = {
        IntersectionObserver,
      }
      setupLoaders(mockWindow)
      callback(entries)

      expect(dispatchEventMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'load' })
      )
    })

    it('loads when intersecting but with zero ratio', () => {
      const dispatchEventMock = jest.fn()
      const entries = [
        {
          isIntersecting: undefined,
          intersectionRatio: 0,
          target: { dispatchEvent: dispatchEventMock },
        },
      ]
      let callback
      class IntersectionObserver {
        constructor(cb) {
          callback = cb
        }
        unobserve() {}
      }
      const mockWindow = {
        IntersectionObserver,
      }
      setupLoaders(mockWindow)
      callback(entries)

      expect(dispatchEventMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'load' })
      )
    })
  })

  describe('setupLoaders() and deferredLoadImage()', () => {
    it('calls onLoad() only when the window.onload handler is invoked', () => {
      const mockWindow = {}
      setupLoaders(mockWindow)

      const element = {
        dispatchEvent: jest.fn(),
      }

      deferredLoadImage(element)
      expect(element.dispatchEvent).not.toHaveBeenCalled()

      mockWindow.onload()
      expect(element.dispatchEvent).toHaveBeenCalledTimes(1)
    })

    it('works with multiple images', () => {
      const mockWindow = {}
      setupLoaders(mockWindow)

      const elements = [
        {
          dispatchEvent: jest.fn(),
        },
        {
          dispatchEvent: jest.fn(),
        },
      ]

      elements.forEach((element) => {
        deferredLoadImage(element)
        expect(element.dispatchEvent).not.toHaveBeenCalled()
      })
      mockWindow.onload()

      elements.forEach((element) => {
        expect(element.dispatchEvent).toHaveBeenCalledTimes(1)
      })
    })

    it('clears the image queue after loading', () => {
      const mockWindow = {}
      setupLoaders(mockWindow)

      const element = {
        dispatchEvent: jest.fn(),
      }
      deferredLoadImage(element)

      mockWindow.onload()
      expect(element.dispatchEvent).toHaveBeenCalledTimes(1)

      element.dispatchEvent.mockClear()
      mockWindow.onload()
      expect(element.dispatchEvent).toHaveBeenCalledTimes(0)
    })
  })
})
