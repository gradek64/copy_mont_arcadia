import React from 'react'
import cmsUtilities, { fixCmsUrl } from '../cms-utilities'
import { dispatch } from '../get-value-from-store'
import {
  showSizeGuide,
  setSizeGuide,
} from '../../actions/common/productsActions'
import { setProductIdQuickview } from '../../actions/common/quickviewActions'
import { showModal } from '../../actions/common/modalActions'
import { addDDPToBag } from '../../actions/common/ddpActions'
import ProductQuickview from '../../components/containers/ProductQuickview/ProductQuickview'
import { deepEqual } from 'assert'
import { browserHistory } from 'react-router'
import { isIE11 } from '../browser'

jest.mock('../get-value-from-store')
jest.mock('../../actions/common/productsActions')
jest.mock('../../actions/common/modalActions')
jest.mock('../browser')
jest.mock('../../actions/common/quickviewActions', () => ({
  setProductIdQuickview: jest.fn(),
}))
jest.mock('../../actions/common/ddpActions', () => ({
  addDDPToBag: jest.fn(),
}))
jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

const unmounterMock = jest.fn()

const notRealFunction = jest.fn()

const sandboxMockFull = {
  unmounter: unmounterMock,
  toBeMapped: [],
}

const sandboxMockEmpty = {
  notRealFunction,
}

const id = '12345'
const props = { prop1: 'hello', prop2: 56 }

describe('cms-utilities', () => {
  beforeEach(() => {
    // using global but in actual code is on window as it is client side code
    global.sandbox = undefined
    sandboxMockFull.toBeMapped = []
    jest.resetAllMocks()
  })

  describe('fixCmsUrl', () => {
    it('should return empty string if no url provided', () => {
      expect(fixCmsUrl()).toBe('')
    })

    it('should add / if not present at the start of url', () => {
      expect(fixCmsUrl('url')).toBe('/url')
    })

    it('should not add / if present at the start of url already', () => {
      expect(fixCmsUrl('/url')).toBe('/url')
    })
  })

  describe('sanitiseLocation', () => {
    it("should return null, if location isn't provided", () => {
      expect(cmsUtilities.sanitiseLocation(undefined)).toBe(null)
    })

    it('should return the sanitised location, if provided', () => {
      expect(
        cmsUtilities.sanitiseLocation({
          pathname: '',
          query: 'foo=bar',
          search: '?foo-bar',
          key: 'abc123',
        })
      ).toEqual({
        pathname: '',
        search: '?foo-bar',
      })
    })

    it('should double encode accents', () => {
      expect(
        cmsUtilities.sanitiseLocation({
          pathname: '/catégorie/somesuch',
          search: '?foo-bar',
        })
      ).toEqual({
        pathname: '%2Fcat%25C3%25A9gorie%2Fsomesuch',
        search: '?foo-bar',
      })
    })

    it('should encode the pathname, if unencoded', () => {
      expect(
        cmsUtilities.sanitiseLocation({
          pathname: 'héllo/world',
          search: '?foo-bar',
        })
      ).toEqual({
        pathname: 'h%25C3%25A9llo%2Fworld',
        search: '?foo-bar',
      })
    })

    it('should not double encode pathname', () => {
      expect(
        cmsUtilities.sanitiseLocation({
          pathname: 'hello%2Fworld',
          search: '?foo-bar',
        })
      ).toEqual({
        pathname: 'hello%2Fworld',
        search: '?foo-bar',
      })
    })
  })

  describe('unmountPreviousSandboxDOMNode', () => {
    // needed as the unmounter can be called with no parameters
    it('calls the unmounter on the sandbox with no parameters', () => {
      global.sandbox = sandboxMockFull
      expect(unmounterMock).not.toBeCalled()
      cmsUtilities.unmountPreviousSandboxDOMNode()
      expect(unmounterMock).toHaveBeenCalledTimes(1)
    })
    it('calls the unmounter on the sandbox with the correct parameters', () => {
      global.sandbox = sandboxMockFull
      expect(unmounterMock).not.toBeCalled()
      cmsUtilities.unmountPreviousSandboxDOMNode(id)
      expect(unmounterMock).toHaveBeenCalledTimes(1)
      expect(unmounterMock).lastCalledWith(id)
    })
    it('does not call the unmounter on the sandbox, if the sandbox is not present', () => {
      expect(unmounterMock).not.toBeCalled()
      cmsUtilities.unmountPreviousSandboxDOMNode(id)
      expect(unmounterMock).not.toBeCalled()
    })
    it('does not call the unmounter on the sandbox, if the unmounter is not present', () => {
      global.sandbox = sandboxMockEmpty
      expect(unmounterMock).not.toBeCalled()
      expect(notRealFunction).not.toBeCalled()
      cmsUtilities.unmountPreviousSandboxDOMNode(id)
      expect(unmounterMock).not.toBeCalled()
      expect(notRealFunction).not.toBeCalled()
    })
  })

  describe('updateNewSandBox', () => {
    it('adds an item to the toBeMapped array on the sandbox when the sandbox is undefined', () => {
      expect(global.sandbox).toBeUndefined()
      cmsUtilities.updateNewSandBox(id, props)
      expect(global.sandbox).toBeDefined()
      expect(global.sandbox.toBeMapped.length).toBe(1)
      expect(global.sandbox.toBeMapped[0]).toEqual({ id, props })
    })
    it('adds an item to the toBeMapped array on the sandbox when the sandbox is defined', () => {
      global.sandbox = sandboxMockFull
      cmsUtilities.updateNewSandBox(id, props)
      expect(global.sandbox.toBeMapped.length).toBe(1)
      expect(global.sandbox.toBeMapped[0]).toEqual({ id, props })
    })
  })

  describe('globally available sandbox functions', () => {
    beforeEach(() => {
      cmsUtilities.updateNewSandBox(id, props)
    })

    const setupMock = (mockFn) => ({
      whenCalledWith: (...expectedArgs) => ({
        returns: (returnValue) => {
          mockFn.mockImplementation((...args) => {
            try {
              deepEqual(expectedArgs, args)
              return returnValue
            } catch (e) {} // eslint-disable-line no-empty
          })
        },
      }),
    })

    describe('sandbox attribute list', () => {
      it('should match a given pattern', () => {
        expect(global.sandbox).toEqual({
          addDDPToBasket: expect.any(Function),
          applyBundleMapping: expect.any(Function),
          historyPush: expect.any(Function),
          jsBundles: {},
          mapped: [],

          openQuickViewProduct: expect.any(Function),
          openSizeGuideDrawer: expect.any(Function),
          toBeMapped: expect.any(Array),
        })
      })
    })
    describe('openQuickViewProduct', () => {
      it('should call document dispatch with correct product id, and type', () => {
        const productId = 321
        setupMock(setProductIdQuickview)
          .whenCalledWith(productId)
          .returns('return1')
        setupMock(showModal)
          .whenCalledWith(<ProductQuickview />, { mode: 'sandboxQuickview' })
          .returns('return2')

        global.sandbox.openQuickViewProduct(productId)

        expect(dispatch).toHaveBeenCalledTimes(2)
        expect(dispatch).toHaveBeenCalledWith('return1')
        expect(dispatch).toHaveBeenCalledWith('return2')
      })
    })

    describe('openSizeGuideDrawer', () => {
      it('should call document historyPush with correct type (mobile)', () => {
        global.sandbox.openSizeGuideDrawer('Trousers')

        const thunk = dispatch.mock.calls[0][0]
        const mockStore = () => ({ viewport: { media: 'mobile' } })

        expect(browserHistory.push).not.toHaveBeenCalled()

        thunk(dispatch, mockStore)

        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith('/size-guide/Trousers')

        expect(dispatch).toHaveBeenCalledTimes(1)
      })
      it('should call document dispatches with correct type (desktop)', () => {
        setupMock(setSizeGuide)
          .whenCalledWith('Trousers')
          .returns('return1')
        setupMock(showSizeGuide)
          .whenCalledWith()
          .returns('return2')

        expect(dispatch).not.toHaveBeenCalled()

        global.sandbox.openSizeGuideDrawer('Trousers')

        const thunk = dispatch.mock.calls[0][0]
        const mockStore = () => ({ viewport: { media: 'desktop' } })

        expect(dispatch).toHaveBeenCalledTimes(1)

        thunk(dispatch, mockStore)

        expect(dispatch).toHaveBeenCalledTimes(3)
        expect(dispatch).toHaveBeenCalledWith('return1')
        expect(dispatch).toHaveBeenCalledWith('return2')
      })
    })

    describe('addDDPToBasket', () => {
      it('should dispatch an addToBag action with given sku', () => {
        const sku = '00000000321'
        const addDDPToBagMock = () => ({
          type: 'ADD_DDP_TO_BAG_MOCK',
        })

        addDDPToBag.mockImplementationOnce(addDDPToBagMock)

        expect(dispatch).not.toHaveBeenCalled()

        global.sandbox.addDDPToBasket(sku)

        expect(dispatch).toHaveBeenCalledTimes(1)
        expect(dispatch).toHaveBeenCalledWith(addDDPToBagMock())
        expect(addDDPToBag).toHaveBeenCalledWith(sku)
      })
    })
  })

  describe('window.sandbox listeners', () => {
    describe('registerListener', () => {
      let listener = null
      let listenerId = null

      beforeEach(() => {
        listener = jest.fn()
      })

      afterEach(() => {
        listenerId = null
      })

      it('should bind functions to the get operation', () => {
        cmsUtilities.updateNewSandBox(id, props)
        listenerId = cmsUtilities.registerListener('get', listener)

        expect(listenerId).not.toBe(undefined)
        // eslint-disable-next-line no-unused-expressions
        global.sandbox.mapped.foo
        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should bind functions to the set operation', () => {
        cmsUtilities.updateNewSandBox(id, props)
        listenerId = cmsUtilities.registerListener('set', listener)

        expect(listenerId).not.toBe(undefined)
        global.sandbox.mapped.push({ foo: 'bar' })

        /**
         * It's two times, because it first sets the item in the array, and then sets the length of the array. The two operations happen separately.
         */
        expect(listener).toHaveBeenCalledTimes(2)
      })

      it('should not bind function, on IE11', () => {
        isIE11.mockReturnValueOnce(true)
        expect(() => cmsUtilities.registerListener('get', null)).toThrow(
          'No sandbox listener provided.'
        )
      })

      it('should throw an error if listener is not defined', () => {
        expect(() => cmsUtilities.registerListener('get', null)).toThrow(
          'No sandbox listener provided.'
        )
      })

      it('should throw an error if listener is not a function', () => {
        expect(() => cmsUtilities.registerListener('get', {})).toThrow(
          'No sandbox listener provided.'
        )
      })

      it('should throw an error if operation is not a function', () => {
        expect(() => cmsUtilities.registerListener(null, listener)).toThrow(
          'Invalid proxy operation'
        )
      })

      it('should throw an error when invalid operation provided', () => {
        expect(() => cmsUtilities.registerListener('foo', listener)).toThrow(
          'Invalid proxy operation'
        )
      })
    })
    describe('removeListener', () => {
      let listener = null
      let listenerId = null

      beforeEach(() => {
        listener = jest.fn()
        cmsUtilities.updateNewSandBox(id, props)
        listenerId = cmsUtilities.registerListener('get', listener)
      })

      it('should remove an attached listener', () => {
        // eslint-disable-next-line no-unused-expressions
        global.sandbox.mapped.foo
        expect(listener).toHaveBeenCalledTimes(1)
        cmsUtilities.removeListener('get', listenerId)

        // eslint-disable-next-line no-unused-expressions
        global.sandbox.mapped.foo
        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('should throw an error when no operation is given', () => {
        expect(() => cmsUtilities.removeListener(null, listenerId)).toThrow(
          'Invalid proxy operation'
        )
      })

      it('should throw an error when an invalid operation is given', () => {
        expect(() => cmsUtilities.removeListener('foo', listenerId)).toThrow(
          'Invalid proxy operation'
        )
      })

      it('should throw an error when no listenerId', () => {
        expect(() => cmsUtilities.removeListener('get', null)).toThrow(
          'listenerId required to detach listener'
        )
      })
    })

    describe('updateViewportMedia', () => {
      it('should return back viewportMedia desktop if viewportMedia is laptop', () => {
        const queryParamsResults = cmsUtilities.updateViewportMedia({
          viewportMedia: 'laptop',
          storeCode: '2323223',
          brandName: 'topshop',
          mobileCMSUrl: 'https://example.com',
          siteId: '487484',
          forceMobile: false,
        })

        expect(queryParamsResults.viewportMedia).toEqual('desktop')
      })

      it('should return back default queryParams if viewportMedia is not laptop', () => {
        const queryParams = {
          viewportMedia: 'mobile',
          storeCode: '2323223',
          brandName: 'topshop',
          mobileCMSUrl: 'https://example.com',
          siteId: '487484',
          forceMobile: false,
        }

        expect(cmsUtilities.updateViewportMedia(queryParams)).toEqual(
          queryParams
        )

        queryParams.viewportMedia = 'tablet'

        expect(cmsUtilities.updateViewportMedia(queryParams)).toEqual(
          queryParams
        )

        queryParams.viewportMedia = 'desktop'

        expect(cmsUtilities.updateViewportMedia(queryParams)).toEqual(
          queryParams
        )
      })
    })
  })
})
