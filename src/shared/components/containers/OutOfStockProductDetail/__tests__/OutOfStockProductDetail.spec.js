import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import productMockData from '../../../../../../test/mocks/product-detail'
import OutOfStockProductDetail from '../OutOfStockProductDetail'
import ResponsiveImage from '../../../common/ResponsiveImage/ResponsiveImage'
import Price from '../../../common/Price/Price'
import OOSProductDescription from '../../../common/OOSProductDescription/OOSProductDescription'
import DressipiRecommendationsRail from '../../../common/Recommendations/DressipiRecommendationsRail'
import Recommendations from '../../../common/Recommendations/Recommendations'

const productMock = {
  ...productMockData,
  amplienceAssets: {
    images: ['http://www.images.com/root'],
  },
}

describe('<OutOfStockProductDetail />', () => {
  const defaultProps = {
    setPredecessorPage: jest.fn(),
    isMobile: false,
    product: productMock,
    currentProductGroupingId: 'GroupingA',
    isFeatureDressipiRecommendationsEnabled: false,
  }
  const renderComponent = testComponentHelper(
    OutOfStockProductDetail.WrappedComponent
  )

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render the main page header and display the correct text', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      const header = wrapper.find('.OutOfStockProductDetail-pageHeading')

      expect(header).toHaveLength(1)
      expect(header.text()).toEqual('Item not available')
    })

    describe('Product Section', () => {
      it('should render the product wrapper', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
        })
        const productWrapper = wrapper.find(
          '.OutOfStockProductDetail-productWrapper'
        )
        expect(productWrapper).toHaveLength(1)
      })

      describe('Product Wrapper Image Section', () => {
        it('should render the ResponsiveImage with the correct props', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          const productWrapper = wrapper.find(
            '.OutOfStockProductDetail-productWrapper'
          )
          const productWrapperImage = productWrapper.find(
            '.OutOfStockProductDetail-productWrapperImage'
          )
          const responsiveImage = productWrapperImage.find(ResponsiveImage)

          expect(productWrapperImage).toHaveLength(1)
          expect(responsiveImage).toHaveLength(1)
          expect(responsiveImage.prop('src')).toBe(
            'http://media.topshop.com/wcsstore/TopShop/images/catalog/07L04JWNA_thumb.jpg'
          )
          expect(responsiveImage.prop('amplienceUrl')).toBe(
            'http://www.images.com/root'
          )
          expect(responsiveImage.prop('sizes')).toEqual({
            mobile: 170,
            tablet: 170,
            desktop: 170,
          })
          expect(responsiveImage.prop('className')).toBe('MiniProduct-image')
          expect(responsiveImage.prop('aria-hidden')).toEqual('true')
        })

        it('should render Responsive Image with null for amplienceUrl when amplienceAssets are undefined', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            product: productMockData,
          })
          const responsiveImage = wrapper.find(ResponsiveImage)
          expect(responsiveImage.prop('amplienceUrl')).toBe(null)
        })
      })
      describe('Product Wrapper Description Section', () => {
        it('should render `.OutOfStockProductDetail-productWrapperDescription` div', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })

          expect(
            wrapper.find('.OutOfStockProductDetail-productWrapperDescription')
          ).toHaveLength(1)
        })

        it('should render `.OutOfStockProductDetail-productWrapperDescriptionMinimal` div', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })

          expect(
            wrapper.find(
              '.OutOfStockProductDetail-productWrapperDescriptionMinimal'
            )
          ).toHaveLength(1)
        })

        it('should render the `<h2/>` tag with the correct text', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          const h2 = wrapper.find(
            '.OutOfStockProductDetail-productWrapperDescriptionMinimal h2'
          )
          expect(h2).toHaveLength(1)
          expect(h2.text()).toBe('Tencel Buffalo Duster Coat')
        })

        it('should render the `<Price />` component with the correct props', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          const productWrapperDescriptionMinimal = wrapper.find(
            '.OutOfStockProductDetail-productWrapperDescriptionMinimal'
          )
          const price = productWrapperDescriptionMinimal.find(Price)

          expect(price).toHaveLength(1)
          expect(price.prop('price')).toBe('85.00')
        })
      })

      describe('Button View All categories', () => {
        it('Should render Shop All text plus category', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          const button = wrapper.find('.OutOfStockProductDetail-shopAllBtn')
          expect(button.children().text()).toContain('SHOP ALL Dresses')
        })

        it('Should render category label only if category contains text All', () => {
          const propItems = {
            ...defaultProps,
            product: {
              ...productMock,
              breadcrumbs: [
                {
                  label: 'Home',
                  url: '/',
                },
                {
                  label: 'View All Dresses',
                  category: '346776',
                  url: '/en/en/category/test-649134',
                },
                {
                  label: 'Item product detail',
                  category: '346776,3418034',
                },
              ],
            },
          }
          const { wrapper } = renderComponent(propItems)
          const button = wrapper.find('.OutOfStockProductDetail-shopAllBtn')
          expect(button.children().text()).toContain('View All Dresses')
        })

        it('should not render Shop All button if the product has no category', () => {
          const props = {
            ...defaultProps,
            product: {
              ...defaultProps.product,
              breadcrumbs: [
                {
                  label: 'Home',
                  url: '/',
                },
                {
                  label: 'Red Paisley Button Tie Top',
                },
              ],
            },
          }
          const { getTree } = renderComponent(props)
          expect(getTree()).toMatchSnapshot()
        })
      })

      describe('<OOSProductDescription />', () => {
        describe('when is not mobile', () => {
          it('should render inside `.OutOfStockProductDetail-productWrapperDescription`', () => {
            const { wrapper } = renderComponent({
              ...defaultProps,
            })
            const productWrapperDescription = wrapper.find(
              '.OutOfStockProductDetail-productWrapperDescription'
            )
            const description = productWrapperDescription.find(
              OOSProductDescription
            )

            expect(description).toHaveLength(1)
            expect(description.prop('description')).toBe(
              'Invest in a statement coat this season. We’re loving this Tencel buffalo duster coat, crafted in a soft blend, it features a midi length and button down placket to the front. Finished with multiple pockets. 100% Lyocell. Machine wash. &lt;br&gt;&lt;b&gt;Model&#39;s height is 5&#39;10&#39;&#39;'
            )
            expect(description.prop('header')).toBe('Product Details')
          })
        })

        describe('when is mobile', () => {
          it('should render outside `.OutOfStockProductDetail-productWrapperDescription`', () => {
            const { wrapper } = renderComponent({
              ...defaultProps,
              isMobile: true,
            })
            const productWrapperDescription = wrapper.find(
              '.OutOfStockProductDetail-productWrapperDescription'
            )
            const description = productWrapperDescription.find(
              OOSProductDescription
            )

            expect(description).toHaveLength(0)
            expect(wrapper.find(OOSProductDescription)).toHaveLength(1)
          })
        })
      })
    })
    describe('when `isFeatureDressipiRecommendationsEnabled` is true', () => {
      it('should render the `<DressipiReccomendationsRail />` component and not the `<Recommendations />` one', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          isFeatureDressipiRecommendationsEnabled: true,
        })
        const dressipiRecommendations = wrapper.find(
          DressipiRecommendationsRail
        )
        const recommendations = wrapper.find(Recommendations)

        expect(recommendations).toHaveLength(0)
        expect(dressipiRecommendations).toHaveLength(1)
      })
    })

    describe('when `isFeatureDressipiRecommendationsEnabled` is false', () => {
      it('should render the`<Recommendations />` component and not the `<DressipiReccomendationsRail />` one', () => {
        const { wrapper } = renderComponent(defaultProps)
        const dressipiRecommendations = wrapper.find(
          DressipiRecommendationsRail
        )
        const recommendations = wrapper.find(Recommendations)

        expect(dressipiRecommendations).toHaveLength(0)
        expect(recommendations).toHaveLength(1)
      })
    })
  })
})
