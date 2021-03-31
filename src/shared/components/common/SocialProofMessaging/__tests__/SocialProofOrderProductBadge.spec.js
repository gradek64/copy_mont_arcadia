import testComponentHelper from 'test/unit/helpers/test-component'

import SocialProofOrderProductBadge from '../SocialProofOrderProductBadge'

const render = testComponentHelper(
  SocialProofOrderProductBadge.WrappedComponent
)

describe('<SocialProofOrderProductBadge />', () => {
  it('should match the snapshot', () => {
    const { getTree } = render({})
    expect(getTree()).toMatchSnapshot()
  })

  describe('bannersCMSPageSocialProof is provided', () => {
    describe('imageBanners property contains desktop and mobile version', () => {
      const imageBanners = {
        orderProductBanners: {
          desktop: 'orderProductDesktopImgSrc',
          mobile: 'orderProductMobileImgSrc',
        },
      }

      it('renders desktop version if viewport is desktop', () => {
        const { wrapper } = render({
          isMobile: false,
          hasBannerCMSPageID: true,
          imageBanners,
        })

        expect(
          wrapper
            .find('.SocialProofOrderProductBadge--sellingFastImage')
            .prop('src')
        ).toBe('orderProductDesktopImgSrc')
      })

      it('renders desktop version if viewport is mobile', () => {
        const { wrapper } = render({
          isMobile: true,
          hasBannerCMSPageID: true,
          imageBanners,
        })

        expect(
          wrapper
            .find('.SocialProofOrderProductBadge--sellingFastImage')
            .prop('src')
        ).toBe('orderProductMobileImgSrc')
      })
    })

    describe('imageBanners property contains only the desktop version', () => {
      const imageBanners = {
        orderProductBanners: {
          desktop: 'orderProductDesktopImgSrc',
          mobile: '',
        },
      }

      it('renders desktop version if viewport is mobile', () => {
        const { wrapper } = render({
          isMobile: true,
          hasBannerCMSPageID: true,
          imageBanners,
        })

        expect(
          wrapper
            .find('.SocialProofOrderProductBadge--sellingFastImage')
            .prop('src')
        ).toBe('orderProductDesktopImgSrc')
      })

      it('renders desktop version if viewport is not mobile', () => {
        const { wrapper } = render({
          isMobile: false,
          hasBannerCMSPageID: true,
          imageBanners,
        })

        expect(
          wrapper
            .find('.SocialProofOrderProductBadge--sellingFastImage')
            .prop('src')
        ).toBe('orderProductDesktopImgSrc')
      })
    })

    describe('imageBanners property is partialy provided', () => {
      it('renders just the container for the image', () => {
        const { wrapper } = render({
          isMobile: false,
          hasBannerCMSPageID: true,
          imageBanners: {
            orderProductBanners: {
              desktop: '',
              mobile: 'animagehere',
            },
          },
        })

        expect(wrapper.find('.SocialProofOrderProductBadge').exists()).toBe(
          true
        )
        expect(
          wrapper.find('.SocialProofProductOverlay--badgeImage').exists()
        ).toBe(false)
      })
    })
  })

  describe('bannersCMSPageSocialProof is not provided', () => {
    it('falls back to the handcoded version of the banner', () => {
      const { wrapper } = render({})

      expect(
        wrapper.find('.SocialProofOrderProductBadge--sellingFast').exists()
      ).toBe(true)
    })
  })
})
