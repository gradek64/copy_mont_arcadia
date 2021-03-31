import { getPageData } from '../get-page-data'
import * as routingSelectors from '../../../../../shared/selectors/routingSelectors'
import * as productSelectors from '../../../../../shared/selectors/productSelectors'
import * as refinementsSelectors from '../../../../../shared/selectors/refinementsSelectors'
import { getCategoryId } from '../../../../../shared/selectors/navigationSelectors'
import * as pageViewUtils from '../page-view-utils'

jest.mock('../../../../../shared/selectors/routingSelectors')
jest.mock('../../../../../shared/selectors/productSelectors')
jest.mock('../../../../../shared/selectors/refinementsSelectors')
jest.mock('../../../../../shared/selectors/navigationSelectors')
jest.mock('../page-view-utils')

describe('getPageData()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('PLP page data', () => {
    beforeEach(() => {
      routingSelectors.getLocationQuery.mockReturnValue({})
      productSelectors.getPlpBreadcrumbs.mockReturnValue([])
      productSelectors.getProductsSearchResultsTotal.mockReturnValue(10)
      refinementsSelectors.getSelectedRefinements.mockReturnValue([])
      getCategoryId.mockReturnValue(1456)
    })

    it('should return the correct type', () => {
      expect(getPageData('plp').type).toBe('Category Display')
    })

    it('should return the correct category when there is a search query', () => {
      routingSelectors.getLocationQuery.mockReturnValue({ q: 'foo' })
      expect(getPageData('plp').category).toBe('Search')
    })

    it('should return data with search results total for browse category and search results page', () => {
      expect(getPageData('plp').searchResults).toBe('10')
    })

    it('should return the correct category when there is no search query', () => {
      productSelectors.getPlpBreadcrumbs.mockReturnValue([
        { label: 'fish' },
        { label: 'frog' },
        { label: 'goat' },
      ])

      expect(getPageData('plp').category).toBe('Category:frog > goat')
    })

    it('should return the correct category ID when there is no search query', () => {
      expect(getPageData('plp').categoryId).toBe('1456')
    })

    it('should return a flag set to false when the page is not filtered', () => {
      expect(getPageData('plp').filteredPage).toBe(false)
    })

    describe('when the page is filtered', () => {
      beforeEach(() => {
        refinementsSelectors.getSelectedRefinements.mockReturnValue([
          { key: 'frog', value: 'legs' },
          { key: 'fish', value: 'feet' },
        ])
      })

      it('should return a flag set to true', () => {
        expect(getPageData('plp').filteredPage).toBe(true)
      })

      it('should return a list of applied filters', () => {
        expect(getPageData('plp').appliedFilters).toEqual({
          frog: 'legs',
          fish: 'feet',
        })
      })
    })
  })

  it('should return the correct data for page: pdp', () => {
    productSelectors.getCurrentProduct.mockReturnValue({
      lineNumber: 'some line no.',
      name: 'some name',
    })
    expect(getPageData('pdp')).toEqual({
      type: 'Product Display',
      category: 'Prod Detail:(some line no.)some name',
    })
  })

  it('should return the correct data for page: bundle', () => {
    productSelectors.getCurrentProduct.mockReturnValue({
      lineNumber: 'some line no.',
      name: 'some name',
    })
    expect(getPageData('bundle')).toEqual({
      type: 'Product Display',
      category: 'Prod Detail:(some line no.)some name',
    })
  })

  it('should return the correct data for page: home', () => {
    expect(getPageData('home')).toEqual({
      type: 'Home Page',
      category: 'Home Page',
    })
  })

  it('should return the correct data for page: write-a-review', () => {
    expect(getPageData('write-a-review')).toEqual({
      type: 'Bazaar Voice',
      category: 'Category:Bazaar Voice',
    })
  })

  it('should return the correct data for page: mrCms-pages', () => {
    pageViewUtils.getFixedCmsPageName.mockReturnValue('Some Fixed Name')
    expect(getPageData('mrCms-pages')).toEqual({
      type: 'Featured Page',
      category: 'Some Fixed Name',
    })
  })

  it('should return the correct data for page: cms-pages', () => {
    pageViewUtils.getFixedCmsPageName.mockReturnValue('Some Fixed Name')
    expect(getPageData('cms-pages')).toEqual({
      type: 'Featured Page',
      category: 'Some Fixed Name',
    })
  })

  it('should return the correct data for page: style-adviser', () => {
    pageViewUtils.getPageTitle.mockReturnValue('Some Page Title')
    expect(getPageData('style-adviser')).toEqual({
      type: 'Featured Page',
      category: 'Some Page Title',
    })
  })

  it('should return the correct data for page: store-locator', () => {
    expect(getPageData('store-locator')).toEqual({
      type: 'Store Finder',
      category: 'Store Finder',
    })
  })

  it('should return the correct data for page: change-password', () => {
    expect(getPageData('change-password')).toEqual({
      type: 'My Account',
      category: 'My Account > My Password',
    })
  })

  it('should return the correct data for page: change-shipping-destination', () => {
    expect(getPageData('change-shipping-destination')).toEqual({
      type: 'Change Shipping',
      category: 'Change Shipping',
    })
  })

  it('should return the correct data for page: collect-from-store', () => {
    expect(getPageData('collect-from-store')).toEqual({
      type: 'Store Finder',
      category: 'Store Finder Checkout',
    })
  })

  it('should return the correct data for page: delivery-details', () => {
    expect(getPageData('delivery-details')).toEqual({
      type: 'Delivery Details',
      category: 'Checkout',
    })
  })

  it('should return the correct data for page: checkout-login', () => {
    expect(getPageData('checkout-login')).toEqual({
      type: 'Register/Logon',
      category: 'Register/Logon',
    })
  })

  it('should return the correct data for page: order-completed', () => {
    expect(getPageData('order-completed')).toEqual({
      type: 'Order Confirmed',
      category: 'Order Confirmed',
    })
  })

  it('should return the correct data for page: payment-details', () => {
    expect(getPageData('payment-details')).toEqual({
      type: 'Payment Details',
      category: 'Payment Details Form',
    })
  })

  it('should return the correct data for page: delivery-payment', () => {
    expect(getPageData('delivery-payment')).toEqual({
      type: 'Delivery Payment',
      category: 'Delivery Payment Form',
    })
  })

  it('should return the correct data for page: my-checkout-details', () => {
    expect(getPageData('my-checkout-details')).toEqual({
      type: 'My Account',
      category: 'My Account > My Checkout Details',
    })
  })

  it('should return the correct data for page: my-details', () => {
    expect(getPageData('my-details')).toEqual({
      type: 'My Account',
      category: 'My Account > My Details',
    })
  })

  it('should return the correct data for page: my-account', () => {
    expect(getPageData('my-account')).toEqual({
      type: 'My Account',
      category: 'My Account',
    })
  })

  it('should return the correct data for page: order-details', () => {
    expect(getPageData('order-details')).toEqual({
      type: 'My Account',
      category: 'My Account > My Order Details',
    })
  })

  it('should return the correct data for page: my-orders', () => {
    expect(getPageData('my-orders')).toEqual({
      type: 'My Account',
      category: 'My Account > My Orders',
    })
  })

  it('should return the correct data for page: register-login', () => {
    expect(getPageData('register-login')).toEqual({
      type: 'Register/Logon',
      category: 'Register/Logon',
    })
  })

  it('should return the correct data for page: not-found', () => {
    expect(getPageData('not-found')).toEqual({
      type: 'Error Page - 404',
      category: 'Error Page - 404',
    })
  })

  it('should return the correct data for page: find-in-store', () => {
    expect(getPageData('find-in-store')).toEqual({
      type: 'Store Finder',
      category: 'Store Finder Product',
    })
  })

  it('should return the correct data for page: reset-password', () => {
    expect(getPageData('reset-password')).toEqual({
      type: 'Reset Password',
      category: 'Reset Password',
    })
  })

  it('should return the correct data for page: wishlist', () => {
    routingSelectors.getPrevPath.mockReturnValue('direct link')
    expect(getPageData('wishlist')).toEqual({
      type: 'Wish List',
      category: 'Wish List',
      prevPath: 'direct link',
    })
  })

  it(`should return undefined for an unknown page`, () => {
    expect(getPageData('something-random')).not.toBeDefined()
  })
})
