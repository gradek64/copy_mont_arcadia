import { Link } from 'react-router'

import { getRouteFromUrl } from '../../../../lib/get-product-route'
import { GTM_CATEGORY, GTM_ACTION, GTM_LABEL } from '../../../../analytics'
import testComponentHelper from 'test/unit/helpers/test-component'

import OrderProduct from '../OrderProduct'
import ResponsiveImage from '../../ResponsiveImage/ResponsiveImage'
import SocialProofOrderProductBadge from '../../SocialProofMessaging/SocialProofOrderProductBadge'

describe('<OrderProduct/>', () => {
  const render = testComponentHelper(OrderProduct.WrappedComponent)

  const initialProps = {
    name: 'Floral Embroidered PJ Set',
    assets: [
      {
        assetType: 'IMAGE_THUMB',
        index: 1,
        url:
          'http://media.topshop.com/wcsstore/TopShop/images/catalog/01W16JCRM_thumb.jpg',
      },
    ],
    isDDPProduct: false,
    sendAnalyticsClickEvent: jest.fn(),
  }

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = render(initialProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('does not display product size if isDDPProduct is set to true', () => {
      const { wrapper } = render({
        ...initialProps,
        isDDPProduct: true,
      })
      expect(wrapper.find('.OrderProducts-productSize')).toHaveLength(0)
    })

    it('display product size if isDDPProduct is set to false', () => {
      const { wrapper } = render({
        ...initialProps,
        isDDPProduct: false,
      })
      expect(wrapper.find('.OrderProducts-productSize')).toHaveLength(1)
    })

    describe('ResponsiveImage', () => {
      it('should render ResponsiveImage', () => {
        const props = {
          ...initialProps,
          baseImageUrl: 'url',
        }
        const { wrapper } = render(props)
        const responsiveImage = wrapper.find(ResponsiveImage)
        expect(responsiveImage).toHaveLength(1)
        expect(responsiveImage.prop('amplienceUrl')).toBe(props.baseImageUrl)
      })

      describe('if shouldLinkToPdp prop true', () => {
        describe('if sourceUrl prop is provided', () => {
          it('should render ResponsiveImage inside of a Link', () => {
            const props = {
              ...initialProps,
              baseImageUrl: 'url',
              shouldLinkToPdp: true,
              sourceUrl:
                'http://ts-acc1.acc.digital.arcadiagroup.co.uk/en/tsuk/product/mid-blue-jamie-jeans-7947602',
            }
            const { wrapper } = render(props)
            const responsiveImage = wrapper.find(ResponsiveImage)
            expect(responsiveImage.parent().is(Link)).toBe(true)
            const link = wrapper.find('.OrderProducts-mediaLeft').find(Link)
            expect(link.prop('to')).toEqual(getRouteFromUrl(props.sourceUrl))
          })

          it('should dispatch GTM action if link is clicked', () => {
            const props = {
              ...initialProps,
              baseImageUrl: 'url',
              shouldLinkToPdp: true,
              sourceUrl:
                'http://ts-acc1.acc.digital.arcadiagroup.co.uk/en/tsuk/product/mid-blue-jamie-jeans-7947602',
            }
            const { wrapper } = render(props)
            expect(initialProps.sendAnalyticsClickEvent).not.toHaveBeenCalled()

            const responsiveImage = wrapper.find(ResponsiveImage)
            responsiveImage.parent().simulate('click')
            expect(initialProps.sendAnalyticsClickEvent).toHaveBeenCalledTimes(
              1
            )
            expect(initialProps.sendAnalyticsClickEvent).toHaveBeenCalledWith({
              category: GTM_CATEGORY.SHOPPING_BAG,
              action: GTM_ACTION.CLICKED,
              label: GTM_LABEL.PRODUCT_DETAILS,
            })
          })
        })

        describe('if sourceUrl prop is not provided', () => {
          it('should NOT render ResponsiveImage inside of a Link', () => {
            const props = {
              ...initialProps,
              baseImageUrl: 'url',
              shouldLinkToPdp: false,
              sourceUrl: undefined,
            }
            const { wrapper } = render(props)
            const responsiveImage = wrapper.find(ResponsiveImage)
            expect(responsiveImage.parent().is('div')).toBe(true)
          })
        })
      })

      describe('if sourceUrl prop not provided', () => {
        it('should NOT render ResponsiveImage inside of a Link', () => {
          const props = {
            ...initialProps,
            baseImageUrl: 'url',
            shouldLinkToPdp: false,
            sourceUrl:
              'http://ts-acc1.acc.digital.arcadiagroup.co.uk/en/tsuk/product/mid-blue-jamie-jeans-7947602',
          }
          const { wrapper } = render(props)
          const responsiveImage = wrapper.find(ResponsiveImage)
          expect(responsiveImage.parent().is('div')).toBe(true)
        })
      })
    })

    describe('header', () => {
      it('should render a header ', () => {
        const props = {
          ...initialProps,
          baseImageUrl: 'url',
        }
        const { wrapper } = render(props)
        const header = wrapper.find('header.OrderProducts-productName')
        expect(header).toHaveLength(1)
      })

      describe('if shouldLinkToPdp prop true', () => {
        describe('if sourceUrl prop is provided', () => {
          it('render header inside of a Link', () => {
            const props = {
              ...initialProps,
              baseImageUrl: 'url',
              shouldLinkToPdp: true,
              sourceUrl:
                'http://ts-acc1.acc.digital.arcadiagroup.co.uk/en/tsuk/product/mid-blue-jamie-jeans-7947602',
            }
            const { wrapper } = render(props)
            const header = wrapper.find('header.OrderProducts-productName')
            expect(header.parent().is(Link)).toBe(true)
            const link = wrapper.find('.OrderProducts-mediaBody').find(Link)
            expect(link.prop('to')).toEqual(getRouteFromUrl(props.sourceUrl))
          })
        })

        describe('if sourceUrl prop is not provided', () => {
          it('should not render header inside of Link', () => {
            const props = {
              ...initialProps,
              baseImageUrl: 'url',
              shouldLinkToPdp: false,
              sourceUrl: undefined,
            }
            const { wrapper } = render(props)
            const header = wrapper.find('header.OrderProducts-productName')
            expect(header.parent().is('div')).toBe(true)
          })
        })
      })

      describe('if shouldLinkToPdp prop is false', () => {
        it('should not render header inside of Link', () => {
          const props = {
            ...initialProps,
            baseImageUrl: 'url',
            shouldLinkToPdp: false,
            sourceUrl:
              'http://ts-acc1.acc.digital.arcadiagroup.co.uk/en/tsuk/product/mid-blue-jamie-jeans-7947602',
          }
          const { wrapper } = render(props)
          const header = wrapper.find('header.OrderProducts-productName')
          expect(header.parent().is('div')).toBe(true)
        })
      })
    })

    describe('selling fast badge', () => {
      describe('shouldDisplaySocialProofLabel is true and the product is trending', () => {
        it('should render selling fast badge', () => {
          const props = {
            ...initialProps,
            isTrending: true,
            shouldDisplaySocialProofLabel: true,
          }

          const { wrapper } = render(props)
          const badge = wrapper.find(SocialProofOrderProductBadge)

          expect(badge.exists()).toBe(true)
        })
      })

      describe('shouldDisplaySocialProofLabel is true but the product is not trending', () => {
        it('should not render selling fast badge', () => {
          const props = {
            ...initialProps,
            isTrending: false,
            shouldDisplaySocialProofLabel: true,
          }

          const { wrapper } = render(props)
          const badge = wrapper.find(SocialProofOrderProductBadge)

          expect(badge.exists()).toBe(false)
        })
      })

      describe('shouldDisplaySocialProofLabel is false', () => {
        it('should not render the badge', () => {
          const props = {
            ...initialProps,
            isTrending: true,
            shouldDisplaySocialProofLabel: false,
          }

          const { wrapper } = render(props)
          const badge = wrapper.find(SocialProofOrderProductBadge)

          expect(badge.exists()).toBe(false)
        })
      })
    })
  })
})
