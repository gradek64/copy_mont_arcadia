import testComponentHelper from 'test/unit/helpers/test-component'
import CookieMessage from '../CookieMessage'
import cookieLinks from '../links.json'

describe('<CookieMessage/>', () => {
  const date = new Date()
  const initialProps = {
    brandName: 'topman',
    region: 'uk',
    envCookieMessage: true,
  }

  const renderComponent = testComponentHelper(CookieMessage.WrappedComponent)
  describe('@renders', () => {
    describe('when cookieManager feature flag is disabled', () => {
      it('should render cookie manager text with no adjust cookie preferences', () => {
        expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
      })
    })
    describe('when cookieManager feature flag is enabled', () => {
      const newprops = {
        ...initialProps,
        isCookieManagerEnabled: true,
      }
      it('should render cookie manager text with adjust cookie preferences', () => {
        expect(renderComponent(newprops).getTree()).toMatchSnapshot()
      })
    })
  })
  describe('@lifecycle', () => {
    describe('on componentDidMount', () => {
      it('should call readCookie method and display show cookie message if no cookie exists', () => {
        const renderedComponent = renderComponent(initialProps)
        const { wrapper } = renderedComponent
        wrapper.instance().componentDidMount()
        expect(wrapper.instance().state.showMessage).toEqual(true)
      })

      it('should not read cookie message if region is "us"', () => {
        const renderedComponent = renderComponent({
          ...initialProps,
          region: 'us',
        })
        const { wrapper } = renderedComponent
        wrapper.instance().componentDidMount()
        expect(wrapper.instance().state.showMessage).toEqual(false)
      })

      it('should not read cookie message if envCookieMessage is set to false', () => {
        const renderedComponent = renderComponent({
          ...initialProps,
          envCookieMessage: false,
        })
        const { wrapper } = renderedComponent
        wrapper.instance().componentDidMount()
        expect(wrapper.instance().state.showMessage).toEqual(false)
      })
      it('should not read the cookie if cookie mananager is enabled', () => {
        const renderedComponent = renderComponent({
          ...initialProps,
          isCookieManagerEnabled: true,
        })
        const { wrapper } = renderedComponent
        wrapper.instance().componentDidMount()
        expect(wrapper.instance().state.showMessage).toEqual(false)
      })
    })
  })

  describe('@events', () => {
    describe('Accept Cookie', () => {
      let renderedComponent = null
      beforeEach(() => {
        renderedComponent = renderComponent(initialProps)
      })
      it('should hide cookie message when user clicks accept cookie', () => {
        const { wrapper } = renderedComponent
        wrapper.instance().setState({
          showMessage: true,
        })
        wrapper
          .find('.Button')
          .shallow()
          .simulate('click')
        expect(wrapper.instance().state.showMessage).toEqual(false)
      })
    })
  })

  describe('@methods', () => {
    let renderedComponent
    beforeEach(() => {
      renderedComponent = renderComponent(initialProps)
    })

    describe('readCookie()', () => {
      it('should find the cookie and not display cookie message', () => {
        const { wrapper } = renderedComponent
        const args = {
          cookieID: wrapper.instance().state.cookieID,
          cookie:
            'source=CoreAPI; _qst_s=1;topman-cookie-message=111531486191701; _qsst_s=1526302200746',
        }

        expect(wrapper.instance().state.showMessage).toEqual(false)
        wrapper.instance().readCookie(args.cookieID, args.cookie)
        expect(wrapper.instance().state.showMessage).toEqual(false)
      })
    })

    describe('findCookieMessage()', () => {
      it('should return a cookieID and cookieMessage', () => {
        const { instance } = renderedComponent
        const expected = {
          cookieID: instance.state.cookieID,
          cookieMessage: ['topman-cookie-message=1531486191701'],
        }
        const args = {
          cookieID: instance.state.cookieID,
          cookie:
            'source=CoreAPI; _qst_s=1;topman-cookie-message=1531486191701; _qsst_s=1526302200746',
        }
        expect(instance.findCookieMessage(args.cookieID, args.cookie)).toEqual(
          expected
        )
      })

      it('should return a cookieID and a cookieMessage. cookieMessage will be an empty array', () => {
        const { instance } = renderedComponent
        const expected = {
          cookieID: instance.state.cookieID,
          cookieMessage: [],
        }
        const args = {
          cookieID: instance.state.cookieID,
          cookie: undefined,
        }
        expect(instance.findCookieMessage(args.cookieID, args.cookie)).toEqual(
          expected
        )
      })
    })

    describe('hasCookieMessageExpired()', () => {
      it('should return "true". Cookie does not exist and show cookie message', () => {
        const { instance } = renderedComponent
        const args = {
          currentDate: 0,
          expiryDate: 0,
          cookieMessage: [],
        }
        expect(instance.hasCookieMessageExpired(args)).toBeTruthy()
      })

      it('should return "false". Cookie message exists and has not expired. Do not show cookie message', () => {
        const { instance } = renderedComponent
        const currentDateTime = date.getTime() + 10000
        const args = {
          currentDate: 1526309428289,
          expiryDate: 1526409428288,
          cookieMessage: [`${instance.state.cookieID}${currentDateTime}`],
        }
        expect(instance.hasCookieMessageExpired(args)).toBeFalsy()
      })

      it('should return "true". Cookie has expired and show cookie message', () => {
        const { instance } = renderedComponent
        const currentDateTime = date.getTime() - 10000
        const args = {
          currentDate: 1526309428289,
          expiryDate: 1526309428288,
          cookieMessage: [`${instance.state.cookieID}${currentDateTime}`],
        }
        expect(instance.hasCookieMessageExpired(args)).toBeTruthy()
      })
    })

    describe('getExpiryDateTime()', () => {
      it('should return the expiry date in milliseconds', () => {
        const { instance } = renderedComponent
        const expected = {
          cookieID: instance.state.cookieID,
          cookieMessage: ['topman-cookie-message=1531486191701'],
          expiryDate: '1531486191701',
        }
        const args = {
          cookieID: instance.state.cookieID,
          cookieMessage: ['topman-cookie-message=1531486191701'],
        }

        expect(instance.getExpiryDateTime(args)).toEqual(expected)
      })
    })

    describe('getCurrentDateTime()', () => {
      it('should return the current date and time in milliseconds', () => {
        const { instance } = renderedComponent
        const expected = date.getTime()
        expect(instance.getCurrentDateTime().currentDate).toBeGreaterThan(
          expected
        )
      })
    })

    describe('convertDaysToMilliseconds()', () => {
      it('should return the number of milliseconds in 60 days', () => {
        const { instance } = renderedComponent
        const args = {
          daysToExpiry: instance.state.daysToExpiry,
          cookieID: instance.state.cookieID,
        }
        const expected = {
          cookieID: instance.state.cookieID,
          daysToExpiry: 5184000000,
        }
        expect(instance.convertDaysToMilliseconds(args)).toEqual(expected)
      })
    })

    describe('determineExpiryDate()', () => {
      it('should return the determined expiry date in milliseconds and cookieID', () => {
        const { instance } = renderedComponent
        const expected = {
          cookieID: instance.state.cookieID,
          expiryDate: 5184000000 + 1526309428288,
        }
        const args = {
          cookieID: instance.state.cookieID,
          currentDate: 1526309428288,
          daysToExpiry: 5184000000,
        }
        expect(instance.determineExpiryDate(args)).toEqual(expected)
      })
    })

    describe('createCookieMessage()', () => {
      it('should return false. Create cookie and then hide cookie message', () => {
        const { instance } = renderedComponent
        const args = {
          cookieID: instance.state.cookieID,
          expiryDate: 5184000000 + 1526309428288,
        }
        const expected = false
        expect(instance.createCookieMessage(args)).toEqual(expected)
      })
    })

    describe('acceptCookie()', () => {
      it('should return false. Accept cookie and close cookie message window', () => {
        const { wrapper } = renderedComponent
        const args1 = {
          cookieID: wrapper.instance().state.cookieID,
          cookie: 'source=CoreAPI; _qst_s=1; _qsst_s=1526302200746',
        }
        const args2 = {
          daysToExpiry: wrapper.instance().state.daysToExpiry,
          cookieID: wrapper.instance().state.cookieID,
        }
        expect(wrapper.instance().state.showMessage).toEqual(false)
        wrapper.instance().readCookie(args1.cookieID, args1.cookie)
        expect(wrapper.instance().state.showMessage).toEqual(true)
        wrapper.instance().acceptCookie(args2)
        expect(wrapper.instance().state.showMessage).toEqual(false)
      })
    })

    describe('getCookiePolicyLink()', () => {
      it('should return a cookie policy link', () => {
        const { wrapper } = renderedComponent
        const args = {
          brandName: 'topman',
          region: 'uk',
        }
        const expected = cookieLinks.topman.uk

        expect(
          wrapper.instance().getCookiePolicyLink(args.brandName, args.region)
        ).toEqual(expected)
      })
    })
  })
})
