import isForceMobileHeader from '../isForceMobileHeader'

describe('isForceMobileHeader', () => {
  const defaultParams = {
    isTablet: false,
    isPortrait: false,
    language: 'en',
    brandCode: 'dp',
  }
  describe('english', () => {
    it('false by default', () => {
      const params = {
        ...defaultParams,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when portrait', () => {
      const params = {
        ...defaultParams,
        isPortrait: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when sticky', () => {
      const params = {
        ...defaultParams,
        sticky: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet', () => {
      const params = {
        ...defaultParams,
        isTablet: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet, sticky and portrait', () => {
      const params = {
        ...defaultParams,
        isTablet: true,
        sticky: true,
        isPortrait: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when topshop, tablet, sticky and portrait', () => {
      const params = {
        ...defaultParams,
        isTablet: true,
        sticky: true,
        isPortrait: true,
        brandCode: 'ts',
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
  })
  describe('french', () => {
    const language = 'fr'
    it('false by default', () => {
      const params = {
        ...defaultParams,
        language,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when portrait', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when sticky', () => {
      const params = {
        ...defaultParams,
        language,
        sticky: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet', () => {
      const params = {
        ...defaultParams,
        language: 'fr',
        isPortrait: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet and portrait', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet, portrait and sticky', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
        sticky: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('true when topshop, tablet, portrait and sticky', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
        sticky: true,
        brandCode: 'ts',
      }
      expect(isForceMobileHeader(params)).toBe(true)
    })
    it('true when topman, tablet, portrait and sticky', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
        sticky: true,
        brandCode: 'tm',
      }
      expect(isForceMobileHeader(params)).toBe(true)
    })
  })
  describe('german', () => {
    const language = 'de'
    it('false by default', () => {
      const params = {
        ...defaultParams,
        language,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when portrait', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when sticky', () => {
      const params = {
        ...defaultParams,
        language,
        sticky: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet', () => {
      const params = {
        ...defaultParams,
        language: 'fr',
        isPortrait: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet and portrait', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('false when tablet, portrait and sticky', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
        sticky: true,
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
    it('true when topshop, tablet, portrait and sticky', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
        sticky: true,
        brandCode: 'ts',
      }
      expect(isForceMobileHeader(params)).toBe(true)
    })
    it('false when topman, tablet, portrait and sticky', () => {
      const params = {
        ...defaultParams,
        language,
        isPortrait: true,
        isTablet: true,
        sticky: true,
        brandCode: 'tm',
      }
      expect(isForceMobileHeader(params)).toBe(false)
    })
  })
})
