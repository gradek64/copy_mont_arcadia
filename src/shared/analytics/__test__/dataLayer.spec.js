import pageSchema from '../schemas/page'
import userSessionSchema from '../schemas/userSession'
import basketSchema from '../schemas/basket'
import promosSchema from '../schemas/promos'
import { productClickSchema } from '../schemas/product'

describe('dataLayer', () => {
  describe('when on the server', () => {
    /**
     * we have to make sure `global.process.browser` is false before importing
     * the dataLayer module
     */
    let oldProcessBrowser
    let dataLayer
    beforeAll(() => {
      oldProcessBrowser = global.process.browser
      global.process.browser = false

      dataLayer = require('../dataLayer').default
    })
    afterAll(() => {
      global.process.browser = oldProcessBrowser
    })
    it('should not attach any schemas', () => {
      expect(dataLayer.schemas).toEqual({})
    })
  })

  describe('when on the client', () => {
    /**
     * we have to set `global.process.browser` to true before importing the
     * dataLayer module
     */
    let oldProcessBrowser
    let dataLayer
    let attachable
    let gtmAdapter
    beforeAll(() => {
      jest.resetModules()
      oldProcessBrowser = global.process.browser
      global.process.browser = true

      dataLayer = require('../dataLayer').default
      attachable = require('../dataLayer').attachable
      gtmAdapter = require('../dataLayer').gtm
    })
    beforeEach(() => {
      while (dataLayer.length > 0) {
        dataLayer.pop()
      }
    })
    afterAll(() => {
      global.process.browser = oldProcessBrowser
    })

    it("`window` mock has global.window.dataLayer = [] for the purposes of these tests (doesn't confirm GTM setup)", () => {
      expect(attachable.dataLayer.push).not.toBeUndefined()
    })

    it('pageSchema added', () => {
      expect(dataLayer.getSchema('pageSchema')).toEqual(pageSchema)
    })

    it('userSessionSchema added', () => {
      expect(dataLayer.getSchema('userSessionSchema')).toEqual(
        userSessionSchema
      )
    })

    it('basketSchema added', () => {
      expect(dataLayer.getSchema('basketSchema')).toEqual(basketSchema)
    })

    it('promosSchema added', () => {
      expect(dataLayer.getSchema('promosSchema')).toEqual(promosSchema)
    })

    it('productClickSchema added', () => {
      expect(dataLayer.getSchema('productClickSchema')).toEqual(
        productClickSchema
      )
    })

    it('GTM adapter added', () => {
      expect(dataLayer.getAdapter('gtm')).toEqual(gtmAdapter)
    })

    it('a .push() validating against userSessionSchema populates local and GTM dataLayer', () => {
      dataLayer.push(
        {
          pageType: 'Product Listing',
          pageCategory: 'T-Shirts',
          user: {
            dualRun: 'none',
            loggedIn: 'True',
            id: '123',
          },
        },
        'userSessionSchema',
        'testEvent'
      )

      expect(dataLayer[0]).toEqual({
        platform: 'monty',
        $event: 'testEvent',
        pageType: 'Product Listing',
        pageCategory: 'T-Shirts',
        user: {
          dualRun: 'none',
          loggedIn: 'True',
          id: '123',
        },
      })
      expect(global.window.dataLayer[0]).toEqual({
        platform: 'monty',
        event: 'testEvent',
        pageType: 'Product Listing',
        pageCategory: 'T-Shirts',
        user: {
          dualRun: 'none',
          loggedIn: 'True',
          id: '123',
        },
      })
    })
  })
})
