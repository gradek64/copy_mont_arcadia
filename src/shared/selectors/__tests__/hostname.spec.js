import {
  isHostnameMobileMainDev,
  isHostnameDesktopMainDev,
} from '../hostnameSelectors'

describe('hostname selectors', () => {
  const trueState = {
    hostname: {
      isMobileMainDev: true,
      isDesktopMainDev: true,
    },
  }
  const falseState = {
    hostname: {
      isMobileMainDev: false,
      isDesktopMainDev: false,
    },
  }

  describe('#isHostnameMobileMainDev', () => {
    it('should get the correct value', () => {
      expect(isHostnameMobileMainDev(trueState)).toBe(true)
      expect(isHostnameMobileMainDev(falseState)).toBe(false)
    })
  })

  describe('#isHostnameDesktopMainDev', () => {
    it('should get the correct value', () => {
      expect(isHostnameDesktopMainDev(trueState)).toBe(true)
      expect(isHostnameDesktopMainDev(falseState)).toBe(false)
    })
  })
})
