import * as syncStateAction from '../syncState'
import storageHandlers from '../../../../client/lib/state-sync/handlers/index'
import { MERGE_ACTION_SUFFIX } from '../../../../client/lib/state-sync/syncHandlerFactory'

const mockShippingDestinationData = { foo: 'bar', baz: 'cux' }
const mockSomeChunkOfStateUpdateActionOutput = { type: 'UPDATE_ACTION' }
const mockShoppingData = { lastPersistTime: 312312321 }

jest.mock('../../../../client/lib/state-sync/handlers', () => ({
  shippingDestination: {
    mergeActionType: 'FOO_MERGE_STATE',
    retrieve: jest.fn(() => mockShippingDestinationData),
  },
  shoppingBag: {
    retrieve: jest.fn(() => ({
      foo2: 'bar2',
      baz2: 'cux2',
      retrieve: jest.fn(() => mockShoppingData),
    })),
  },
  someChunkOfState: {
    retrieve: jest.fn(() => ({
      foo3: 'bar3',
      baz3: 'cux3',
    })),
    updateAction: jest.fn(() => mockSomeChunkOfStateUpdateActionOutput),
  },
}))

describe('syncState', () => {
  beforeEach(jest.clearAllMocks)

  const mockDispatch = jest.fn()
  const mockGetState = jest.fn(() => ({
    shippingDestination: {},
    shoppingBag: {},
    someChunkOfState: {},
  }))

  it('should retrieve data using all storage sync handlers', () => {
    syncStateAction.syncState()(mockDispatch, mockGetState)
    expect(storageHandlers.shippingDestination.retrieve).toHaveBeenCalledTimes(
      1
    )
    expect(storageHandlers.shoppingBag.retrieve).toHaveBeenCalledTimes(1)
    expect(storageHandlers.someChunkOfState.retrieve).toHaveBeenCalledTimes(1)
  })

  it('should retrieve data using specified storage sync handlers', () => {
    syncStateAction.syncState(['shoppingBag'])(mockDispatch, mockGetState)
    expect(storageHandlers.shippingDestination.retrieve).toHaveBeenCalledTimes(
      0
    )
    expect(storageHandlers.shoppingBag.retrieve).toHaveBeenCalledTimes(1)
    expect(storageHandlers.someChunkOfState.retrieve).toHaveBeenCalledTimes(0)
  })

  it('should dispatch a merge action if prefix is available', () => {
    syncStateAction.syncState(['shippingDestination'])(
      mockDispatch,
      mockGetState
    )
    expect(mockDispatch).toHaveBeenCalledWith({
      type: `FOO${MERGE_ACTION_SUFFIX}`,
      data: mockShippingDestinationData,
    })
  })

  it('should run an update action if available', () => {
    syncStateAction.syncState(['someChunkOfState'])(mockDispatch, mockGetState)
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSomeChunkOfStateUpdateActionOutput
    )
  })

  it('should sync if it is a guest user', () => {
    const mockGetState = jest.fn(() => ({
      checkout: {
        orderSummary: {
          isGuestOrder: true,
        },
      },
      shoppingBag: {
        lastPersistTime: 312312321,
      },
    }))
    syncStateAction.syncState(['shoppingBag'])(mockDispatch, mockGetState)
    expect(storageHandlers.shoppingBag.retrieve).toHaveBeenCalledTimes(1)
  })

  it('should not throw an error nor dispatch when retrieved data is undefined', () => {
    const mockGetState = jest.fn(() => ({
      shippingDestination: {
        lastPersistTime: 312312321,
      },
    }))
    storageHandlers.shippingDestination.retrieve.mockImplementation(
      () => undefined
    )

    expect(() =>
      syncStateAction.syncState(['shippingDestination'])(
        mockDispatch,
        mockGetState
      )
    ).not.toThrow()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('should not throw an error when lastPersistTime is undefined', () => {
    const mockGetState = jest.fn(() => ({
      shippingDestination: {},
    }))
    storageHandlers.shippingDestination.retrieve.mockImplementation(
      () => undefined
    )

    expect(() =>
      syncStateAction.syncState(['shippingDestination'])(
        mockDispatch,
        mockGetState
      )
    ).not.toThrow()
    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
