import testComponentHelper from 'test/unit/helpers/test-component'
import ContactBanner from '../ContactBanner'
import Espot from '../../../containers/Espot/Espot'

describe('<ContactBanner />', () => {
  const renderComponent = testComponentHelper(ContactBanner.WrappedComponent)

  describe('@LifeCycle', () => {
    describe('UNSAFE_componentWillReceiveProps', () => {
      describe('When viewport change from mobile to tablet/desktop', () => {
        describe('And FEATURE_CONTACT_BANNER flag is enabled', () => {
          it('should call getContactBanner', () => {
            const getContactBannerMock = jest.fn()
            const { wrapper } = renderComponent({
              isContactBannerExperienceEnabled: true,
              isMobile: true,
              getContactBanner: getContactBannerMock,
            })

            expect(getContactBannerMock).toHaveBeenCalledTimes(0)
            wrapper.setProps({ isMobile: false })
            expect(getContactBannerMock).toHaveBeenCalledTimes(1)
          })
        })

        describe('And FEATURE_CONTACT_BANNER flag is not enabled', () => {
          it('should not call getContactBanner', () => {
            const getContactBannerMock = jest.fn()
            const { wrapper } = renderComponent({
              isContactBannerExperienceEnabled: false,
              isMobile: true,
              getContactBanner: getContactBannerMock,
            })

            expect(getContactBannerMock).toHaveBeenCalledTimes(0)
            wrapper.setProps({ isMobile: false })
            expect(getContactBannerMock).toHaveBeenCalledTimes(0)
          })
        })
      })
    })

    describe('componentDidMount', () => {
      describe('When viewport is mobile', () => {
        it('should not call getContactBanner', () => {
          const getContactBannerMock = jest.fn()
          const { wrapper } = renderComponent({
            isContactBannerExperienceEnabled: true,
            isMobile: true,
            getContactBanner: getContactBannerMock,
          })

          wrapper.instance().componentDidMount()
          expect(getContactBannerMock).toHaveBeenCalledTimes(0)
        })
      })
      describe('Viewport is tablet/desktop', () => {
        it('should call getContactBanner', () => {
          const getContactBannerMock = jest.fn()
          const { wrapper } = renderComponent({
            isContactBannerExperienceEnabled: true,
            isMobile: false,
            getContactBanner: getContactBannerMock,
          })

          expect(getContactBannerMock).toHaveBeenCalledTimes(0)
          wrapper.instance().componentDidMount()
          expect(getContactBannerMock).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('@render', () => {
    describe('FEATURE_CONTACT_BANNER is enabled', () => {
      describe('And it s mobile', () => {
        it('should return null', () => {
          const { wrapper } = renderComponent({
            isContactBannerExperienceEnabled: true,
            isMobile: true,
          })

          expect(wrapper.html()).toBe(null)
        })
      })

      describe('And it s desktop or tablet', () => {
        it('should render the CONTACT_BANNER espot', () => {
          const { wrapper } = renderComponent({
            isContactBannerExperienceEnabled: true,
            isMobile: false,
          })

          expect(wrapper.find(Espot).length).toBe(1)
        })
      })
    })

    describe('FEATURE_CONTACT_BANNER is not enabled', () => {
      it('should return null', () => {
        const { wrapper } = renderComponent({
          isContactBannerExperienceEnabled: false,
          isMobile: true,
        })

        expect(wrapper.html()).toBe(null)
      })
    })
  })
})
