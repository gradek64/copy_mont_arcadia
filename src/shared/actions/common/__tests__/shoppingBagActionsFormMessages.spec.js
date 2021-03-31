import nock from 'nock'
import { createStore } from '../../../../../test/unit/helpers/get-redux-mock-store'
import * as shoppingBagActions from '../shoppingBagActions'

describe('Shopping bag actions form messages', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  describe('addPromotionCode', () => {
    describe('Error messages', () => {
      it('should set the form message using the error response', async () => {
        const expectedMessage = 'BANG'

        nock('http://localhost:3000')
          .post('/api/shopping_bag/addPromotionCode')
          .reply(400, {
            message: expectedMessage,
          })

        try {
          await store.dispatch(shoppingBagActions.addPromotionCode({}))

          global.fail('Expected addPromotionCode to throw')
        } catch (error) {
          const expectedAction = {
            type: 'SET_FORM_MESSAGE',
            formName: 'promotionCode',
            message: {
              type: 'error',
              message: 'BANG',
            },
          }

          expect(store.getActions()).toEqual(
            expect.arrayContaining([expect.objectContaining(expectedAction)])
          )
        }
      })
    })
  })
})
