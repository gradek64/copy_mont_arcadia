import {
  sortOrdersByTrackingNumber,
  orderLinesSortedWithTracking,
} from '../order-details'
import {
  hasNoTracking,
  hasTrackingAvailable,
  hasDDP,
} from '../../constants/trackingTypes'

describe('order-details', () => {
  const orderLines = [
    {
      lineNo: '04M70NWHT',
      name: 'Satsuma Retro T-Shirt (- TRACKING YES)',
      size: '8',
      isDDPProduct: false,
      colour: 'WHITE',
      baseImageUrl: 'https://images.topshop.com/i/TopShop/TS04M70NWHT_M_1',
      imageUrl:
        'https://images.topshop.com/i/TopShop/TS04M70NWHT_M_1.jpg?$Small$',
      quantity: 1,
      unitPrice: '16.00',
      total: '16.00',
      nonRefundable: false,
      discount: '',
      retailStoreTrackingUrl:
        'https://narvar.com/tracking/topshop/narvar-speedee?tracking_numbers=1Z9567242&order_number=3XMntYBaWAI-61-&locale=en_GB',
      trackingAvailable: true,
      trackingNumber: '9567242',
    },
    {
      lineNo: '26S10NBLK',
      name: 'PETITE Broderie Shorts 1  (- TRACKING YES)',
      size: '6',
      isDDPProduct: false,
      colour: 'BLACK',
      baseImageUrl: 'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1',
      imageUrl:
        'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1.jpg?$Small$',
      quantity: 1,
      unitPrice: '25.00',
      total: '25.00',
      nonRefundable: false,
      discount: '',
      retailStoreTrackingUrl:
        'https://narvar.com/tracking/topshop/narvar-speedee?tracking_numbers=1Z9567242&order_number=3XMntYBaWAI-61-&locale=en_GB',
      trackingAvailable: true,
      trackingNumber: '9567242',
    },
    {
      lineNo: '26S10NBL33K',
      name: 'DDP DDP  (- DDP YES)',
      size: '6',
      colour: 'BLACK',
      baseImageUrl: 'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1',
      imageUrl:
        'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1.jpg?$Small$',
      quantity: 1,
      unitPrice: '25.00',
      total: '25.00',
      nonRefundable: false,
      discount: '',
      trackingAvailable: false,
      isDDPProduct: true,
    },
    {
      lineNo: '26S10NBL332222K',
      name: 'NO TRACKING ITEM',
      size: '6',
      colour: 'BLACK',
      baseImageUrl: 'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1',
      imageUrl:
        'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1.jpg?$Small$',
      quantity: 1,
      unitPrice: '25.00',
      total: '25.00',
      nonRefundable: false,
      discount: '',
      trackingAvailable: false,
    },
  ]
  const expectedOrderlines = {
    hasTrackingAvailable: {
      '9567242': [
        {
          lineNo: '04M70NWHT',
          name: 'Satsuma Retro T-Shirt (- TRACKING YES)',
          size: '8',
          isDDPProduct: false,
          colour: 'WHITE',
          baseImageUrl: 'https://images.topshop.com/i/TopShop/TS04M70NWHT_M_1',
          imageUrl:
            'https://images.topshop.com/i/TopShop/TS04M70NWHT_M_1.jpg?$Small$',
          quantity: 1,
          unitPrice: '16.00',
          total: '16.00',
          nonRefundable: false,
          discount: '',
          retailStoreTrackingUrl:
            'https://narvar.com/tracking/topshop/narvar-speedee?tracking_numbers=1Z9567242&order_number=3XMntYBaWAI-61-&locale=en_GB',
          trackingAvailable: true,
          trackingNumber: '9567242',
        },
        {
          lineNo: '26S10NBLK',
          name: 'PETITE Broderie Shorts 1  (- TRACKING YES)',
          size: '6',
          isDDPProduct: false,
          colour: 'BLACK',
          baseImageUrl: 'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1',
          imageUrl:
            'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1.jpg?$Small$',
          quantity: 1,
          unitPrice: '25.00',
          total: '25.00',
          nonRefundable: false,
          discount: '',
          retailStoreTrackingUrl:
            'https://narvar.com/tracking/topshop/narvar-speedee?tracking_numbers=1Z9567242&order_number=3XMntYBaWAI-61-&locale=en_GB',
          trackingAvailable: true,
          trackingNumber: '9567242',
        },
      ],
    },
    hasDDP: [
      {
        lineNo: '26S10NBL33K',
        name: 'DDP DDP  (- DDP YES)',
        size: '6',
        colour: 'BLACK',
        baseImageUrl: 'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1',
        imageUrl:
          'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1.jpg?$Small$',
        quantity: 1,
        unitPrice: '25.00',
        total: '25.00',
        nonRefundable: false,
        discount: '',
        trackingAvailable: false,
        isDDPProduct: true,
      },
    ],
    hasNoTracking: [
      {
        lineNo: '26S10NBL332222K',
        name: 'NO TRACKING ITEM',
        size: '6',
        colour: 'BLACK',
        baseImageUrl: 'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1',
        imageUrl:
          'https://images.topshop.com/i/TopShop/TS26S10NBLK_M_1.jpg?$Small$',
        quantity: 1,
        unitPrice: '25.00',
        total: '25.00',
        nonRefundable: false,
        discount: '',
        trackingAvailable: false,
      },
    ],
  }

  describe('sortOrdersByTrackingNumber', () => {
    it('Should group orders by type of tracking', () => {
      const trackedOrders = sortOrdersByTrackingNumber(orderLines)
      const trackOrdersKeys = Object.keys(trackedOrders)
      expect(trackOrdersKeys.includes(hasDDP)).toEqual(true)
      expect(trackOrdersKeys.includes(hasTrackingAvailable)).toEqual(true)
      expect(trackOrdersKeys.includes(hasNoTracking)).toEqual(true)
    })

    it('Should group the same tracking numbers together', () => {
      const trackedOrders = sortOrdersByTrackingNumber(orderLines)
      expect(trackedOrders).toEqual(expectedOrderlines)
    })
  })

  describe('orderLinesSortedWithTracking', () => {
    it('Should return {} if orderLines is empty', () => {
      expect(orderLinesSortedWithTracking([])).toEqual({})
    })
  })
})
