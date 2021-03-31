import testComponentHelper from 'test/unit/helpers/test-component'

import ProductImagesOverlay from './ProductImagesOverlay'
import SocialProofProductOverlay from '../SocialProofMessaging/SocialProofProductOverlay'
import ProductAttributeBanner from '../ProductAttributeBanner/ProductAttributeBanner'
import { mobileAttBadge, mobileAttBanner } from '../../../lib/products-utils'
import {
  attributeBannersMock,
  attributeBadgesMock,
} from 'test/mocks/product-assets-mocks'

describe('<ProductImagesOverlay />', () => {
  const productId = 12345
  const productUrl = '/en/tsuk/product/big-ol-hat'
  const initialProps = {
    isFeatureLogBadAttributeBannersEnabled: false,
    isFeaturePLPImageOverlayEnabled: false,
    productId,
    productUrl,
    isTrending: false,
    brandCode: 'ts',
    additionalAssets: [],
    showSingleProductOverlayBannerOnPLP: false,
  }
  const renderComponent = testComponentHelper(
    ProductImagesOverlay.WrappedComponent
  )

  const badgeAsset = attributeBadgesMock.find(mobileAttBadge)
  const bannerAsset = attributeBannersMock.find(mobileAttBanner)

  describe('if the social proof feature flag is disabled', () => {
    describe('when neither the attribute badge nor attribute banner are available', () => {
      it('should render nothing', () => {
        const { wrapper } = renderComponent(initialProps)
        expect(wrapper.html()).toBe(null)
      })
    })

    describe('when the mobile attribute badge asset is available', () => {
      it('should render the badge', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          additionalAssets: attributeBadgesMock,
        })
        const badge = wrapper.find(ProductAttributeBanner)
        expect(badge.exists()).toBe(true)
        expect(badge.prop('src')).toBe(badgeAsset.url)
        expect(badge.prop('productURL')).toBe(productUrl)
        expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
      })
    })

    describe('when the mobile attribute banner asset is available', () => {
      it('should render the banner', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          additionalAssets: attributeBannersMock,
        })
        const banner = wrapper.find(ProductAttributeBanner)
        expect(banner.exists()).toBe(true)
        expect(banner.prop('src')).toBe(bannerAsset.url)
        expect(banner.prop('productURL')).toBe(productUrl)
        expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
      })

      describe('isTrending is true', () => {
        it('should not render socialProof banner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isTrending: true,
            additionalAssets: attributeBannersMock,
          })
          const banner = wrapper.find(ProductAttributeBanner)
          expect(banner.exists()).toBe(true)
          expect(banner.prop('src')).toBe(bannerAsset.url)
          expect(banner.prop('productURL')).toBe(productUrl)
          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
        })
      })
    })

    describe('when both the attribute banner and attribute badge assets are available', () => {
      it('should render the banner', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          additionalAssets: [...attributeBannersMock, ...attributeBadgesMock],
        })
        const banner = wrapper.find(ProductAttributeBanner)
        expect(banner.exists()).toBe(true)
        expect(banner.prop('src')).toBe(bannerAsset.url)
        expect(banner.prop('productURL')).toBe(productUrl)
        expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
      })
    })
  })

  describe('if the social proof feature flag is enabled', () => {
    describe('and the product is trending and has an attribute banner', () => {
      describe('if hideTrendingProductLabel is false', () => {
        describe('if showSingleProductOverlayBannerOnPLP is false', () => {
          it('should render SocialProofBanner and attributebanner', () => {
            const { wrapper } = renderComponent({
              ...initialProps,
              isFeaturePLPImageOverlayEnabled: true,
              hideTrendingProductLabel: false,
              isTrending: true,
              additionalAssets: attributeBannersMock,
              showSingleProductOverlayBannerOnPLP: false,
            })

            expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(true)
            expect(wrapper.find(ProductAttributeBanner).exists()).toBe(true)
          })
        })

        describe('if showSingleProductOverlayBannerOnPLP is SocialProofBanner', () => {
          it('should render only SocialProofBanner', () => {
            const { wrapper } = renderComponent({
              ...initialProps,
              isFeaturePLPImageOverlayEnabled: true,
              hideTrendingProductLabel: false,
              isTrending: true,
              showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
              additionalAssets: attributeBannersMock,
            })
            expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(true)
            expect(wrapper.find(ProductAttributeBanner).exists()).toBe(false)
          })
        })

        describe('if showSingleProductOverlayBannerOnPLP is attributeBanner', () => {
          it('should render only attribute banner', () => {
            const { wrapper } = renderComponent({
              ...initialProps,
              isFeaturePLPImageOverlayEnabled: true,
              hideTrendingProductLabel: false,
              isTrending: true,
              showSingleProductOverlayBannerOnPLP: 'attributeBanner',
              additionalAssets: attributeBannersMock,
            })
            expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
            expect(wrapper.find(ProductAttributeBanner).exists()).toBe(true)
          })
        })
      })

      describe('if hideTrendingProductLabel is true', () => {
        it('should fall back to rendering the banner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isFeaturePLPImageOverlayEnabled: true,
            hideTrendingProductLabel: true,
            isTrending: false,
            additionalAssets: attributeBannersMock,
          })
          const banner = wrapper.find(ProductAttributeBanner)
          expect(banner.exists()).toBe(true)
          expect(banner.prop('src')).toBe(bannerAsset.url)
          expect(banner.prop('productURL')).toBe(productUrl)
          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
        })
      })
    })

    describe('and the product is not trending, the attribute banner asset is available', () => {
      it('should fall back to rendering the banner', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeaturePLPImageOverlayEnabled: true,
          isTrending: false,
          additionalAssets: attributeBannersMock,
        })
        const banner = wrapper.find(ProductAttributeBanner)
        expect(banner.exists()).toBe(true)
        expect(banner.prop('src')).toBe(bannerAsset.url)
        expect(banner.prop('productURL')).toBe(productUrl)
        expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
      })

      describe('if showSingleProductOverlayBannerOnPLP is false', () => {
        it('should render the attributebanner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isFeaturePLPImageOverlayEnabled: true,
            hideTrendingProductLabel: false,
            isTrending: false,
            additionalAssets: attributeBannersMock,
            showSingleProductOverlayBannerOnPLP: false,
          })

          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
          expect(wrapper.find(ProductAttributeBanner).exists()).toBe(true)
        })
      })

      describe('if showSingleProductOverlayBannerOnPLP is SocialProofBanner', () => {
        it('should fallback to attribute banner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isFeaturePLPImageOverlayEnabled: true,
            hideTrendingProductLabel: false,
            isTrending: false,
            showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
            additionalAssets: attributeBannersMock,
          })
          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
          expect(wrapper.find(ProductAttributeBanner).exists()).toBe(true)
        })
      })

      describe('if showSingleProductOverlayBannerOnPLP is attributeBanner', () => {
        it('should render only attribute banner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isFeaturePLPImageOverlayEnabled: true,
            hideTrendingProductLabel: false,
            isTrending: false,
            showSingleProductOverlayBannerOnPLP: 'attributeBanner',
            additionalAssets: attributeBannersMock,
          })
          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(false)
          expect(wrapper.find(ProductAttributeBanner).exists()).toBe(true)
        })
      })
    })

    describe('and the product is trending, the attribute banner asset is not available', () => {
      describe('if showSingleProductOverlayBannerOnPLP is false', () => {
        it('should render the socialProofBanner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isFeaturePLPImageOverlayEnabled: true,
            hideTrendingProductLabel: false,
            isTrending: true,
            showSingleProductOverlayBannerOnPLP: false,
          })

          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(true)
          expect(wrapper.find(ProductAttributeBanner).exists()).toBe(false)
        })
      })

      describe('if showSingleProductOverlayBannerOnPLP is SocialProofBanner', () => {
        it('should render the socialProofBanner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isFeaturePLPImageOverlayEnabled: true,
            hideTrendingProductLabel: false,
            isTrending: true,
            showSingleProductOverlayBannerOnPLP: 'socialProofBanner',
          })
          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(true)
          expect(wrapper.find(ProductAttributeBanner).exists()).toBe(false)
        })
      })

      describe('if showSingleProductOverlayBannerOnPLP is attributeBanner', () => {
        it('should render the socialProofBanner', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            isFeaturePLPImageOverlayEnabled: true,
            hideTrendingProductLabel: false,
            isTrending: true,
            showSingleProductOverlayBannerOnPLP: 'attributeBanner',
          })
          expect(wrapper.find(SocialProofProductOverlay).exists()).toBe(true)
          expect(wrapper.find(ProductAttributeBanner).exists()).toBe(false)
        })
      })
    })

    describe('no attributeBanner exists and no shouldShowSocialProofMessage is true', () => {
      it('should render nothing', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          isFeaturePLPImageOverlayEnabled: true,
          hideTrendingProductLabel: false,
          isTrending: false,
        })
        expect(wrapper.html()).toBe(null)
      })
    })
  })
})
