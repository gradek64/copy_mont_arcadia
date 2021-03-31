import { addToBag, getBag } from '../shoppingBagActions'
import { get, post } from '../../../lib/api-service'
import {
  getAppliedPromotions,
  getPromoCodeConfirmation,
  getShoppingBagTotal,
  isMinibagOpen,
} from '../../../selectors/shoppingBagSelectors'

import buildStore from 'test/unit/build-store'
import createFakePromise from 'test/unit/lib/create-fake-promise'
import { getFormLoading } from '../../../selectors/formsSelectors'

jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
  post: jest.fn(),
}))

const setResponses = (method, responses) => {
  return method.mockImplementation((path) => () => {
    const responseObject = responses.find((obj) => obj.path.includes(path))
    if (!responseObject)
      throw new Error(`Response object for "${path}" cannot be found`)
    const i = responses.indexOf(responseObject)
    responses[i] = { path: '' }
    return responseObject.response
  })
}

const bagResponse = ({ promotions }) => ({
  body: {
    total: '100.00',
    subTotal: '100.00',
    products: [{ catEntryId: 123456 }],
    promotions,
  },
})

const postObjectResponse = ({ promoCode } = {}) => [
  {
    path: 'api/shopping_bag/addPromotionCode',
    response: Promise.resolve(
      bagResponse({
        promotions: [
          {
            promotionCode: promoCode,
            label: 'This is a label',
          },
        ],
      })
    ),
  },
]

describe('shoppingBagActions2', () => {
  const browser = process.browser
  afterEach(() => {
    process.browser = browser
  })

  describe('getBag - better tests', () => {
    const getObjectResponse = () => [
      {
        path: '/api/shopping_bag/get_items',
        response: Promise.resolve(bagResponse({ promotions: [] })),
      },
      {
        path: '/cmscontent',
        response: Promise.resolve({}),
      },
    ]

    it('should fetch the bag', async () => {
      setResponses(get, getObjectResponse())
      const store = buildStore()
      expect(getShoppingBagTotal(store.getState())).toBe(0)

      await store.dispatch(getBag())

      expect(getShoppingBagTotal(store.getState())).toBe(100)
    })

    it('should add arcpromoCode cookie promo to bag', async () => {
      process.browser = true
      const code = 'FOO'
      const { fakePromise, resolveNext } = createFakePromise()
      setResponses(get, getObjectResponse())
      setResponses(post, [
        {
          path: '/api/shopping_bag/addPromotionCode',
          response: fakePromise,
        },
      ])
      document.cookie = `arcpromoCode=${code}`
      const store = buildStore()
      expect(getPromoCodeConfirmation(store.getState())).toBe(false)

      await store.dispatch(getBag())
      resolveNext(
        bagResponse({
          promotions: [
            {
              promotionCode: code,
              label: 'This is a label',
            },
          ],
        })
      )

      expect(getAppliedPromotions(store.getState())[0].promotionCode).toBe(code)
    })

    it('should set form loading state when adding promotion code (successful)', async () => {
      process.browser = true
      const code = 'FOO'
      setResponses(get, getObjectResponse())
      const { fakePromise, resolveNext } = createFakePromise()
      setResponses(post, [
        {
          path: '/api/shopping_bag/addPromotionCode',
          response: fakePromise,
        },
      ])
      document.cookie = `arcpromoCode=${code}`
      const store = buildStore()
      expect(getFormLoading('promotionCode', store.getState())).toBe(false)

      await store.dispatch(getBag())

      expect(getFormLoading('promotionCode', store.getState())).toBe(true)
      resolveNext(
        bagResponse({
          promotions: [
            {
              promotionCode: code,
              label: 'This is a label',
            },
          ],
        })
      )
      expect(getFormLoading('promotionCode', store.getState())).toBe(false)
      expect(document.cookie).not.toContain('arcpromoCode')
    })

    it('should set form loading state when adding promotion code (error)', async () => {
      process.browser = true
      const code = 'FOO'
      setResponses(get, getObjectResponse())
      const { fakePromise, rejectNext } = createFakePromise()
      setResponses(post, [
        {
          path: '/api/shopping_bag/addPromotionCode',
          response: fakePromise,
        },
      ])
      document.cookie = `arcpromoCode=${code}`
      const store = buildStore()
      expect(getFormLoading('promotionCode', store.getState())).toBe(false)

      await store.dispatch(getBag())

      expect(getFormLoading('promotionCode', store.getState())).toBe(true)
      try {
        rejectNext()
      } catch (e) {
        expect(getFormLoading('promotionCode', store.getState())).toBe(false)
        expect(document.cookie).not.toContain('arcpromoCode')
      }
    })

    it('should open the minibag on success', async () => {
      process.browser = true
      const code = 'FOO'
      setResponses(get, getObjectResponse())
      setResponses(post, postObjectResponse({ promoCode: code }))
      document.cookie = `arcpromoCode=${code}`
      const store = buildStore()

      expect(isMinibagOpen(store.getState())).toBe(false)

      await store.dispatch(getBag())

      expect(isMinibagOpen(store.getState())).toBe(true)
    })

    it('should open the minibag on failure', async () => {
      process.browser = true
      const code = 'FOO'
      setResponses(get, getObjectResponse())
      const { fakePromise, rejectNext } = createFakePromise()
      setResponses(post, [
        {
          path: '/api/shopping_bag/addPromotionCode',
          response: fakePromise,
        },
      ])
      document.cookie = `arcpromoCode=${code}`
      const store = buildStore()

      expect(isMinibagOpen(store.getState())).toBe(false)

      await store.dispatch(getBag())
      try {
        rejectNext()
      } catch (e) {
        rejectNext()
      }

      expect(isMinibagOpen(store.getState())).toBe(true)
    })
  })

  describe('addToBag', () => {
    it('adds an item to the bag', async () => {
      process.browser = true
      setResponses(post, [
        {
          path: '/api/shopping_bag/add_item2',
          response: Promise.resolve(bagResponse({ promotions: [] })),
        },
      ])
      const store = buildStore()

      await store.dispatch(addToBag(32046370, 32046374, 'TS02C21MBLK', 1))

      expect(getShoppingBagTotal(store.getState())).toBe(100)
    })

    it('adds an item with catEntryid if feature addItemV3 enabled', async () => {
      process.browser = true
      setResponses(post, [
        {
          path: '/api/shopping_bag/add_item2',
          response: Promise.resolve(bagResponse({ promotions: [] })),
        },
      ])
      const store = buildStore({
        features: {
          status: {
            FEATURE_ADD_ITEM_3: true,
          },
        },
      })

      await store.dispatch(
        addToBag(
          32046370,
          32046374,
          'TS02C21MBLK',
          1,
          null,
          undefined,
          false,
          123
        )
      )

      expect(post).toHaveBeenCalledWith(
        '/shopping_bag/add_item2',
        expect.objectContaining({
          catEntryId: 123,
          noRedirect: true,
        })
      )
      expect(getShoppingBagTotal(store.getState())).toBe(100)
    })

    it('adds a bundle with catEntryid if feature addItemV3 enabled', async () => {
      process.browser = true
      setResponses(post, [
        {
          path: '/api/shopping_bag/add_item2',
          response: Promise.resolve(bagResponse({ promotions: [] })),
        },
      ])
      const store = buildStore({
        features: {
          status: {
            FEATURE_ADD_ITEM_3: true,
          },
        },
      })

      const bundleItems = [
        {
          productId: 27389114,
          sku: '602017001061281',
          catEntryId: 27389292,
        },
        {
          productId: 27389294,
          sku: '602017001061286',
          catEntryId: 27389295,
        },
      ]

      await store.dispatch(
        addToBag(
          32046370,
          undefined,
          undefined,
          undefined,
          null,
          bundleItems,
          undefined,
          null
        )
      )

      expect(post).toHaveBeenCalledWith(
        '/shopping_bag/add_item2',
        expect.objectContaining({
          noRedirect: true,
          bundleItems: [
            expect.objectContaining({
              catEntryId: 27389292,
            }),
            expect.objectContaining({
              catEntryId: 27389295,
            }),
          ],
        })
      )
      expect(getShoppingBagTotal(store.getState())).toBe(100)
    })

    it('adds an item and applies arcpromoCode cookie promo', async () => {
      process.browser = true
      const code = 'FOO'
      document.cookie = `arcpromoCode=${code}`
      const { fakePromise, resolveNext } = createFakePromise()
      setResponses(post, [
        {
          path: '/api/shopping_bag/add_item2',
          response: Promise.resolve(bagResponse({ promotions: [] })),
        },
        {
          path: '/api/shopping_bag/addPromotionCode',
          response: fakePromise,
        },
      ])
      const store = buildStore()

      await store.dispatch(
        addToBag(32046370, 32046374, 'TS02C21MBLK', 1, '<div>wtf?</div>')
      )
      resolveNext(
        bagResponse({
          promotions: [
            {
              promotionCode: code,
              label: 'This is a label',
            },
          ],
        })
      )

      expect(getAppliedPromotions(store.getState())[0].promotionCode).toBe(code)
    })
  })
})
