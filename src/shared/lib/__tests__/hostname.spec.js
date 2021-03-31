import {
  isMobileHostname,
  isDesktopMainDevHostname,
  isMobileMainDevHostname,
} from '../hostname'

describe('hostname utils', () => {
  describe('#isMobileHostname', () => {
    it('returns false if the argument is not a string or empty string', () => {
      expect(isMobileHostname()).toEqual(false)
      expect(isMobileHostname('')).toEqual(false)
    })
    it('returns true for hostnames starting with m. or local.m.', () => {
      expect(isMobileHostname('m.whatever.com')).toEqual(true)
      expect(isMobileHostname('local.m.whatever.com')).toEqual(true)
    })
    it('returns false for hostnames starting with www. or local.www.', () => {
      expect(isMobileHostname('www.whatever.com')).toEqual(false)
      expect(isMobileHostname('local.www.whatever.com')).toEqual(false)
    })
  })

  describe('#isDesktopMainDevHostname', () => {
    it('should return false if the given string is does not include `arcadiagroup.ltd.uk`', () => {
      expect(isDesktopMainDevHostname('www.whatever.com')).toBe(false)
    })

    it('should return true if the given string does include `arcadiagroup.ltd.uk`', () => {
      expect(
        isDesktopMainDevHostname(
          'ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/62M65IPLM_small.jpg'
        )
      ).toBe(true)
    })
  })

  describe('#isMobileMainDevHostname', () => {
    it('should return false if the given string is does not include `digital.arcadiagroup.co.uk`', () => {
      expect(isMobileMainDevHostname('www.whatever.com')).toBe(false)
    })

    it('should return true if the given string does include `digital.arcadiagroup.co.uk`', () => {
      expect(
        isMobileMainDevHostname(
          'ts-acc1.acc.digital.arcadiagroup.co.uk/en/tsuk/product/mid-blue-jamie-jeans-7947602'
        )
      ).toBe(true)
    })
  })
})
