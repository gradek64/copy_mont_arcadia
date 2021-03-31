import {
  buildComponentRender,
  mountRender,
  shallowRender,
  withStore,
} from 'test/unit/helpers/test-component'
import Image from '../Image/Image'
import CheckoutViewBagMobile, { Link } from './CheckoutViewBagMobile'
import { compose } from 'ramda'

const productMock = (name, quantity = 1) => ({
  name,
  orderItemId: name,
  assets: [
    {
      assetType: 'IMAGE_SMALL',
      index: 1,
      url: 'IMAGE_SMALL_URL',
    },
    {
      assetType: 'IMAGE_THUMB',
      index: 1,
      url: 'IMAGE_THUMB_URL',
    },
  ],
  baseImageUrl: 'BASE_IMAGE_URL',
  quantity,
})

const bagProducts = (numberOfProducts) =>
  Array.from(Array(numberOfProducts)).map((_, index) =>
    productMock(`product${index}`)
  )

describe('<CheckoutViewBagMobile />', () => {
  const initialProps = {
    openMiniBag: () => {},
    bagProducts: bagProducts(2),
    orderSummaryError: {},
    totalCost: '£128.00',
    l: (x) => x,
  }

  const render = compose(
    mountRender,
    withStore({
      config: {
        brandName: 'Topshop',
        brandCode: 'tsuk',
      },
    })
  )

  const renderComponent = buildComponentRender(
    shallowRender,
    CheckoutViewBagMobile.WrappedComponent
  )

  const mountRenderComponent = buildComponentRender(
    render,
    CheckoutViewBagMobile.WrappedComponent
  )

  describe('@renders', () => {
    it('renders the checkout view bag without error', () => {
      const { getTree } = renderComponent(initialProps)

      expect(getTree()).toMatchSnapshot()
    })

    it('renders an Image per each product', () => {
      const { wrapper } = renderComponent(initialProps)

      expect(wrapper.find(Image).length).toBe(2)
    })

    it('renders IMAGE_THUMB_URL if available', () => {
      const productQuantity = 4
      const { wrapper } = renderComponent({
        ...initialProps,
        bagProducts: [productMock('product1_size12', productQuantity)],
      })

      expect(wrapper.find(Image).prop('src')).toBe('IMAGE_THUMB_URL')
      expect(
        wrapper.find('.CheckoutViewBagMobile--productQuantity').text()
      ).toBe(`x${productQuantity}`)
    })

    it('renders BASE_IMAGE_URL if IMAGE_THUMB_URL is not available', () => {
      const productQuantity = 4
      const { wrapper } = renderComponent({
        ...initialProps,
        bagProducts: [
          { ...productMock('product1_size12', productQuantity), assets: [] },
        ],
      })

      expect(wrapper.find(Image).prop('src')).toBe('BASE_IMAGE_URL')
      expect(
        wrapper.find('.CheckoutViewBagMobile--productQuantity').text()
      ).toBe(`x${productQuantity}`)
    })

    it('renders products in reverse order', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        bagProducts: bagProducts(3),
      })

      expect(wrapper.find(Image).length).toBe(3)
      expect(wrapper.find(Image).get(0).props.alt).toBe('product2')
      expect(wrapper.find(Image).get(1).props.alt).toBe('product1')
      expect(wrapper.find(Image).get(2).props.alt).toBe('product0')
    })

    describe('products quantity', () => {
      it('renders the product quantity if quantity > 1', () => {
        const productQuantity = 4
        const { wrapper } = renderComponent({
          ...initialProps,
          bagProducts: [productMock('product1_size12', productQuantity)],
        })

        expect(wrapper.find(Image).length).toBe(1)
        expect(
          wrapper.find('.CheckoutViewBagMobile--productQuantity').text()
        ).toBe(`x${productQuantity}`)
      })

      it('does not render the product quantity if quantity === 1', () => {
        const productQuantity = 1
        const { wrapper } = renderComponent({
          ...initialProps,
          bagProducts: [productMock('product1_size12', productQuantity)],
        })

        expect(wrapper.find(Image).length).toBe(1)
        expect(
          wrapper.find('.CheckoutViewBagMobile--productQuantity').length
        ).toBe(0)
      })
    })

    describe('products in my bag are < 5', () => {
      it('does not render the remaining products number ', () => {
        const numberOfProducts = 4
        const { wrapper } = renderComponent({
          ...initialProps,
          bagProducts: bagProducts(numberOfProducts),
        })
        expect(
          wrapper.find('.CheckoutViewBagMobile--remainingProductsNumberLink')
            .length
        ).toBe(0)
        expect(wrapper.find(Image).length).toBe(numberOfProducts)
      })
    })

    describe('products in my bag are === 5', () => {
      it('does not render the remaining products number ', () => {
        const numberOfProducts = 5
        const { wrapper } = renderComponent({
          ...initialProps,
          bagProducts: bagProducts(numberOfProducts),
        })

        expect(
          wrapper.find('.CheckoutViewBagMobile--remainingProductsNumberLink')
            .length
        ).toBe(0)
        expect(wrapper.find(Image).length).toBe(numberOfProducts)
      })
    })

    describe('products in my bag are > 5', () => {
      it('renders the remaining products number and 4 products', () => {
        const numberOfProducts = 6

        const { wrapper } = mountRenderComponent({
          ...initialProps,
          bagProducts: bagProducts(numberOfProducts),
        })

        expect(wrapper.find(Image).length).toBe(4)
        expect(
          wrapper.find('.CheckoutViewBagMobile--remainingProductsNumber').length
        ).toBe(1)
        expect(
          wrapper.find('.CheckoutViewBagMobile--remainingProductsNumber').text()
        ).toBe('+2')
      })
    })
  })

  describe('@Products click', () => {
    it('fires openMiniBag function', () => {
      const openMiniBag = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        openMiniBag,
      })

      wrapper
        .find(Link)
        .first()
        .simulate('click')

      expect(openMiniBag).toHaveBeenCalledTimes(1)
    })
  })

  describe('@ViewBag click', () => {
    it('fires openMiniBag function', () => {
      const openMiniBag = jest.fn()
      const { wrapper } = renderComponent({
        ...initialProps,
        openMiniBag,
      })

      wrapper
        .find('.CheckoutViewBagMobile--viewBag')
        .first()
        .simulate('click')

      expect(openMiniBag).toHaveBeenCalledTimes(1)
    })
  })
})
