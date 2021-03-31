import React from 'react'
import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import { addDDPToBag, validateDDPForCountry } from '../ddpActions'
import { addToBag } from '../shoppingBagActions'
import { setGenericError } from '../../common/errorMessageActions'
import AddToBagModal from '../../../components/common/AddToBagModal/AddToBagModal'
import { isMobile } from '../../../selectors/viewportSelectors'
import { isInCheckout } from '../../../selectors/routingSelectors'

jest.mock('../errorMessageActions', () => ({
  setGenericError: jest.fn(),
}))
jest.mock('../shoppingBagActions', () => ({
  addToBag: jest.fn(),
  openMiniBag: jest.fn(() => ({ type: 'MOCK_openMiniBag', autoClose: true })),
}))
jest.mock('../../../selectors/viewportSelectors', () => ({
  isMobile: jest.fn(),
}))
jest.mock('../../../selectors/routingSelectors', () => ({
  isInCheckout: jest.fn(() => false),
}))
jest.mock('../../../lib/localisation', () => ({
  localise: jest.fn().mockImplementation((l, b, m) => m),
}))

jest.useFakeTimers()

const state = {
  config: {
    language: 'en-gb',
    brandName: 'topshop',
  },
  siteOptions: {
    ddp: {
      ddpProduct: {
        ddpSkus: [
          {
            sku: '100000001',
            default: true,
            catentryId: 32077179,
            timePeriod: '1',
          },
          {
            sku: '100000002',
            default: false,
            catentryId: 32077180,
            timePeriod: '2',
          },
        ],
        productId: '32077178',
        partNumber: 'ARCDDP',
        name: 'Topshop Unlimited',
      },
    },
  },
}

beforeEach(() => jest.clearAllMocks())

describe('DDP Actions', () => {
  describe('addDDPToBag', () => {
    beforeEach(() => jest.clearAllMocks())

    it('dispatches an error if DDP Flag is not enabled', async () => {
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: false,
          },
        },
      })
      const skuId = '100000001'
      const expectedAction = {
        type: 'MOCK_genericError',
        message: 'DDP is not enabled on this site',
      }
      setGenericError.mockImplementationOnce(() => expectedAction)

      await store.dispatch(addDDPToBag(skuId))
      expect(setGenericError).toBeCalledWith({
        message: 'DDP is not enabled on this site',
      })
      expect(store.getActions()).toEqual([expectedAction])
    })

    it('dispatches an error if DDP Product is already in the bag', async () => {
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
        shoppingBag: {
          bag: {
            products: [
              {
                productId: '32077178',
                isDDPProduct: true,
              },
            ],
          },
        },
      })
      const skuId = '100000001'
      const expectedAction = {
        type: 'MOCK_genericError',
        message: 'You already have a delivery subscription in your bag.',
      }
      setGenericError.mockImplementationOnce(() => expectedAction)

      await store.dispatch(addDDPToBag(skuId))
      expect(store.getActions()).toEqual([expectedAction])
    })

    it('dispatches an error if user is already a DDP subscriber', async () => {
      const store = mockStoreCreator({
        ...state,
        account: {
          user: {
            isDDPUser: true,
            isDDPRenewable: false,
          },
        },
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
        shoppingBag: {
          bag: {
            products: [
              {
                productId: '32077178',
                isDDPProduct: true,
              },
            ],
          },
        },
      })
      const skuId = '100000001'
      const expectedAction = {
        type: 'MOCK_genericError',
        message: 'Great news! You already have a delivery subscription.',
      }
      setGenericError.mockImplementationOnce(() => expectedAction)

      await store.dispatch(addDDPToBag(skuId))
      expect(store.getActions()).toEqual([expectedAction])
    })

    it('dispatches an error if DDP Item is not found', async () => {
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
      })
      const skuId = '123456789'
      const expectedAction = {
        type: 'MOCK_genericError',
        message: 'Invalid DDP Product',
      }
      setGenericError.mockImplementationOnce(() => expectedAction)

      await store.dispatch(addDDPToBag(skuId))
      expect(setGenericError).toBeCalledWith({ message: 'Invalid DDP Product' })
      expect(store.getActions()).toEqual([expectedAction])
    })

    it('adds DDP Product to bag - non-checkout', async () => {
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
      })
      const skuId = '100000001'
      const partNumber = '100000001'
      const catEntryId = 32077179

      addToBag.mockImplementationOnce(() => () => Promise.resolve())

      await store.dispatch(addDDPToBag(skuId))
      expect(addToBag).toBeCalledWith(
        catEntryId,
        skuId,
        partNumber,
        1,
        <AddToBagModal />
      )
    })

    it('adds DDP Product to bag - checkout', async () => {
      isInCheckout.mockReturnValueOnce(true)
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
      })
      const skuId = '100000001'
      const partNumber = '100000001'
      const catEntryId = 32077179
      addToBag.mockImplementationOnce(() => () => Promise.resolve())
      const expectedActions = [
        {
          type: 'AJAXCOUNTER_INCREMENT',
        },
        {
          type: 'AJAXCOUNTER_DECREMENT',
        },
      ]

      await store.dispatch(addDDPToBag(skuId))
      expect(addToBag).toBeCalledWith(catEntryId, skuId, partNumber, 1, null)
      expect(store.getActions()).toEqual(expectedActions)
    })
    it('adds DDP Product to bag if user is DDPUser but ddp is renewable', async () => {
      const store = mockStoreCreator({
        ...state,
        account: {
          user: {
            isDDPUser: true,
            isDDPRenewable: true,
          },
        },
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
      })
      const skuId = '100000001'
      const partNumber = '100000001'
      const catEntryId = 32077179
      addToBag.mockImplementationOnce(() => () => Promise.resolve())

      await store.dispatch(addDDPToBag(skuId))
      expect(addToBag).toBeCalledWith(
        catEntryId,
        skuId,
        partNumber,
        1,
        <AddToBagModal />
      )
    })

    it('displays bag drawer and triggers analytics when a product is added to bag in tablet or desktop devices and not on Checkout', async () => {
      isMobile.mockReturnValueOnce(false)
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
      })
      const skuId = '100000001'

      addToBag.mockImplementation(() => () => Promise.resolve())

      const expectedActions = [
        {
          type: 'AJAXCOUNTER_INCREMENT',
        },
        {
          type: 'AJAXCOUNTER_DECREMENT',
        },
        { type: 'MOCK_openMiniBag', autoClose: true },
        {
          eventName: 'bagDrawerDisplayed',
          payload: { bagDrawerTrigger: 'add to bag' },
          type: 'MONTY/ANALYTICS.SEND_DISPLAY_EVENT',
        },
      ]

      await store.dispatch(addDDPToBag(skuId))
      jest.runAllTimers()
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('does not display bag drawer or sends analytics when on mobile or Checkout', async () => {
      isMobile.mockReturnValueOnce(true)
      isInCheckout.mockReturnValueOnce(true)
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
      })
      const skuId = '100000001'

      addToBag.mockImplementation(() => () => Promise.resolve())

      const expectedActions = [
        { type: 'AJAXCOUNTER_INCREMENT' },
        { type: 'AJAXCOUNTER_DECREMENT' },
      ]

      await store.dispatch(addDDPToBag(skuId))
      jest.runAllTimers()
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('does not display bag drawer or sends analytics when promise is rejected', async () => {
      isMobile.mockReturnValueOnce(true)
      const store = mockStoreCreator({
        ...state,
        features: {
          status: {
            FEATURE_DDP: true,
          },
        },
      })
      const skuId = '100000001'

      addToBag.mockImplementation(() => () =>
        Promise.reject({ message: 'Error' })
      )
      setGenericError.mockImplementationOnce(() => ({
        type: 'MOCK_setGenericError',
      }))

      await store.dispatch(addDDPToBag(skuId))
      expect(store.getActions()).toEqual([
        { type: 'AJAXCOUNTER_INCREMENT' },
        { type: 'AJAXCOUNTER_DECREMENT' },
        { type: 'MOCK_setGenericError' },
      ])
    })
  })

  describe('validateDDPForCountry', () => {
    const store = mockStoreCreator({
      ...state,
      account: {
        user: {
          isDDPUser: true,
        },
      },
    })

    beforeEach(() => {
      setGenericError.mockClear()
    })

    it('does not display an error if delivery country is UK', () => {
      const country = 'United Kingdom'
      store.dispatch(validateDDPForCountry(country))
      expect(setGenericError).not.toHaveBeenCalled()
    })

    it('should call the setGenericError if delivery country is not UK', () => {
      const country = 'France'
      setGenericError.mockImplementationOnce(({ message }) => ({
        type: 'SET_ERROR',
        message,
      }))
      store.dispatch(validateDDPForCountry(country))
      expect(setGenericError).toHaveBeenCalledTimes(1)
    })
  })
})
