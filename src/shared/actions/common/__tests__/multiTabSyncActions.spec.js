import * as multiTabSyncActions from '../multiTabSyncActions'
import * as syncStateAction from '../syncState'

const mockShippingDestinationData = { foo: 'bar', baz: 'cux' }
const mockSomeChunkOfStateUpdateActionOutput = { type: 'UPDATE_ACTION' }

jest.mock('../../../../client/lib/state-sync/handlers', () => ({
  shippingDestination: {
    mergeActionType: 'FOO_MERGE_STATE',
    retrieve: jest.fn(() => mockShippingDestinationData),
  },
  shoppingBag: {
    retrieve: jest.fn(() => ({
      foo2: 'bar2',
      baz2: 'cux2',
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

describe('multiTabSyncActions', () => {
  describe('setUpMultiTabSyncListeners', () => {
    let originalDocument

    beforeAll(() => {
      originalDocument = global.document
      global.process.browser = true
    })

    beforeEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
      Object.defineProperty(global.document, 'hidden', {
        value: undefined,
        configurable: true,
      })
      Object.defineProperty(global.document, 'msHidden', {
        value: undefined,
        configurable: true,
      })
      Object.defineProperty(global.document, 'webkitHidden', {
        value: undefined,
        configurable: true,
      })
    })

    afterAll(() => {
      global.document = originalDocument
    })

    describe('events', () => {
      const syncStateSpy = jest.spyOn(syncStateAction, 'syncState')

      const browserCases = [
        { hiddenProp: 'hidden', visibilityEvent: 'visibilitychange' },
        { hiddenProp: 'msHidden', visibilityEvent: 'msvisibilitychange' },
        {
          hiddenProp: 'webkitHidden',
          visibilityEvent: 'webkitvisibilitychange',
        },
      ]

      browserCases.forEach((browserCase) => {
        describe(`document visibility controlled with ${
          browserCase.hiddenProp
        } property`, () => {
          const spyReturn = jest.fn()
          const mockDispatch = jest.fn()
          const mockGetState = jest.fn(() => ({
            shippingDestination: {},
            shoppingBag: {},
            someChunkOfState: {},
          }))

          it('should set up correct event listeners', () => {
            Object.defineProperty(global.document, browserCase.hiddenProp, {
              value: false,
              configurable: true,
            })
            const windowSpy = jest.spyOn(global.window, 'addEventListener')
            const documentSpy = jest.spyOn(global.document, 'addEventListener')

            multiTabSyncActions.setUpMultiTabSyncListeners(
              mockDispatch,
              mockGetState
            )
            expect(windowSpy).toHaveBeenCalledWith(
              'storage',
              expect.any(Function)
            )
            expect(documentSpy).toHaveBeenCalledWith(
              browserCase.visibilityEvent,
              expect.any(Function)
            )
          })

          it('should set up and trigger storage event listener', () => {
            Object.defineProperty(global.document, browserCase.hiddenProp, {
              value: false,
              configurable: true,
            })

            const syncStateSpy = jest
              .spyOn(syncStateAction, 'syncState')
              .mockReturnValue(spyReturn)

            const customStorageEvent = document.createEvent('HTMLEvents')
            customStorageEvent.initEvent('storage', true, true)
            customStorageEvent.key = 'shoppingBag'

            multiTabSyncActions.setUpMultiTabSyncListeners(
              mockDispatch,
              mockGetState
            )

            window.dispatchEvent(customStorageEvent)

            expect(spyReturn).toHaveBeenCalledWith(mockDispatch, mockGetState)
            expect(syncStateSpy).toHaveBeenCalledWith(['shoppingBag'])
          })

          it(`should trigger ${browserCase.event} change listener`, () => {
            Object.defineProperty(global.document, browserCase.hiddenProp, {
              value: false,
              configurable: true,
            })
            const syncStateSpy = jest
              .spyOn(syncStateAction, 'syncState')
              .mockReturnValue(spyReturn)
            const customVisibilityEvent = document.createEvent('HTMLEvents')
            customVisibilityEvent.initEvent(
              browserCase.visibilityEvent,
              true,
              true
            )
            multiTabSyncActions.setUpMultiTabSyncListeners(
              mockDispatch,
              mockGetState
            )
            document.dispatchEvent(customVisibilityEvent)

            expect(spyReturn).toHaveBeenCalledWith(mockDispatch, mockGetState)
            expect(syncStateSpy).toHaveBeenCalledWith()
          })

          it('should not trigger any listeners when document is hidden', () => {
            Object.defineProperty(global.document, browserCase.hiddenProp, {
              value: true,
              configurable: true,
            })
            syncStateSpy.mockReturnValue(spyReturn)
            const customStorageEvent = document.createEvent('HTMLEvents')
            customStorageEvent.initEvent('storage', true, true)
            customStorageEvent.key = 'shoppingBag'
            const customVisibilityEvent = document.createEvent('HTMLEvents')
            customVisibilityEvent.initEvent(
              browserCase.visibilityEvent,
              true,
              true
            )
            multiTabSyncActions.setUpMultiTabSyncListeners(
              mockDispatch,
              mockGetState
            )
            window.dispatchEvent(customStorageEvent)
            document.dispatchEvent(customVisibilityEvent)

            expect(spyReturn).not.toHaveBeenCalled()
            expect(syncStateSpy).not.toHaveBeenCalled()
          })

          it('should not trigger any listeners when storage key is not in state', () => {
            Object.defineProperty(global.document, browserCase.hiddenProp, {
              value: false,
              configurable: true,
            })
            syncStateSpy.mockReturnValue(spyReturn)
            const customStorageEvent = document.createEvent('HTMLEvents')
            customStorageEvent.initEvent('storage', true, true)
            customStorageEvent.key = 'someIrrelevantStorageUpdate'
            multiTabSyncActions.setUpMultiTabSyncListeners(
              mockDispatch,
              mockGetState
            )
            window.dispatchEvent(customStorageEvent)

            expect(spyReturn).not.toHaveBeenCalled()
            expect(syncStateSpy).not.toHaveBeenCalled()
          })
        })
      })
    })
  })
})
