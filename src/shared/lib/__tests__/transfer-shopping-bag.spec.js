import {
  removeTransferShoppingBagParams,
  shouldTransferShoppingBag,
} from '../transfer-shopping-bag'

jest.mock('../../selectors/routingSelectors', () => ({
  getLocation: jest.fn(),
}))
import { getLocation } from '../../selectors/routingSelectors'

jest.mock('react-router', () => ({
  browserHistory: {
    replace: jest.fn(),
  },
}))
import { browserHistory } from 'react-router'

beforeEach(() => {
  jest.resetAllMocks()
})

const state = {}

describe(shouldTransferShoppingBag.name, () => {
  it('returns true if transferStoreID is a number and transferOrderID is a positive number', () => {
    expect(shouldTransferShoppingBag(1234, 5678)).toEqual(true)
  })
  it('returns false if transferStoreID is not a number', () => {
    expect(shouldTransferShoppingBag('invalidTransferStoreID', 5678)).toEqual(
      false
    )
  })
  it('returns false if transferOrderID is not a positive number', () => {
    expect(shouldTransferShoppingBag(1234, 0)).toEqual(false)
  })
})

describe(removeTransferShoppingBagParams.name, () => {
  it('removes the transferStoreID and transferOrderID query params if they are part of the url', () => {
    getLocation.mockImplementationOnce(() => ({
      pathname: 'VALID_PATHNAME',
      query: {
        transferStoreID: '12340000',
        transferOrderID: '56780000',
        keyA: 'VALUE1',
      },
    }))
    removeTransferShoppingBagParams(state)
    expect(browserHistory.replace).toHaveBeenCalledWith({
      pathname: 'VALID_PATHNAME',
      query: { keyA: 'VALUE1' },
    })
  })
  it('returns the same url if the transferStoreID and transferOrderID query params if they are not part of the url', () => {
    getLocation.mockImplementationOnce(() => ({
      pathname: 'VALID_PATHNAME',
      query: {
        keyB: 'VALUE2',
      },
    }))
    removeTransferShoppingBagParams(state)
    expect(browserHistory.replace).toHaveBeenCalledWith({
      pathname: 'VALID_PATHNAME',
      query: { keyB: 'VALUE2' },
    })
  })
})
