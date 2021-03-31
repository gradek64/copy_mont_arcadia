import {
  isLandscape,
  isMobile,
  isDesktop,
  isTablet,
  isMinViewPort,
  isMaxViewPort,
  isPortrait,
  getWindowWidth,
  getWindowHeight,
  isMobileBreakpoint,
  getViewportMedia,
} from '../viewportSelectors'

describe('Viewport Selectors', () => {
  const stateEmpty = {
    viewport: {
      media: '',
    },
  }
  const stateMobile = {
    viewport: {
      media: 'mobile',
      width: 400,
    },
  }
  const stateTablet = {
    viewport: {
      media: 'tablet',
      width: 767,
    },
  }
  const stateLaptop = {
    viewport: {
      media: 'laptop',
      width: 1200,
    },
  }
  const stateDesktop = {
    viewport: {
      media: 'desktop',
    },
  }
  const statePortrait = {
    viewport: {
      width: 400,
      height: 600,
    },
  }
  const stateLandscape = {
    viewport: {
      width: 600,
      height: 400,
    },
  }
  const stateSquare = {
    viewport: {
      width: 400,
      height: 400,
    },
  }

  describe('getWindowWidth', () => {
    it('should return viewport width', () => {
      expect(getWindowWidth({ viewport: { width: 10 } })).toBe(10)
    })
    it('should return 0 by default', () => {
      expect(getWindowWidth({})).toBe(0)
    })
  })
  describe('getWindowHeight', () => {
    it('should return viewport height', () => {
      expect(getWindowHeight({ viewport: { height: 10 } })).toBe(10)
    })
    it('should return 0 by default', () => {
      expect(getWindowHeight({})).toBe(0)
    })
  })

  describe('isMobile(state)', () => {
    it('should return false if path doesn’t exist', () => {
      expect(isMobile({})).toBe(false)
    })
    it('should return false if viewport is empty', () => {
      expect(isMobile(stateEmpty)).toBe(false)
    })
    it('should return true if the viewport is a mobile viewport', () => {
      expect(isMobile(stateMobile)).toBe(true)
    })
    it('should return false if the viewport is a tablet viewport', () => {
      expect(isMobile(stateTablet)).toBe(false)
    })
    it('should return false if the viewport is a laptop viewport', () => {
      expect(isMobile(stateLaptop)).toBe(false)
    })
    it('should return false if the viewport is a desktop viewport', () => {
      expect(isMobile(stateDesktop)).toBe(false)
    })
  })

  describe(isMobileBreakpoint.name, () => {
    it('should return true when the viewport width is less than the mobile max breakpoint', () => {
      expect(isMobileBreakpoint(stateMobile)).toBe(true)
    })

    it('should return true when the viewport width is equal to the mobile max breakpoint', () => {
      expect(isMobileBreakpoint(stateTablet)).toBe(true)
    })

    it('should return false when the viewport width is greater than the mobile max breakpoint', () => {
      expect(isMobileBreakpoint(stateLaptop)).toBe(false)
    })
  })

  describe('isDesktop(state)', () => {
    it('should return false if path doesn’t exist', () => {
      expect(isDesktop({})).toBe(false)
    })
    it('should return false if viewport is empty', () => {
      expect(isDesktop(stateEmpty)).toBe(false)
    })
    it('should return false if the viewport is a mobile viewport', () => {
      expect(isDesktop(stateMobile)).toBe(false)
    })
    it('should return false if the viewport is a tablet viewport', () => {
      expect(isDesktop(stateTablet)).toBe(false)
    })
    it('should return false if the viewport is a laptop viewport', () => {
      expect(isDesktop(stateLaptop)).toBe(false)
    })
    it('should return true if the viewport is a desktop viewport', () => {
      expect(isDesktop(stateDesktop)).toBe(true)
    })
  })

  describe('isTablet(state)', () => {
    it('should return false if path doesn’t exist', () => {
      expect(isTablet({})).toBe(false)
    })
    it('should return false if viewport is empty', () => {
      expect(isTablet(stateEmpty)).toBe(false)
    })
    it('should return false if the viewport is a mobile viewport', () => {
      expect(isTablet(stateMobile)).toBe(false)
    })
    it('should return true if the viewport is a tablet viewport', () => {
      expect(isTablet(stateTablet)).toBe(true)
    })
    it('should return false if the viewport is a laptop viewport', () => {
      expect(isTablet(stateLaptop)).toBe(false)
    })
    it('should return false if the viewport is a desktop viewport', () => {
      expect(isTablet(stateDesktop)).toBe(false)
    })
  })

  describe('isMinViewPort(state)(viewPortName)', () => {
    it('should return false if path doesn’t exist', () => {
      expect(isMinViewPort('')(jest.fn(), () => {})).toBe(false)
    })
    it('should return false if viewport is empty', () => {
      expect(isMinViewPort('')(jest.fn(), () => stateEmpty)).toBe(false)
    })
    it('should return false if viewport is empty', () => {
      expect(isMinViewPort('laptop')(jest.fn(), () => stateEmpty)).toBe(false)
    })
    describe('Min = mobile', () => {
      const minViewPort = 'mobile'
      it('should return true if the viewport is a mobile viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateMobile)).toBe(
          true
        )
      })
      it('should return true if the viewport is a tablet viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateTablet)).toBe(
          true
        )
      })
      it('should return true if the viewport is a laptop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateLaptop)).toBe(
          true
        )
      })
      it('should return true if the viewport is a desktop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateDesktop)).toBe(
          true
        )
      })
    })
    describe('Min = tablet', () => {
      const minViewPort = 'tablet'
      it('should return false if the viewport is a mobile viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateMobile)).toBe(
          false
        )
      })
      it('should return true if the viewport is a tablet viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateTablet)).toBe(
          true
        )
      })
      it('should return true if the viewport is a laptop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateLaptop)).toBe(
          true
        )
      })
      it('should return true if the viewport is a desktop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateDesktop)).toBe(
          true
        )
      })
    })
    describe('Min = laptop', () => {
      const minViewPort = 'laptop'
      it('should return false if the viewport is a mobile viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateMobile)).toBe(
          false
        )
      })
      it('should return false if the viewport is a tablet viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateTablet)).toBe(
          false
        )
      })
      it('should return true if the viewport is a laptop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateLaptop)).toBe(
          true
        )
      })
      it('should return true if the viewport is a desktop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateDesktop)).toBe(
          true
        )
      })
    })
    describe('Min = desktop', () => {
      const minViewPort = 'desktop'
      it('should return false if the viewport is a mobile viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateMobile)).toBe(
          false
        )
      })
      it('should return false if the viewport is a tablet viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateTablet)).toBe(
          false
        )
      })
      it('should return false if the viewport is a laptop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateLaptop)).toBe(
          false
        )
      })
      it('should return true if the viewport is a desktop viewport', () => {
        expect(isMinViewPort(minViewPort)(jest.fn(), () => stateDesktop)).toBe(
          true
        )
      })
    })
  })

  describe('isMaxViewPort(state, viewPortName)', () => {
    it('should return false if path doesn’t exist', () => {
      expect(isMaxViewPort({})('')).toBe(false)
    })
    it('should return false if viewport is empty', () => {
      expect(isMaxViewPort(stateEmpty)('')).toBe(false)
    })
    it('should return false if viewport is empty', () => {
      expect(isMaxViewPort(stateEmpty)('tablet')).toBe(false)
    })
    describe('Max = mobile', () => {
      const maxViewPort = 'mobile'
      it('should return true if the viewport is a mobile viewport', () => {
        expect(isMaxViewPort(stateMobile)(maxViewPort)).toBe(true)
      })
      it('should return false if the viewport is a tablet viewport', () => {
        expect(isMaxViewPort(stateTablet)(maxViewPort)).toBe(false)
      })
      it('should return false if the viewport is a laptop viewport', () => {
        expect(isMaxViewPort(stateLaptop)(maxViewPort)).toBe(false)
      })
      it('should return false if the viewport is a desktop viewport', () => {
        expect(isMaxViewPort(stateDesktop)(maxViewPort)).toBe(false)
      })
    })
    describe('Max = tablet', () => {
      const maxViewPort = 'tablet'
      it('should return true if the viewport is a mobile viewport', () => {
        expect(isMaxViewPort(stateMobile)(maxViewPort)).toBe(true)
      })
      it('should return true if the viewport is a tablet viewport', () => {
        expect(isMaxViewPort(stateTablet)(maxViewPort)).toBe(true)
      })
      it('should return false if the viewport is a laptop viewport', () => {
        expect(isMaxViewPort(stateLaptop)(maxViewPort)).toBe(false)
      })
      it('should return false if the viewport is a desktop viewport', () => {
        expect(isMaxViewPort(stateDesktop)(maxViewPort)).toBe(false)
      })
    })
    describe('Max = laptop', () => {
      const maxViewPort = 'laptop'
      it('should return true if the viewport is a mobile viewport', () => {
        expect(isMaxViewPort(stateMobile)(maxViewPort)).toBe(true)
      })
      it('should return true if the viewport is a tablet viewport', () => {
        expect(isMaxViewPort(stateTablet)(maxViewPort)).toBe(true)
      })
      it('should return true if the viewport is a laptop viewport', () => {
        expect(isMaxViewPort(stateLaptop)(maxViewPort)).toBe(true)
      })
      it('should return false if the viewport is a desktop viewport', () => {
        expect(isMaxViewPort(stateDesktop)(maxViewPort)).toBe(false)
      })
    })
    describe('Max = desktop', () => {
      const maxViewPort = 'desktop'
      it('should return true if the viewport is a mobile viewport', () => {
        expect(isMaxViewPort(stateMobile)(maxViewPort)).toBe(true)
      })
      it('should return true if the viewport is a tablet viewport', () => {
        expect(isMaxViewPort(stateTablet)(maxViewPort)).toBe(true)
      })
      it('should return true if the viewport is a laptop viewport', () => {
        expect(isMaxViewPort(stateLaptop)(maxViewPort)).toBe(true)
      })
      it('should return true if the viewport is a desktop viewport', () => {
        expect(isMaxViewPort(stateDesktop)(maxViewPort)).toBe(true)
      })
    })
  })
  describe('getViewportMedia()', () => {
    it('should return the current viewport value', () => {
      expect(getViewportMedia(stateTablet)).toBe('tablet')
    })
  })
  describe('isPortrait', () => {
    it('should return true if height > width', () => {
      expect(isPortrait(statePortrait)).toBe(true)
    })
    it('should return false if width > height', () => {
      expect(isPortrait(stateLandscape)).toBe(false)
    })
    it('should return true if height == width', () => {
      expect(isPortrait(stateSquare)).toBe(true)
    })
    it('should return true by default', () => {
      expect(isPortrait({})).toBe(true)
    })
  })
  describe('isLandscape', () => {
    it('should return true if width > height', () => {
      expect(isLandscape(stateLandscape)).toBe(true)
    })
    it('should return false if height > width', () => {
      expect(isLandscape(statePortrait)).toBe(false)
    })
    it('should return false if height == width', () => {
      expect(isLandscape(stateSquare)).toBe(false)
    })
  })
})
