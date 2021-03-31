import {
  TrackMyOrderButton,
  NotYetDispatchedButton,
  OrderItem,
  DeliveryDetailsHeader,
  StartAReturnButton,
} from '../HistoryDetailsComponents'

import testComponentHelper from 'test/unit/helpers/test-component'

const context = {
  l: jest.fn(),
}

describe('HistoryDetailsComponents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('TrackMyOrderButton', () => {
    const initialProps = {
      trackingUrlOfFirstItem: 'http://hvar/button.url',
      l: context.l,
    }

    const renderComponent = testComponentHelper(TrackMyOrderButton)
    it('Render button enabled', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
    it('Render button disabled', () => {
      const { getTree } = renderComponent({
        l: context.l,
      })
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('NotYetDispatchedButton', () => {
    const initialProps = {
      l: context.l,
    }
    const renderComponent = testComponentHelper(NotYetDispatchedButton)
    it('match snapshot', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('OrderItem', () => {
    const initialProps = {
      l: context.l,
      data: {
        key: 1,
        item: {
          lineNo: '02J50LBLK',
          name: 'MOTO Hook & Eye Joni Jeans',
          size: 'W2430',
          colour: 'BLACK',
          imageUrl:
            'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS02J50LBLK_Small_F_1.jpg',
          quantity: 1,
          unitPrice: '52.00',
          discount: '',
          total: '52.00',
          nonRefundable: false,
        },
      },
    }
    const renderComponent = testComponentHelper(OrderItem)
    it('match snapshot', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('DeliveryDetailsHeader', () => {
    const initialProps = {
      l: context.l,
      data: {
        method: 'shipping item ',
        date: '21 july 2019',
      },
    }
    const renderComponent = testComponentHelper(DeliveryDetailsHeader)
    it('match snapshot', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('StartAReturnButton', () => {
    const initialProps = {
      orderReturnUrl: 'http://www.startareturn.co.uk',
      ctaText: 'Start a return',
    }
    const renderComponent = testComponentHelper(StartAReturnButton)
    it('match snapshot', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
  })
})
