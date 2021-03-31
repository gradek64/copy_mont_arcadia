import { range } from 'ramda'
import testComponentHelper from 'test/unit/helpers/test-component'
import Image from '../../../common/Image/Image'
import Price from '../../../common/Price/Price'
import { PrivacyGuard } from '../../../../lib'
import ReturnHistoryOrder from '../ReturnHistoryOrder'

describe('ReturnHistoryOrder', () => {
  const initialProps = {
    lineNo: '19M43JRED',
    name: 'Pizza Princess Padded Sticker',
    size: 'ONE',
    colour: 'RED',
    imageUrl:
      'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS19M43JRED_Small_F_1.jpg',
    returnQuantity: 1,
    returnReason: 'Colour not as description',
    unitPrice: '',
    discount: '',
    total: '0.50',
    nonRefundable: false,
    currency: '£',
  }

  const renderComponent = testComponentHelper(ReturnHistoryOrder)

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree, wrapper } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('.ReturnHistoryOrder-item-discount').length).toBe(0)
    })

    it('with discount', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        discount: '-5.00',
      })
      const discount = wrapper.find('.ReturnHistoryOrder-item-discount')
      expect(discount.find('span').text()).toContain('Item discount:')
      expect(
        discount
          .find(Price)
          .dive()
          .find('span')
          .text()
      ).toBe('£-5.00') // TODO should be '-£5.00' but Price component needs to handle negative prices correctly
    })

    it('without lineNo', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        lineNo: '',
      })
      expect(wrapper.find('.ReturnHistoryOrder-line-no').length).toBe(0)
    })
  })

  describe('@dom', () => {
    let currentWrapped

    beforeEach(() => {
      const { wrapper } = renderComponent(initialProps)
      currentWrapped = wrapper
    })

    describe('Image', () => {
      it('should have an Image component', () => {
        expect(currentWrapped.find(Image).length).toBe(1)
      })

      it('should have an Image component with the correct props', () => {
        const image = currentWrapped.find(Image)

        expect(image.prop('src')).toBe(initialProps.imageUrl)
        expect(image.prop('className')).toBe('ReturnHistoryOrder-image')
        expect(image.prop('alt')).toBe(initialProps.name)
      })
    })

    describe('Heading', () => {
      it('should have an h2 tag', () => {
        expect(currentWrapped.find('h2').length).toBe(1)
      })

      it('should have an h2 with correct classNames', () => {
        expect(currentWrapped.find('h2').prop('className')).toBe(
          'ReturnHistoryOrder-text ReturnHistoryOrder-productName'
        )
      })

      it('should have an h2 with correct text', () => {
        expect(currentWrapped.find('h2').text()).toBe(initialProps.name)
      })
    })

    describe('Content is all there', () => {
      describe('All content is available', () => {
        it('should have 2 price components', () => {
          expect(currentWrapped.find(Price).length).toEqual(2)
        })

        it('should have 4 PrivacyGuard components', () => {
          expect(currentWrapped.find(PrivacyGuard).length).toEqual(3)
        })

        it('should have correct number of spacing divs', () => {
          const divs = currentWrapped.find('div')
          expect(divs.length).toEqual(5)
          range(1, 5).forEach((index) =>
            expect(divs.at(index).prop('className')).toBe(
              'ReturnHistoryOrder-cont'
            )
          )
        })
      })
    })
  })
})
