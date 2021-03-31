import testComponentHelper from 'test/unit/helpers/test-component'
import OrderHistoryDetailsElement from '../OrderHistoryDetailsElement'
import Price from '../../../common/Price/Price'

describe('<OrderHistoryDetailsElement />', () => {
  const renderComponent = testComponentHelper(OrderHistoryDetailsElement)
  const initialProps = {}

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with imageUrl and productName', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        imageUrl: 'some/url.jpg',
        productName: 'Green top',
      })
      expect(
        getTreeFor(wrapper.find('.OrderHistoryDetailsElement-image'))
      ).toMatchSnapshot()
    })
    it('with productName', () => {
      const props = {
        ...initialProps,
        productName: 'Green top',
      }
      const { wrapper } = renderComponent(props)

      const productName = wrapper.find(
        '.OrderHistoryDetailsElement-content--productName'
      )
      expect(productName).toHaveLength(1)
      expect(productName.text()).toBe(props.productName)
    })
    it('with productCode', () => {
      const props = {
        ...initialProps,
        productCode: 'GR546',
      }
      const { wrapper } = renderComponent(props)

      const productCode = wrapper.find(
        '.OrderHistoryDetailsElement-content--productCode'
      )
      expect(productCode).toHaveLength(1)
      expect(productCode.text()).toBe(`Item code - ${props.productCode}`)
    })
    it('with size', () => {
      const props = {
        ...initialProps,
        size: '6',
      }
      const { wrapper } = renderComponent(props)

      const size = wrapper.find('.OrderHistoryDetailsElement-content--size')
      expect(size).toHaveLength(1)
      expect(size.text()).toBe(`Size: ${props.size}`)
    })
    it('with price', () => {
      expect(
        renderComponent({
          ...initialProps,
          price: '50.00',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with total', () => {
      const props = {
        ...initialProps,
        total: '50.00',
      }
      const { wrapper } = renderComponent(props)

      const total = wrapper.find('.OrderHistoryDetailsElement-content--total')
      expect(total).toHaveLength(1)
      expect(total.childAt(0).text()).toBe(`Total`)
      const totalPriceEl = total.find(Price)
      expect(totalPriceEl).toHaveLength(1)
      expect(totalPriceEl.prop('price')).toBe(props.total)
    })
    it('with colour', () => {
      const props = {
        ...initialProps,
        colour: 'Green',
      }
      const { wrapper } = renderComponent(props)

      const colour = wrapper.find('.OrderHistoryDetailsElement-content--colour')
      expect(colour).toHaveLength(1)
      expect(colour.text()).toBe(`Colour: ${props.colour}`)
    })
    it('isDDPProduct', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isDDPProduct: true,
        colour: 'Green',
        size: 'L',
      })

      expect(
        wrapper.find('.OrderHistoryDetailsElement-content--colour').exists()
      ).toBe(false)
      expect(
        wrapper.find('.OrderHistoryDetailsElement-content--size').exists()
      ).toBe(false)
    })
    it('with quantity', () => {
      const props = {
        ...initialProps,
        quantity: 2,
      }
      const { wrapper } = renderComponent(props)

      const quantity = wrapper.find(
        '.OrderHistoryDetailsElement-content--quantity'
      )
      expect(quantity).toHaveLength(1)
      expect(quantity.text()).toBe(`Quantity: ${props.quantity}`)
    })
  })
})
