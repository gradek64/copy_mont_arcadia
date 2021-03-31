import testComponentHelper from 'test/unit/helpers/test-component'
import React from 'react'
import deepFreeze from 'deep-freeze'

import Product from '../Product'
import ProductQuickview from '../../../containers/ProductQuickview/ProductQuickview'
import ProductQuickViewButton from '../../ProductQuickViewButton/ProductQuickViewButton'
import HistoricalPrice from '../../HistoricalPrice/HistoricalPrice'
import ProductImages from '../../ProductImages/ProductImages'
import SocialProofProductMetaLabel from '../../SocialProofMessaging/SocialProofProductMetaLabel'
import ProductImagesOverlay from '../../ProductImagesOverlay/ProductImagesOverlay'

import * as viewHelpers from '../../../../lib/viewHelper'
import { isIE11 } from '../../../../lib/browser'
import {
  assetsMock,
  attributeBadgesMock,
  attributeBannersMock,
  promoBannersMock,
} from '../../../../../../test/mocks/product-assets-mocks'

import productSwatchPromoMock from '../../../../../../test/mocks/product-swatch-promo'

import WithQubit from '../../Qubit/WithQubit'

const touchDetectionSpy = jest.spyOn(viewHelpers, 'touchDetection')

jest.mock('../../../../lib/browser')

describe('<Product/>', () => {
  const renderComponent = testComponentHelper(Product.WrappedComponent)

  const initialProps = deepFreeze({
    productId: 24393842,
    swatchProducts: {},
    grid: 1,
    name: 'productName',
    productNumber: 'productNumber',
    productUrl: '/uk/testUrl',
    seoUrl: '/uk/testSeoUrl',
    assets: [],
    isMobile: true,
    isDesktop: false,
    showNewBanners: true,
    sizes: {
      mobile: 1,
      tablet: 1,
      desktop: 1,
    },
    selectedProductSwatches: {},
    lineNumber: 'DP56672900',
  })

  const fakeSwatchProducts = [
    {
      colourName: '',
      seoUrl: '/uk/testSeoUrl',
      imageUrl:
        'http://media.topshop.com/wcsstore/DorothyPerkins/images/catalog/swatch/3d3629.jpg',
      swatchProduct: {
        productId: 33723484,
        grouping: 'DP56672900',
        lineNumber: '56672900',
        name: 'Multi Coloured Strap Back Top',
        shortDescription: 'Multi Coloured Strap Back Top',
        unitPrice: '6.00',
        productUrl:
          '/en/dpuk/product/sale-6955441/view-all-sale-4527816/multi-coloured-strap-back-top-8468797',
        rating: '',
        assets: [],
        additionalAssets: [],
        productBaseImageUrl:
          'https://images.dorothyperkins.com/i/DorothyPerkins/DP56672900_F_1',
        outfitBaseImageUrl:
          'https://images.dorothyperkins.com/i/DorothyPerkins/DP56672900_M_1',
      },
    },
    {
      colourName: '',
      seoUrl: '/uk/testSeoUrl',
      imageUrl:
        'http://media.topshop.com/wcsstore/DorothyPerkins/images/catalog/swatch/000000.jpg',
      swatchProduct: {
        productId: 24393842,
        grouping: 'DP56672700',
        lineNumber: '56672700',
        name: 'Black Strap Back Top',
        shortDescription: 'Black Strap Back Top',
        unitPrice: '6.00',
        wasPrice: '10.00',
        wasWasPrice: '12.00',
        productUrl:
          '/en/dpuk/product/sale-6955441/view-all-sale-4527816/black-strap-back-top-8206468',
        rating: '',
        assets: [],
        additionalAssets: [],
        productBaseImageUrl:
          'https://images.dorothyperkins.com/i/DorothyPerkins/DP56672700_F_1',
        outfitBaseImageUrl:
          'https://images.dorothyperkins.com/i/DorothyPerkins/DP56672700_M_1',
      },
    },
  ]

  describe('@renders', () => {
    beforeEach(() => {
      touchDetectionSpy.mockImplementation(() => false)
    })

    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with className', () => {
      expect(
        renderComponent({ ...initialProps, className: 'myClassName' }).getTree()
      ).toMatchSnapshot()
    })

    it('with className for touch device', () => {
      const { wrapper } = renderComponent({ ...initialProps })
      expect(wrapper.hasClass('Product--isTouch')).toBe(false)
    })

    it('with rating', () => {
      const props = {
        rating: 3,
        bazaarVoiceData: {
          average: '4.32',
        },
      }

      expect(
        renderComponent({ ...initialProps, ...props }).getTree()
      ).toMatchSnapshot()
    })

    it('with bazaarVoiceData.average and no rating', () => {
      expect(
        renderComponent({
          ...initialProps,
          bazaarVoiceData: { average: '4.32' },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with showProductView boolean', () => {
      expect(
        renderComponent({ ...initialProps, showProductView: true }).getTree()
      ).toMatchSnapshot()
    })

    it('with assets', () => {
      const props = {
        assets: [
          {
            assetType: 'IMAGE_SMALL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Thumb_F_1.jpg',
          },
          {
            assetType: 'IMAGE_THUMB',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Small_F_1.jpg',
          },
        ],
      }

      expect(
        renderComponent({ ...initialProps, ...props }).getTree()
      ).toMatchSnapshot()
    })

    it('with additionalAssets', () => {
      const props = {
        additionalAssets: [
          {
            assetType: 'IMAGE_ZOOM',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_Zoom_F_1.jpg',
          },
          {
            assetType: 'IMAGE_2COL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS09D31JAQA_2col_F_1.jpg',
          },
        ],
      }

      expect(
        renderComponent({ ...initialProps, ...props }).getTree()
      ).toMatchSnapshot()
    })

    it('with unitPrice', () => {
      expect(
        renderComponent({ ...initialProps, unitPrice: '30.00' }).getTree()
      ).toMatchSnapshot()
    })

    it('with wasPrice', () => {
      expect(
        renderComponent({ ...initialProps, wasPrice: '25.00' }).getTree()
      ).toMatchSnapshot()
    })

    it('with wasWasPrice', () => {
      expect(
        renderComponent({ ...initialProps, wasWasPrice: '35.00' }).getTree()
      ).toMatchSnapshot()
    })

    it('with productNumber', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        productNumber: '1234',
      })

      expect(wrapper.prop('data-product-number')).toBe('1234')
    })

    describe('when user click to the link and openQuickView is true', () => {
      it('opens quickView', () => {
        const productId = 123456
        const setProductQuickviewMock = jest.fn()
        const setProductIdQuickviewMock = jest.fn()
        const onQuickViewButtonClickMock = jest.fn()
        const showModalMock = jest.fn()
        const preventDefaultMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          productId,
          isMobile: false,
          setProductQuickview: setProductQuickviewMock,
          setProductIdQuickview: setProductIdQuickviewMock,
          showModal: showModalMock,
          openQuickViewOnProductClick: true,
          onQuickViewButtonClick: onQuickViewButtonClickMock,
        })
        wrapper
          .find('.Product-link')
          .simulate('click', { preventDefault: preventDefaultMock })

        expect(setProductQuickviewMock).toHaveBeenCalledWith({})
        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        expect(setProductIdQuickviewMock).toHaveBeenCalledWith(productId)
        expect(showModalMock).toHaveBeenCalledWith(<ProductQuickview />, {
          mode: 'plpQuickview',
        })
        expect(onQuickViewButtonClickMock).toHaveBeenCalledWith(productId)
      })
    })

    it('with rrp', () => {
      expect(
        renderComponent({ ...initialProps, rrp: '40.00' }).getTree()
      ).toMatchSnapshot()
    })

    it('without swatches (do not render measure)', () => {
      expect(
        renderComponent({ ...initialProps, colourSwatches: null }).wrapper.find(
          'Measure'
        ).length
      ).toBe(0)
    })

    it('without isCarouselItem (render SocialProofProductMetaLabel)', () => {
      const input = renderComponent({
        ...initialProps,
        hideProductMeta: false,
        isCarouselItem: false,
      })
        .wrapper.find(SocialProofProductMetaLabel)
        .exists()
      const output = true
      expect(input).toBe(output)
    })

    describe('when isCarouselItem', () => {
      it('should not render SocialProofProductMetaLabel', () => {
        const input = renderComponent({
          ...initialProps,
          hideProductMeta: false,
          isCarouselItem: true,
        })
          .wrapper.find(SocialProofProductMetaLabel)
          .exists()
        const output = false
        expect(input).toBe(output)
      })

      it('should tell the ProductImagesOverlay to hide the social proof overlay', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          hideProductMeta: false,
          isCarouselItem: true,
        })
        const productImagesOverlay = wrapper.find(ProductImagesOverlay)
        expect(productImagesOverlay.prop('hideTrendingProductLabel')).toBe(true)
      })
    })

    it('with 1 swatch (do not render measure)', () => {
      expect(
        renderComponent({
          ...initialProps,
          colourSwatches: [fakeSwatchProducts[0]],
        }).wrapper.find('Measure').length
      ).toBe(0)
    })
    it('with at least 2 swatches (render measure)', () => {
      expect(
        renderComponent({
          ...initialProps,
          colourSwatches: fakeSwatchProducts,
        }).wrapper.find('Measure').length
      ).toBe(1)
    })

    it('with 2 swatch color and the second color selected should render the correct wasPrice', () => {
      const { wrapper, instance } = renderComponent({
        ...initialProps,
        colourSwatches: fakeSwatchProducts,
        wasPrice: '10.00',
        wasWasPrice: '12.00',
        swatchProducts: {
          '24393842': {
            page: 0,
            selected: 1,
          },
        },
      })
      const productData = instance.getProductInfo(instance.props)
      expect(wrapper.find('HistoricalPrice').length).toBe(1)
      expect(productData.unitPrice).toBe('6.00')
      expect(productData.wasPrice).toBe('10.00')
      expect(productData.wasWasPrice).toBe('12.00')
    })
    it('with 2 swatch color and the first color selected should render the parent wasPrice', () => {
      const { wrapper, instance } = renderComponent({
        ...initialProps,
        colourSwatches: fakeSwatchProducts,
        wasPrice: '12.00',
        wasWasPrice: '16.00',
        swatchProducts: {
          '24393842': {
            page: 0,
            selected: 0,
          },
        },
      })
      const productData = instance.getProductInfo(instance.props)
      expect(wrapper.find('HistoricalPrice').length).toBe(1)
      expect(productData.unitPrice).toBe('6.00')
      expect(productData.wasPrice).toBe('12.00')
      expect(productData.wasWasPrice).toBe('16.00')
    })
    it('with 2 swatch color and the first color selected should NOT render the wasPrice', () => {
      const { wrapper, instance } = renderComponent({
        ...initialProps,
        colourSwatches: fakeSwatchProducts,
        swatchProducts: {
          '24393842': {
            page: 0,
            selected: 0,
          },
        },
      })
      const productData = instance.getProductInfo(instance.props)
      expect(wrapper.find('HistoricalPrice').length).toBe(1)
      expect(productData.unitPrice).toBe('6.00')
      expect(productData.wasPrice).toBe('')
      expect(productData.wasWasPrice).toBe('')
    })

    it('should render ProductImages with correct sizes prop', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(ProductImages).prop('sizes')).toEqual(
        initialProps.sizes
      )
    })

    it('should be able to not show quickview option', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        showPrice: false,
      })
      expect(wrapper.find(HistoricalPrice).exists()).toBe(false)
    })

    it('should render if `isBundleOrOutfit` and `isMobile` are both `false`', () => {
      expect(
        renderComponent({
          ...initialProps,
          isBundleOrOutfit: false,
          isMobile: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should add a className to center align price', () => {
      const { instance } = renderComponent(initialProps)
      expect(instance.addClassNamesToHistoricalPrice(1, true)).toContain(
        'HistoricalPrice--center'
      )
    })

    it('should render ProductImagesOverlay', () => {
      const isFeatureLogBadAttributeBannersEnabled = true
      const { wrapper } = renderComponent({
        ...initialProps,
        additionalAssets: attributeBannersMock,
        isFeatureLogBadAttributeBannersEnabled,
      })
      const overlay = wrapper.find(ProductImagesOverlay)
      expect(overlay.exists()).toBe(true)
      expect(overlay.props()).toEqual({
        productId: 24393842,
        productUrl: '/uk/testUrl',
        additionalAssets: attributeBannersMock,
        isFeatureLogBadAttributeBannersEnabled,
        hideTrendingProductLabel: false,
      })
    })

    it('should render ProductPromoBanner', () => {
      const component = renderComponent({
        ...initialProps,
        additionalAssets: promoBannersMock,
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should not render Banners in 3 column view for mobile viewport', () => {
      expect(
        renderComponent({
          ...initialProps,
          isMobile: true,
          grid: 3,
          additionalAssets: [...attributeBannersMock, ...promoBannersMock],
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should hide product meta', () => {
      expect(
        renderComponent({ ...initialProps, hideProductMeta: true }).getTree()
      ).toMatchSnapshot()
    })

    it('should hide product name', () => {
      expect(
        renderComponent({ ...initialProps, hideProductName: true }).getTree()
      ).toMatchSnapshot()
    })

    it('should hide quick view icon', () => {
      expect(
        renderComponent({ ...initialProps, hideQuickViewIcon: true }).getTree()
      ).toMatchSnapshot()
    })

    it('when is bundle', () => {
      expect(
        renderComponent({ ...initialProps, isBundleOrOutfit: true }).getTree()
      ).toMatchSnapshot()
    })

    describe('with Wishlist Feature Flag enabled', () => {
      it('displays wishlist button', () => {
        expect(
          renderComponent({
            ...initialProps,
            isFeatureWishlistEnabled: true,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('does not show wishlist button for bundles', () => {
        expect(
          renderComponent({
            ...initialProps,
            isFeatureWishlistEnabled: true,
            isBundleOrOutfit: true,
          }).getTree()
        ).toMatchSnapshot()
      })

      it('does not show wishlist button for carousel items', () => {
        expect(
          renderComponent({
            ...initialProps,
            isFeatureWishlistEnabled: true,
            isCarouselItem: true,
          }).getTree()
        ).toMatchSnapshot()
      })
    })

    describe('@qubit', () => {
      describe('touch disabled', () => {
        const { wrapper } = renderComponent(initialProps)
        const qubitWrapper = wrapper.find(WithQubit)
        it('should not render a qubit react wrapper for add to bag', () => {
          expect(qubitWrapper.length).toBe(0)
        })
      })
      describe('touch enabled and isCarouselItem is false', () => {
        touchDetectionSpy.mockImplementation(() => true)
        const { wrapper } = renderComponent({
          ...initialProps,
          isCarouselItem: false,
        })
        const qubitWrapper = wrapper.find(WithQubit)
        it('should render a qubit react wrapper for add to bag', () => {
          expect(qubitWrapper.length).toBe(1)
        })
        it('should render a qubit react wrapper with correct props for add to bag', () => {
          expect(qubitWrapper.props().id).toBe('qubit-quick-add-to-bag')
          expect(qubitWrapper.props().viewport).toBe('mobile')
          expect(qubitWrapper.props().productId).toBe(24393842)
          expect(qubitWrapper.props().productRoute).toBe('/uk/testUrl')
        })
      })
      describe('touch enabled and isCarouselItem is true', () => {
        touchDetectionSpy.mockImplementation(() => true)
        const { wrapper } = renderComponent({
          ...initialProps,
          isCarouselItem: true,
        })
        const qubitWrapper = wrapper.find(WithQubit)
        it('should not render a qubit react wrapper for add to bag', () => {
          expect(qubitWrapper.length).toBe(0)
        })
      })
      describe('bundle or outfit product', () => {
        touchDetectionSpy.mockImplementation(() => true)
        const { wrapper } = renderComponent({
          ...initialProps,
          isBundleOrOutfit: true,
        })
        const qubitWrapper = wrapper.find(WithQubit)
        it('should not use a qubit react wrapper if touch enabled', () => {
          expect(qubitWrapper.props().shouldUseQubit).toBe(false)
        })
      })
    })
  })

  describe('@instance methods', () => {
    describe('getters', () => {
      describe('promoBanner()', () => {
        it('returns undefined if no promo banner is found in assets or additionalAssets', () => {
          const { instance } = renderComponent(initialProps)
          expect(instance.promoBanner).toBe(undefined)
        })

        // @NOTE to be deleted
        describe('when using ScrAPI', () => {
          it('returns undefined when IMAGE_PROMO_GRAPHIC indexes an attribute banner', () => {
            const { instance } = renderComponent({
              ...initialProps,
              assets: [
                {
                  assetType: 'IMAGE_PROMO_GRAPHIC',
                  index: 1,
                  url:
                    'http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images/colors/color7/cms/pages/static/static-0000109335/images/Banner_Mobile_promo_basicjersey_uk.svg',
                },
              ],
            })
            expect(instance.promoBanner).toBe(undefined)
          })

          it('returns promoBanner', () => {
            const { instance } = renderComponent({
              ...initialProps,
              assets: assetsMock,
            })
            expect(instance.promoBanner).toEqual({
              assetType: 'IMAGE_PROMO_GRAPHIC',
              index: 1,
              url:
                'http://media.topshop.com/wcsstore/Topshop/images/category_icons/promo_code_627587_mobile.png',
            })
          })

          it('returns undefined when a discounted swatch product is chosen', () => {
            const { instance } = renderComponent({
              ...initialProps,
              ...productSwatchPromoMock,
              productId: 27980029,
              swatchProducts: { '27980029': { selected: 4 } },
            })

            expect(instance.promoBanner).toBe(undefined)
          })

          it('returns promoBanner when a swatch product is not discounted', () => {
            const { instance } = renderComponent({
              ...initialProps,
              ...productSwatchPromoMock,
              productId: 27980029,
              swatchProducts: { '27980029': { selected: 0 } },
            })

            expect(instance.promoBanner).toEqual({
              assetType: 'IMAGE_PROMO_GRAPHIC_MOBILE',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/category_icons/promo_code_560596_mobile.png',
            })
          })
        })

        it('returns mobile size promoBanner if found when using coreAPI', () => {
          const { instance } = renderComponent({
            ...initialProps,
            additionalAssets: promoBannersMock,
            grid: 4,
          })
          expect(instance.promoBanner).toEqual({
            assetType: 'IMAGE_PROMO_GRAPHIC_MOBILE',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/Topshop/images/category_icons/promo_code_627587_mobile.png',
          })
        })
      })
    })
    describe('renderSwatches', () => {
      it('default case', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          testComponentHelper(
            instance.renderSwatches(
              5,
              'colourSwatches',
              'parentProductId',
              'parentProductUrl',
              'name'
            )
          )().getTree()
        ).toMatchSnapshot()
      })
      it('with componentWidth', () => {
        const { instance } = renderComponent(initialProps)
        expect(
          testComponentHelper(
            instance.renderSwatches(
              5,
              'colourSwatches',
              'parentProductId',
              'parentProductUrl',
              'name'
            )
          )({ componentWidth: 500 }).getTree()
        ).toMatchSnapshot()
      })
    })
    describe('calSwatchWidth', () => {
      it('return the correct swatch size for mobile', () => {
        const SWATCH_WIDTH = 34
        const isDesktop = false
        const { instance } = renderComponent({
          ...initialProps,
          additionalAssets: attributeBadgesMock,
          grid: 2,
        })
        expect(instance.calSwatchWidth(isDesktop)).toEqual(SWATCH_WIDTH)
      })
    })
    describe('calMaxNumOfSwatches', () => {
      it('returns correct number of swatches to fit inside a parent element', () => {
        const PARENT_ELEMENT_WIDTH = 140
        const isDesktop = false
        const { instance } = renderComponent({
          ...initialProps,
          additionalAssets: attributeBadgesMock,
          grid: 2,
        })
        expect(
          instance.calMaxNumOfSwatches(PARENT_ELEMENT_WIDTH, isDesktop)
        ).toEqual(4)
      })
    })
  })

  describe('@events', () => {
    describe('on quick view button click with the selected swatch', () => {
      it('should open quick view with product id if no swatch was previously selected', () => {
        const productId = 123456
        const setProductQuickviewMock = jest.fn()
        const setProductIdQuickviewMock = jest.fn()
        const showModalMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          productId,
          isMobile: false,
          setProductQuickview: setProductQuickviewMock,
          setProductIdQuickview: setProductIdQuickviewMock,
          showModal: showModalMock,
          showProductView: true,
        })
        wrapper.find(ProductQuickViewButton).prop('onClick')()

        expect(setProductQuickviewMock).toHaveBeenCalledWith({})
        expect(setProductIdQuickviewMock).toHaveBeenCalledWith(productId)
        expect(showModalMock).toHaveBeenCalledWith(<ProductQuickview />, {
          mode: 'plpQuickview',
        })
      })

      it('should open quick view with swatch id if a swatch was previously selected', () => {
        const productId = 123456
        const swatchId = 998877
        const setProductQuickviewMock = jest.fn()
        const setProductIdQuickviewMock = jest.fn()
        const showModalMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          productId,
          isMobile: false,
          setProductQuickview: setProductQuickviewMock,
          setProductIdQuickview: setProductIdQuickviewMock,
          showModal: showModalMock,
          showProductView: true,
          selectedProductSwatches: {
            [productId]: swatchId,
          },
        })
        wrapper.find(ProductQuickViewButton).prop('onClick')()

        expect(setProductQuickviewMock).toHaveBeenCalledWith({})
        expect(setProductIdQuickviewMock).toHaveBeenCalledWith(swatchId)
        expect(showModalMock).toHaveBeenCalledWith(<ProductQuickview />, {
          mode: 'plpQuickview',
        })
      })
    })

    describe('on product link click', () => {
      it('should call preserveScroll with current global.window.scrollY (0) if IE11', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          preserveScroll: jest.fn(),
        })

        isIE11.mockImplementationOnce(() => true)

        wrapper
          .find('.Product-link')
          .first()
          .simulate('click')

        expect(instance.props.preserveScroll).toHaveBeenCalledTimes(1)
        expect(instance.props.preserveScroll).lastCalledWith(0)
      })

      it('should call `onLinkClick` with product ID as the first param', () => {
        const onLinkClickMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          preserveScroll: () => {},
          onLinkClick: onLinkClickMock,
        })
        wrapper.find('.Product-link').prop('onClick')()
        expect(onLinkClickMock).toHaveBeenCalledWith(24393842, false)
      })

      it('should call `onLinkClick` with true as the second param if clicking on the wishlist icon', () => {
        const onLinkClickMock = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          preserveScroll: () => {},
          onLinkClick: onLinkClickMock,
        })
        wrapper
          .find('.Product-link')
          .simulate('click', { target: { id: 'wishlistIcon' } })
        expect(onLinkClickMock).toHaveBeenCalledWith(24393842, true)
      })
    })
  })
})
