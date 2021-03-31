import renderComponentHelper from 'test/unit/helpers/test-component'

import HistoricalPrice from './HistoricalPrice'
import Price from '../Price/Price'
import isWasPrice from '../../../lib/is-was-price'
import QubitReact from 'qubit-react/wrapper'

jest.mock('../../../lib/is-was-price')

const renderComponent = renderComponentHelper(HistoricalPrice)

describe('<HistoricalPrice/>', () => {
  describe('@renders', () => {
    beforeEach(() => jest.resetAllMocks())

    const defaultProps = {
      price: '29.00',
    }

    it('renders a regular price', () => {
      const { wrapper } = renderComponent(defaultProps)
      expect(wrapper.find(Price).props().price).toBe('29.00')
    })

    it('renders a custom className', () => {
      const props = {
        ...defaultProps,
        className: 'HistoricalPrice-test',
      }
      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('.HistoricalPrice').hasClass('HistoricalPrice-test')
      ).toBe(true)
    })

    describe('rendering  qubit wrapper with correct props', () => {
      it('it checks if qubit component receives correct props', () => {
        const props = {
          price: '29.00',
          wasPrice: '35.00',
          wasWasPrice: '45.00',
        }
        const { wrapper } = renderComponent(props)
        const qubitWrapper = wrapper.find(QubitReact)

        expect(qubitWrapper.props().id).toBe('exp-323-discounted-pricing')
        expect(qubitWrapper.props().price).toEqual('29.00')
        expect(qubitWrapper.props().wasPrice).toEqual('35.00')
        expect(qubitWrapper.props().wasWasPrice).toEqual('45.00')
        expect(qubitWrapper.props().priceComponent).toEqual(Price)
        expect(qubitWrapper.props().isWasPrice).toEqual(isWasPrice)
      })
    })
  })
})
