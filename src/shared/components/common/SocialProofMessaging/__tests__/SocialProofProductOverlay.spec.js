import testComponentHelper from 'test/unit/helpers/test-component'
import SocialProofProductOverlay from '../SocialProofProductOverlay'

describe('<SocialProofProductOverlay />', () => {
  const renderedComponent = testComponentHelper(
    SocialProofProductOverlay.WrappedComponent
  )

  it('Should match snapshot', () => {
    expect(renderedComponent().getTree()).toMatchSnapshot()
  })

  describe('wrapper', () => {
    describe('CMS page id is provided', () => {
      describe('imageBanners property contains desktop and mobile version', () => {
        const imageBanners = {
          plpBanners: {
            desktop: 'plpDesktopImgSrc',
            mobile: 'plpMobileImgSrc',
          },
        }

        it('renders desktop version if viewport is desktop', () => {
          const { wrapper } = renderedComponent({
            isMobile: false,
            hasBannerCMSPageID: true,
            hasFetchedSocialProofBanners: true,
            imageBanners,
          })

          expect(
            wrapper.find('.SocialProofProductOverlay--badgeImage').prop('src')
          ).toBe('plpDesktopImgSrc')
        })

        it('renders mobile version if viewport is mobile', () => {
          const { wrapper } = renderedComponent({
            isMobile: true,
            hasBannerCMSPageID: true,
            hasFetchedSocialProofBanners: true,
            imageBanners,
          })

          expect(
            wrapper.find('.SocialProofProductOverlay--badgeImage').prop('src')
          ).toBe('plpMobileImgSrc')
        })
      })

      describe('imageBanners property contains just the desktop version', () => {
        const imageBanners = {
          plpBanners: {
            desktop: 'plpDesktopImgSrc',
            mobile: 'plpMobileImgSrc',
          },
        }

        it('renders desktop version if viewport is desktop', () => {
          const { wrapper } = renderedComponent({
            isMobile: false,
            hasBannerCMSPageID: true,
            hasFetchedSocialProofBanners: true,
            imageBanners,
          })

          expect(
            wrapper.find('.SocialProofProductOverlay--badgeImage').prop('src')
          ).toBe('plpDesktopImgSrc')
        })

        it('renders mobile version if viewport is mobile', () => {
          const { wrapper } = renderedComponent({
            isMobile: true,
            hasBannerCMSPageID: true,
            hasFetchedSocialProofBanners: true,
            imageBanners,
          })

          expect(
            wrapper.find('.SocialProofProductOverlay--badgeImage').prop('src')
          ).toBe('plpMobileImgSrc')
        })
      })

      describe('imageBanners property is partialy provided', () => {
        it('renders just the container for the image', () => {
          const { wrapper } = renderedComponent({
            isMobile: false,
            hasBannerCMSPageID: true,
            imageBanners: {
              orderProductBanners: {
                desktop: '',
                mobile: 'animagehere',
              },
            },
          })

          expect(wrapper.find('.SocialProofProductOverlay').exists()).toBe(true)
          expect(
            wrapper.find('.SocialProofProductOverlay--badgeImage').exists()
          ).toBe(false)
        })
      })
    })

    describe('CMS page id page is not provided', () => {
      it('Should check badge text exists', () => {
        const { wrapper } = renderedComponent()
        const node = wrapper.find('.SocialProofProductOverlay--badgeText')

        expect(node.exists()).toBe(true)
      })

      it('Should check the badge wording is correct', () => {
        const { wrapper } = renderedComponent()
        const node = wrapper.find('.SocialProofProductOverlay--badgeText')

        expect(node.text()).toBe('HURRY, SELLING FAST!')
      })

      it('Should return default badge wording if given brand does not exist', () => {
        const { wrapper } = renderedComponent({ brandCode: 'ts' })
        const node = wrapper.find('.SocialProofProductOverlay--badgeText')
        expect(node.text()).toBe('HURRY, SELLING FAST!')
      })

      it('Should return correct badge wording if given brand is miss sellfridge', () => {
        const { wrapper } = renderedComponent({ brandCode: 'ms' })
        const node = wrapper.find('.SocialProofProductOverlay--badgeText')
        expect(node.text()).toBe('SELLING FAST!')
      })
      it('Should return correct badge wording if given brand is miss topman', () => {
        const { wrapper } = renderedComponent({ brandCode: 'tm' })
        const node = wrapper.find('.SocialProofProductOverlay--badgeText')
        expect(node.text()).toBe('HURRY, SELLING FAST!')
      })
    })
  })
})
