/* eslint-disable no-restricted-syntax,no-prototype-builtins */
import { getProducts } from '../utilis/selectProducts'

require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import chai from 'chai'

chai.use(require('chai-json-schema'))

import eps from '../routes_tests'
import { headers } from '../utilis'
import { createAccount } from '../utilis/userAccount'
import { addGiftCard, removeGiftCard } from '../utilis/giftCard'
import {
  validGiftcardSchema,
  orderSummarySchemaBasket,
} from './order-summary.schema'
import { addItemToShoppingBag2 } from '../utilis/shoppingBag'

import {
  validGiftCard,
  zeroBalanceGiftCard,
  invalidGiftCardNumber,
  invalidPinNumberGiftCard,
  invalidCurrencyGiftCard,
  declinedGiftCard,
  emptyGiftCard,
} from './order-summary-data'

import {
  GIFTCARD_DECLINED_MESSAGE,
  GIFTCARD_DUPLICATE_CARD_MESSAGE,
  ZERO_BALANCE_CARD_MESSAGE,
  INVALID_GIFTCARD_NUMBER_MESSAGE,
  INVALID_PIN_NUMBER_MESSAGE,
  INVALID_CURRENCY_MESSAGE,
  EMPTY_CARD_NUMBER,
} from '../message-data'

let products
let newAccount
let jsessionId
let validGiftCardResponse
let removeCardResponse

describe('Giftcard Scenarios', () => {
  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccount()
    jsessionId = newAccount.jsessionid
    await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
    await superagent
      .get(eps.checkout.orderSummary.path)
      .set(headers)
      .set({ Cookie: jsessionId })
  }, 60000)
  describe('POST: - Add Giftcard errors', () => {
    it(
      'Giftcard Error Schema => Declined Giftcard',
      async () => {
        let addDeclinedGiftCard
        try {
          addDeclinedGiftCard = await addGiftCard(jsessionId, declinedGiftCard)
        } catch (e) {
          addDeclinedGiftCard = e.response.body
        }

        expect(addDeclinedGiftCard).toMatchSchema(GIFTCARD_DECLINED_MESSAGE)
      },
      60000
    )

    it(
      'Giftcard Error Schema => Zero Balance Giftcard',
      async () => {
        let addZeroBalanceGiftCard
        try {
          addZeroBalanceGiftCard = await addGiftCard(
            jsessionId,
            zeroBalanceGiftCard
          )
        } catch (e) {
          addZeroBalanceGiftCard = e.response.body
        }

        expect(addZeroBalanceGiftCard).toMatchSchema(ZERO_BALANCE_CARD_MESSAGE)
      },
      60000
    )

    it(
      'Giftcard Error Schema => Invalid Giftcard Number',
      async () => {
        let addInvalidGiftcardNumber
        try {
          addInvalidGiftcardNumber = await addGiftCard(
            jsessionId,
            invalidGiftCardNumber
          )
        } catch (e) {
          addInvalidGiftcardNumber = e.response.body
        }

        expect(addInvalidGiftcardNumber).toMatchSchema(
          INVALID_GIFTCARD_NUMBER_MESSAGE
        )
      },
      60000
    )

    it(
      'Giftcard Error Schema => Missing Giftcard number',
      async () => {
        let addEmptyGiftCard
        try {
          addEmptyGiftCard = await addGiftCard(jsessionId, emptyGiftCard)
        } catch (e) {
          addEmptyGiftCard = e.response.body
        }

        expect(addEmptyGiftCard).toMatchSchema(EMPTY_CARD_NUMBER)
      },
      60000
    )

    it(
      'Giftcard Error Schema => Invalid Giftcard Pin Number',
      async () => {
        let addInvalidPinNumber
        try {
          addInvalidPinNumber = await addGiftCard(
            jsessionId,
            invalidPinNumberGiftCard
          )
        } catch (e) {
          addInvalidPinNumber = e.response.body
        }

        expect(addInvalidPinNumber).toMatchSchema(INVALID_PIN_NUMBER_MESSAGE)
      },
      60000
    )

    it(
      'Giftcard Error Schema => Incorrect Currency',
      async () => {
        let addIncorrectCurrency
        try {
          addIncorrectCurrency = await addGiftCard(
            jsessionId,
            invalidCurrencyGiftCard
          )
        } catch (e) {
          addIncorrectCurrency = e.response.body
        }

        expect(addIncorrectCurrency).toMatchSchema(INVALID_CURRENCY_MESSAGE)
      },
      60000
    )
  })

  describe('POST: - Add Giftcard', () => {
    it(
      'should return a valid Giftcard Schema',
      async () => {
        try {
          validGiftCardResponse = await addGiftCard(jsessionId, validGiftCard)
        } catch (e) {
          validGiftCardResponse = e.response.body
        }
        validGiftCardResponse.giftCards.forEach((card) =>
          expect(card).toMatchSchema(validGiftcardSchema)
        )
      },
      60000
    )

    it(
      'should return a valid OrderSummary => Basket Json schema',
      async () => {
        const body = validGiftCardResponse.basket
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      60000
    )

    // This is skipped as these test always cover the whole ammount of the order, so after the 50% redemption is implemented
    // the user will not be able to add another gift card, this can be unskipped once we go back to 100% redemption
    it.skip(
      'Giftcard Error Schema => Duplicate Giftcard',
      async () => {
        let addDuplicateGiftCard
        try {
          addDuplicateGiftCard = await addGiftCard(jsessionId, validGiftCard)
        } catch (e) {
          addDuplicateGiftCard = e.response.body
        }

        expect(addDuplicateGiftCard).toMatchSchema(
          GIFTCARD_DUPLICATE_CARD_MESSAGE
        )
      },
      60000
    )
  })

  describe('DELETE: - Remove Giftcard', () => {
    //  Please note if this test is failing is because the balance of the card is zero or the card is expired or not active
    it(
      'should return a valid OrderSummary => Basket Json schema',
      async () => {
        removeCardResponse = await removeGiftCard(
          jsessionId,
          validGiftCardResponse.giftCards[0].giftCardId
        )

        const body = removeCardResponse.basket
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      60000
    )
  })
})
