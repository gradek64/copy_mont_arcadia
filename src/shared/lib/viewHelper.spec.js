import * as viewHelpers from './viewHelper'

describe('viewHelper', () => {
  describe('getViewport', () => {
    it('should return an object with the correct properties', () => {
      const viewPort = viewHelpers.getViewport()
      expect(viewPort.toString()).toBe('[object Object]')
      expect(viewPort).toHaveProperty('width')
      expect(viewPort).toHaveProperty('height')
    })
  })

  describe('touchDetection', () => {
    it('should return false when there is notouchstart or no maxTouchPoints', () => {
      expect(viewHelpers.touchDetection()).toBe(false)
    })

    it('should return false when maxTouchPoints is 0', () => {
      global.navigator.maxTouchPoints = 0
      expect(viewHelpers.touchDetection()).toBe(false)
    })

    it('should return true when maxTouchPoints are greater than 0', () => {
      global.navigator.maxTouchPoints = 1
      expect(viewHelpers.touchDetection()).toBe(true)
    })

    it('should return true when window has ontouchstart', () => {
      global.window.ontouchstart = true
      expect(viewHelpers.touchDetection()).toBe(true)
    })

    it('should return false when calls on server', () => {
      const originalWindow = global.window
      delete global.window
      expect(viewHelpers.touchDetection()).toBe(false)
      global.window = originalWindow
    })
  })
})
