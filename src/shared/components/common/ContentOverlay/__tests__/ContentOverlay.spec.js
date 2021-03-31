import testComponentHelper from 'test/unit/helpers/test-component'

import ContentOverlay from '../ContentOverlay'

const noop = () => {}

describe('<ContentOverlay/>', () => {
  const requiredProps = {
    toggleTopNavMenu: noop,
    toggleProductsSearchBar: noop,
    closeMiniBag: noop,
    setTimeout: noop,
    hideSizeGuide: noop,
    sizeGuideOpen: true,
    onModalCancelled: noop,
    onClick: jest.fn(),
    drawerOpen: false,
    isMobile: false,
    modalOpen: false,
    isIos: false,
  }

  const renderComponent = testComponentHelper(ContentOverlay.WrappedComponent)

  let originalBodyClass
  beforeEach(() => {
    originalBodyClass = document.body.className
  })
  afterEach(() => {
    document.body.className = originalBodyClass
  })

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should have `ContentOverlay--modalOpen` class if `modalOpen` prop is `true`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        modalOpen: true,
      })
      expect(
        wrapper.find('.ContentOverlay').hasClass('ContentOverlay--modalOpen')
      ).toBe(true)
    })

    it('should not have `is-hidden` class if `showOverlay` prop is `true`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        showOverlay: true,
      })
      expect(wrapper.find('.ContentOverlay').hasClass('is-hidden')).toBe(false)
    })
  })

  describe('@events', () => {
    describe('onClick', () => {
      it('should not call `onClick` prop when overlay is closed', () => {
        const { wrapper } = renderComponent(requiredProps)
        wrapper.find('div').simulate('click')
        expect(requiredProps.onClick).not.toHaveBeenCalled()
      })

      describe('if `showOverlay` prop is `true', () => {
        it('should call `onClick` prop', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            showOverlay: true,
          })
          wrapper.find('div').simulate('click')
          expect(requiredProps.onClick).toHaveBeenCalled()
        })

        it('should stop event propagation', () => {
          const stopPropagationMock = jest.fn()
          const { wrapper } = renderComponent({
            ...requiredProps,
            showOverlay: true,
          })
          wrapper.find('.ContentOverlay').prop('onClick')({
            stopPropagation: stopPropagationMock,
          })
          expect(stopPropagationMock).toHaveBeenCalled()
        })

        describe('`toggleTopNavMenu`', () => {
          it('should not be called by default', () => {
            const setTimeoutMock = jest.fn((fn) => fn())
            const toggleTopNavMenuMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              setTimeout: setTimeoutMock,
              toggleTopNavMenu: toggleTopNavMenuMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(toggleTopNavMenuMock).not.toHaveBeenCalled()
          })

          it('should be called after `10` milliseconds if `topNavMenuOpen` prop is `true`', () => {
            const setTimeoutMock = jest.fn((fn) => fn())
            const toggleTopNavMenuMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              topNavMenuOpen: true,
              setTimeout: setTimeoutMock,
              toggleTopNavMenu: toggleTopNavMenuMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(setTimeoutMock.mock.calls[0][1]).toBe(10)
            expect(toggleTopNavMenuMock).toHaveBeenCalled()
          })
        })

        describe('`toggleProductsSearchBar`', () => {
          it('should not be called by default', () => {
            const toggleProductsSearchBarMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              toggleProductsSearchBar: toggleProductsSearchBarMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(toggleProductsSearchBarMock).not.toHaveBeenCalled()
          })

          it('should be called if `productsSearchOpen` prop is `true`', () => {
            const toggleProductsSearchBarMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              productsSearchOpen: true,
              toggleProductsSearchBar: toggleProductsSearchBarMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(toggleProductsSearchBarMock).toHaveBeenCalled()
          })
        })

        describe('clearMovingProductToWishlist', () => {
          it('should not be called by default', () => {
            const clearMovingProductToWishlist = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              clearMovingProductToWishlist,
              isMovingProductToWishlist: false,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(clearMovingProductToWishlist).not.toHaveBeenCalled()
          })

          it('should be called if `isMovingProductToWishlist` is true', () => {
            const clearMovingProductToWishlist = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              clearMovingProductToWishlist,
              isMovingProductToWishlist: true,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(clearMovingProductToWishlist).toHaveBeenCalled()
          })
        })

        describe('`sizeGuide`', () => {
          it('should not be called by default', () => {
            const setTimeoutMock = jest.fn((fn) => fn())
            const hideSizeGuideMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              sizeGuideOpen: false,
              setTimeout: setTimeoutMock,
              hideSizeGuide: hideSizeGuideMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(hideSizeGuideMock).not.toHaveBeenCalled()
          })

          it('should be called after `10` milliseconds if `topNavMenuOpen` prop is `true`', () => {
            const setTimeoutMock = jest.fn((fn) => fn())
            const hideSizeGuideMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              sizeGuideOpen: true,
              setTimeout: setTimeoutMock,
              hideSizeGuide: hideSizeGuideMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(setTimeoutMock.mock.calls[0][1]).toBe(10)
            expect(hideSizeGuideMock).toHaveBeenCalled()
          })
        })

        describe('closeMiniBag', () => {
          it('should be called after `10` milliseconds by default', () => {
            const setTimeoutMock = jest.fn((fn) => fn())
            const closeMiniBagMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              setTimeout: setTimeoutMock,
              closeMiniBag: closeMiniBagMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(setTimeoutMock.mock.calls[0][1]).toBe(10)
            expect(closeMiniBagMock).toHaveBeenCalled()
          })

          it('should not be called after if `modalOpen` is `true`', () => {
            const setTimeoutMock = jest.fn((fn) => fn())
            const closeMiniBagMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              modalOpen: true,
              setTimeout: setTimeoutMock,
              closeMiniBag: closeMiniBagMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(closeMiniBagMock).not.toHaveBeenCalled()
          })
        })

        describe('setModalCancelled', () => {
          it('should be called if `modalOpen` is true', () => {
            const setModalCancelledMock = jest.fn()
            const { wrapper } = renderComponent({
              ...requiredProps,
              showOverlay: true,
              modalOpen: true,
              setModalCancelled: setModalCancelledMock,
            })
            wrapper.find('.ContentOverlay').prop('onClick')()
            expect(setModalCancelledMock).toHaveBeenCalledWith(true)
          })
        })
      })
    })
  })

  describe('prevent scrolling toggle', () => {
    it('should add not-scrollable class to body if modal open', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        modalOpen: false,
        isDrawerOpen: false,
      })
      expect(document.body.className).toBe('')
      wrapper.setProps({ modalOpen: true })
      wrapper.instance().componentDidUpdate({ modalOpen: false })
      expect(document.body.className).toEqual('not-scrollable')
    })

    it('should add not-scrollable class to body if drawer open', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        modalOpen: false,
        isDrawerOpen: false,
      })
      expect(document.body.className).toBe('')
      wrapper.setProps({ isDrawerOpen: true })
      wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
      expect(document.body.className).toEqual('not-scrollable')
    })

    it('should remove not-scrollable class from body if modal closed', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        modalOpen: true,
        isDrawerOpen: false,
      })
      wrapper.setProps({ modalOpen: false })
      wrapper.instance().componentDidUpdate({ modalOpen: true })
      expect(document.body.className).toEqual('')
    })
    it('should not remove not-scrollable class from body if modal and drawer open together then modal closes', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        modalOpen: true,
        isDrawerOpen: true,
      })
      wrapper.setProps({ modalOpen: false })
      wrapper.instance().componentDidUpdate({ modalOpen: true })
      expect(document.body.className).toEqual('not-scrollable')
    })
    describe('when on IOS device and on mobile', () => {
      it('should add ios class to body if modal open', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isDrawerOpen: false,
          isIos: true,
          isMobile: true,
        })
        expect(document.body.className).toBe('')
        wrapper.setProps({ modalOpen: true })
        wrapper.instance().componentDidUpdate({ modalOpen: false })
        expect(document.body.className).toEqual('not-scrollable ios')
      })

      it('should add ios class to body if drawer open', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isDrawerOpen: false,
          isIos: true,
          isMobile: true,
        })
        expect(document.body.className).toBe('')
        wrapper.setProps({ isDrawerOpen: true })
        wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
        expect(document.body.className).toEqual('not-scrollable ios')
      })

      it('should remove ios class from body if modal closed', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: true,
          isDrawerOpen: false,
          isIos: true,
          isMobile: true,
        })
        wrapper.setProps({ modalOpen: false })
        wrapper.instance().componentDidUpdate({ modalOpen: true })
        expect(document.body.className).toEqual('')
      })

      it('should not remove ios class from body if modal and drawer open together then modal closes', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: true,
          isIos: true,
          isMobile: true,
        })
        wrapper.setProps({ modalOpen: false })
        wrapper.instance().componentDidUpdate({ modalOpen: true })
        expect(document.body.className).toEqual('not-scrollable ios')
      })
    })
    describe('when not IOS device and on mobile', () => {
      it('should not add ios class to body if modal open', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isDrawerOpen: false,
          isIos: false,
          isMobile: true,
        })
        expect(document.body.className).toBe('')
        wrapper.setProps({ modalOpen: true })
        wrapper.instance().componentDidUpdate({ modalOpen: false })
        expect(document.body.className).toEqual('not-scrollable')
      })

      it('should not add ios class to body if drawer open', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isDrawerOpen: false,
          isIos: false,
          isMobile: true,
        })
        expect(document.body.className).toBe('')
        wrapper.setProps({ isDrawerOpen: true })
        wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
        expect(document.body.className).toEqual('not-scrollable')
      })

      it('should not remove ios class from body if modal and drawer open together then modal closes', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: true,
          isIos: false,
          isMobile: true,
        })
        wrapper.setProps({ modalOpen: false })
        wrapper.instance().componentDidUpdate({ modalOpen: true })
        expect(document.body.className).toEqual('not-scrollable')
      })
    })
    describe('when on IOS device and NOT on mobile', () => {
      it('should not add ios class to body if modal open', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isDrawerOpen: false,
          isIos: true,
          isMobile: false,
        })
        expect(document.body.className).toBe('')
        wrapper.setProps({ modalOpen: true })
        wrapper.instance().componentDidUpdate({ modalOpen: false })
        expect(document.body.className).toEqual('not-scrollable')
      })

      it('should not add ios class to body if drawer open', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isDrawerOpen: false,
          isIos: true,
          isMobile: false,
        })
        expect(document.body.className).toBe('')
        wrapper.setProps({ isDrawerOpen: true })
        wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
        expect(document.body.className).toEqual('not-scrollable')
      })

      it('should not remove ios class from body if modal and drawer open together then modal closes', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: true,
          isIos: true,
          isMobile: false,
        })
        wrapper.setProps({ modalOpen: false })
        wrapper.instance().componentDidUpdate({ modalOpen: true })
        expect(document.body.className).toEqual('not-scrollable')
      })
    })
  })

  describe('on shouldComponentUpdate', () => {
    afterAll(() => {
      process.browser = true
    })

    it('returns TRUE by default', () => {
      const { wrapper, instance } = renderComponent(requiredProps)
      wrapper.setProps({ isDrawerOpen: true })
      expect(instance.shouldComponentUpdate({ isDrawerOpen: false })).toBe(true)
    })
    it('returns FALSE if its server side', () => {
      const { wrapper, instance } = renderComponent(requiredProps)
      process.browser = false
      wrapper.setProps({ isDrawerOpen: true })
      expect(instance.shouldComponentUpdate({ isDrawerOpen: false })).toBe(
        false
      )
    })
  })

  describe('on componentDidUpdate', () => {
    let originalDocument
    let originalWindowScrollY
    let originalScrollTo
    beforeAll(() => {
      originalDocument = global.document
      originalWindowScrollY = global.window.scrollY
      originalScrollTo = global.window.scrollTo
    })

    afterAll(() => {
      global.document = originalDocument
      global.window.scrollY = originalWindowScrollY
      global.window.scrollTo = originalScrollTo
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('drawer is opened', () => {
      it('should add not-scrollable class to body if drawer open', () => {
        const { wrapper } = renderComponent(requiredProps)
        expect(document.body.className).toBe('')
        wrapper.setProps({ isDrawerOpen: true })
        wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
        expect(document.body.className).toEqual('not-scrollable')
      })

      describe('when on mobile', () => {
        describe('when on IOS device', () => {
          it('should set body top to the previous window.scrollY value', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              isDrawerOpen: false,
              isMobile: true,
              isIos: true,
            })
            window.scrollY = 999
            document.body.style.top = ''
            wrapper.setProps({ isDrawerOpen: true })
            wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
            expect(document.body.style.top).toEqual('-999px')
          })
        })

        describe('when NOT on IOS device', () => {
          it('should NOT set body top to the previous window.scrollY value', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              isDrawerOpen: false,
              isMobile: true,
              isIos: false,
            })
            window.scrollY = 999
            document.body.style.top = ''
            wrapper.setProps({ isDrawerOpen: true })
            wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
            expect(document.body.style.top).toEqual('')
          })
        })
      })

      describe('when NOT mobile', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          isDrawerOpen: false,
          isMobile: false,
        })

        it('should NOT set body top to the previous window.scrollY value', () => {
          window.scrollY = 999
          document.body.style.top = ''
          wrapper.setProps({ isDrawerOpen: true })
          wrapper.instance().componentDidUpdate({ isDrawerOpen: false })
          expect(document.body.style.top).toEqual('')
        })
      })
    })

    describe('drawer is closed', () => {
      it('should remove not-scrollable class from body if drawer closed', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isDrawerOpen: true,
        })
        document.body.className = 'not-scrollable'
        expect(document.body.className).toBe('not-scrollable')
        wrapper.setProps({ isDrawerOpen: false })
        wrapper.instance().componentDidUpdate({ isDrawerOpen: true })
        expect(document.body.className).toEqual('')
      })

      describe('when on mobile', () => {
        global.window.scrollTo = jest.fn()

        describe('when on IOS device', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            isDrawerOpen: true,
            isMobile: true,
            isIos: true,
          })

          it('should revert body top back to 0 if on IOS device', () => {
            document.body.style.top = '-9999px'
            wrapper.setProps({ isDrawerOpen: false })
            wrapper.instance().componentDidUpdate({ isDrawerOpen: true })
            expect(document.body.style.top).toEqual('')
          })

          it('should scroll body to a negative value of lastKnownScrollPosition if on IOS device', () => {
            document.body.className = 'not-scrollable'
            wrapper.setState({ lastKnownScrollPosition: 123 })
            wrapper.setProps({ isDrawerOpen: false })
            wrapper.instance().componentDidUpdate({ isDrawerOpen: true })
            expect(global.window.scrollTo).toBeCalledWith(0, 123)
          })
        })

        describe('when NOT on IOS device', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            isDrawerOpen: true,
            isMobile: true,
            isIos: false,
          })

          it('should NOT revert body top back to 0 if not on IOS device', () => {
            document.body.style.top = '-9999px'
            wrapper.setProps({ isDrawerOpen: false })
            wrapper.instance().componentDidUpdate({ isDrawerOpen: true })

            expect(document.body.style.top).toEqual('-9999px')
          })

          it('should scroll to lastKnownScrollPosition', () => {
            document.body.className = 'not-scrollable'
            wrapper.setState({ lastKnownScrollPosition: 123 })
            wrapper.setProps({ isDrawerOpen: false })
            wrapper.instance().componentDidUpdate({ isDrawerOpen: true })
            expect(global.window.scrollTo).toBeCalled()
          })
        })
      })

      describe('when NOT mobile', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          isDrawerOpen: true,
          isMobile: false,
        })

        it('should NOT revert body top back to 0', () => {
          document.body.style.top = '-9999px'
          wrapper.setProps({ isDrawerOpen: false })
          wrapper.instance().componentDidUpdate({ isDrawerOpen: true })

          expect(document.body.style.top).toEqual('-9999px')
        })

        it('should NOT scroll body to a negative value of lastKnownScrollPosition', () => {
          document.body.className = 'not-scrollable'
          wrapper.setState({ lastKnownScrollPosition: 123 })
          wrapper.setProps({ isDrawerOpen: false })
          wrapper.instance().componentDidUpdate({ isDrawerOpen: true })
          expect(global.window.scrollTo).not.toBeCalled()
        })
      })
    })
    describe('modal is opened', () => {
      it('should add not-scrollable class to body if modal open', () => {
        const { wrapper } = renderComponent(requiredProps)
        expect(document.body.className).toBe('')
        wrapper.setProps({ modalOpen: true })
        wrapper.instance().componentDidUpdate({ modalOpen: false })
        expect(document.body.className).toEqual('not-scrollable')
      })
      describe('when on mobile', () => {
        describe('when on IOS device', () => {
          it('should set body top to the previous window.scrollY value', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              modalOpen: false,
              isMobile: true,
              isIos: true,
            })
            window.scrollY = 999
            document.body.style.top = ''
            // to simulate drawer being opened we pass new props to `setProps`
            // and old props to componentDidUpdate
            wrapper.setProps({ modalOpen: true })
            wrapper.instance().componentDidUpdate({ modalOpen: false })
            expect(document.body.style.top).toEqual('-999px')
          })
        })

        describe('when NOT on IOS device', () => {
          it('should NOT set body top to the previous window.scrollY value', () => {
            const { wrapper } = renderComponent({
              ...requiredProps,
              modalOpen: false,
              isMobile: true,
              isIos: false,
            })
            window.scrollY = 999
            document.body.style.top = ''
            wrapper.setProps({ modalOpen: true })
            wrapper.instance().componentDidUpdate({ modalOpen: false })
            expect(document.body.style.top).toEqual('')
          })
        })
      })
      describe('when NOT mobile', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: false,
          isMobile: false,
        })

        it('should NOT set body top to the previous window.scrollY value', () => {
          window.scrollY = 999
          document.body.style.top = ''

          wrapper.setProps({ modalOpen: true })
          wrapper.instance().componentDidUpdate({ modalOpen: false })

          expect(document.body.style.top).toEqual('')
        })
      })
    })
    describe('modal is closed', () => {
      it('should remove not-scrollable class from body if modal closed', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: true,
          isDrawerOpen: false,
        })
        document.body.className = 'not-scrollable'
        expect(document.body.className).toBe('not-scrollable')
        wrapper.setProps({ modalOpen: false })
        wrapper.instance().componentDidUpdate({ modalOpen: true })
        expect(document.body.className).toEqual('')
      })

      describe('when on mobile', () => {
        global.window.scrollTo = jest.fn()
        describe('when on IOS device', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            modalOpen: true,
            isMobile: true,
            isIos: true,
          })

          it('should revert body top back to 0 if on IOS device', () => {
            document.body.style.top = '-9999px'
            wrapper.setProps({ modalOpen: false })
            wrapper.instance().componentDidUpdate({ modalOpen: true })
            expect(document.body.style.top).toEqual('')
          })

          it('should scroll body to a negative value of lastKnownScrollPosition if on IOS device', () => {
            document.body.className = 'not-scrollable'
            wrapper.setState({ lastKnownScrollPosition: 123 })
            wrapper.setProps({ modalOpen: false })
            wrapper.instance().componentDidUpdate({ modalOpen: true })
            expect(global.window.scrollTo).toBeCalledWith(0, 123)
          })
        })
        describe('when NOT on IOS device', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            modalOpen: true,
            isMobile: true,
            isIos: false,
          })
          it('should NOT revert body top back to 0 if not on IOS device', () => {
            document.body.style.top = '-9999px'
            wrapper.setProps({ modalOpen: false })
            wrapper.instance().componentDidUpdate({ modalOpen: true })
            expect(document.body.style.top).toEqual('-9999px')
          })

          it('should scroll body to lastKnownScrollPosition', () => {
            document.body.className = 'not-scrollable'
            wrapper.setState({ lastKnownScrollPosition: 123 })
            wrapper.setProps({ modalOpen: false })
            wrapper.instance().componentDidUpdate({ modalOpen: true })
            expect(global.window.scrollTo).toBeCalled()
          })
        })
      })

      describe('when NOT mobile', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: true,
          isMobile: false,
        })

        it('should NOT revert body top back to 0', () => {
          document.body.style.top = '-9999px'
          wrapper.setProps({ modalOpen: false })
          wrapper.instance().componentDidUpdate({ modalOpen: true })

          expect(document.body.style.top).toEqual('-9999px')
        })
        it('should NOT scroll body to a negative value of lastKnownScrollPosition', () => {
          document.body.className = 'not-scrollable'
          wrapper.setState({ lastKnownScrollPosition: 123 })
          wrapper.setProps({ modalOpen: false })
          wrapper.instance().componentDidUpdate({ modalOpen: true })
          expect(global.window.scrollTo).not.toBeCalled()
        })
      })
    })
    describe('modal is open and drawer is open', () => {
      it('should add not-scrollable class to body if modal and drawer both open', () => {
        const { wrapper } = renderComponent(requiredProps)
        expect(document.body.className).toBe('')
        wrapper.setProps({ modalOpen: true, isDrawerOpen: true })
        wrapper
          .instance()
          .componentDidUpdate({ modalOpen: false, isDrawerOpen: false })
        expect(document.body.className).toEqual('not-scrollable')
      })
      describe('when on mobile and its a browser', () => {
        process.browser = true
        window.scrollY = 999
        document.body.style.top = ''
        describe('when on IOS device', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            modalOpen: false,
            isDrawerOpen: false,
            isMobile: true,
            isIos: true,
          })

          it('should set body top to the previous window.scrollY value if both open', () => {
            wrapper.setProps({ modalOpen: true, isDrawerOpen: true })
            wrapper
              .instance()
              .componentDidUpdate({ modalOpen: false, isDrawerOpen: false })

            expect(document.body.style.top).toEqual('-999px')
          })
          describe('modal closed but drawer remains open', () => {
            it('should NOT revert body top back to 0', () => {
              document.body.style.top = '-9999px'
              wrapper.setProps({ modalOpen: false, isDrawerOpen: true })
              wrapper
                .instance()
                .componentDidUpdate({ modalOpen: true, isDrawerOpen: false })

              expect(document.body.style.top).toEqual('-999px')
            })

            it('should NOT revert body top back to 0 when modal closes but drawer remains, but then revert when the drawer closes', () => {
              document.body.style.top = '-9999px'
              wrapper.setProps({ modalOpen: false, isDrawerOpen: true })
              wrapper
                .instance()
                .componentDidUpdate({ modalOpen: true, isDrawerOpen: false })

              expect(document.body.style.top).toEqual('-999px')
              wrapper.setProps({ modalOpen: false, isDrawerOpen: false })
              wrapper
                .instance()
                .componentDidUpdate({ modalOpen: false, isDrawerOpen: true })
            })
          })
        })
        describe('when NOT on IOS device', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            modalOpen: false,
            isDrawerOpen: false,
            isMobile: true,
            isIos: false,
          })

          it('should NOT revert body top back to 0 if both open', () => {
            document.body.style.top = '-9999px'
            wrapper.setProps({ modalOpen: false, isDrawerOpen: false })
            wrapper
              .instance()
              .componentDidUpdate({ modalOpen: true, isDrawerOpen: true })

            expect(document.body.style.top).toEqual('-9999px')
          })

          it('should scroll body lastKnownScrollPosition if both open', () => {
            document.body.className = 'not-scrollable'
            wrapper.setState({ lastKnownScrollPosition: 123 })
            wrapper.setProps({ modalOpen: false, isDrawerOpen: false })
            wrapper
              .instance()
              .componentDidUpdate({ modalOpen: true, isDrawerOpen: true })
            expect(global.window.scrollTo).toBeCalled()
          })
        })
      })
      describe('when NOT mobile', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          modalOpen: true,
          isMobile: false,
          isDrawerOpen: true,
        })

        it('should NOT revert body top back to 0 if both open', () => {
          document.body.style.top = '-9999px'
          wrapper.setProps({ modalOpen: false, isDrawerOpen: false })
          wrapper
            .instance()
            .componentDidUpdate({ modalOpen: true, isDrawerOpen: true })

          expect(document.body.style.top).toEqual('-9999px')
        })
        it('should NOT scroll body to a negative value of lastKnownScrollPosition if both open', () => {
          document.body.className = 'not-scrollable'
          wrapper.setState({ lastKnownScrollPosition: 123 })
          wrapper.setProps({ modalOpen: false, isDrawerOpen: false })
          wrapper
            .instance()
            .componentDidUpdate({ modalOpen: true, isDrawerOpen: true })
          expect(global.window.scrollTo).not.toBeCalled()
        })
      })
    })
  })
})
