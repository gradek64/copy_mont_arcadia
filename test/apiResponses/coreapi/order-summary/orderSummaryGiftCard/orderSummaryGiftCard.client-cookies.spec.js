/* eslint-disable no-restricted-syntax,no-prototype-builtins */

require('@babel/register')

jest.unmock('superagent')
import chai from 'chai'

chai.use(require('chai-json-schema'))

import { createAccountResponse } from '../../utilis/userAccount'
import {
  addGiftCardResponse,
  removeGiftCardResponse,
} from '../../utilis/giftCard'
import {
  validGiftcardSchema,
  orderSummarySchemaBasket,
} from '../order-summary.schema'
import { getProducts } from '../../utilis/selectProducts'
import { addItemToShoppingBagResponse } from '../../utilis/shoppingBag'

import {
  validGiftCard,
  zeroBalanceGiftCard,
  invalidGiftCardNumber,
  invalidPinNumberGiftCard,
  invalidCurrencyGiftCard,
  declinedGiftCard,
  emptyGiftCard,
  giftCardToCoverBasketTotal,
} from '../order-summary-data'

import {
  GIFTCARD_DECLINED_MESSAGE,
  GIFTCARD_DUPLICATE_CARD_MESSAGE,
  ZERO_BALANCE_CARD_MESSAGE,
  INVALID_GIFTCARD_NUMBER_MESSAGE,
  INVALID_PIN_NUMBER_MESSAGE,
  INVALID_CURRENCY_MESSAGE,
  EMPTY_CARD_NUMBER,
} from '../../message-data'
import { processClientCookies } from '../../utilis/cookies'
import { getOrderSummary } from '../../utilis/orderSummary'

describe('POST: - Add Giftcard', () => {
  let products
  let cookies
  let mergeCookies

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  beforeEach(async () => {
    ;({ mergeCookies } = processClientCookies())
    const newAccountResponse = await createAccountResponse()
    cookies = mergeCookies(newAccountResponse)
    const shoppingBagResponse = await addItemToShoppingBagResponse(
      cookies,
      products.productsSimpleId
    )
    cookies = mergeCookies(shoppingBagResponse)
    const orderSummaryResponse = await getOrderSummary(cookies)
    cookies = mergeCookies(orderSummaryResponse)
  }, 60000)

  describe('Add Valid Gifcard', () => {
    let validGiftCardResponse

    beforeEach(async () => {
      try {
        validGiftCardResponse = await addGiftCardResponse(
          cookies,
          validGiftCard
        )
      } catch (e) {
        validGiftCardResponse = e.response.body
      }
    })

    it(
      'should return a valid Giftcard Schema',
      async () => {
        validGiftCardResponse.body.giftCards.forEach((card) =>
          expect(card).toMatchSchema(validGiftcardSchema)
        )
      },
      60000
    )

    it(
      'should return a valid OrderSummary => Basket Json schema',
      async () => {
        const body = validGiftCardResponse.body.basket

        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      60000
    )
  })

  describe('DELETE: - Remove Giftcard', () => {
    //  Please note if this test is failing is because the balance of the card is zero or the card is expired or not active
    it(
      'should return a valid OrderSummary => Basket Json schema',
      async () => {
        const addValidGiftCard = await addGiftCardResponse(
          cookies,
          giftCardToCoverBasketTotal
        )
        cookies = mergeCookies(addValidGiftCard)
        const giftCardTwo = await addGiftCardResponse(cookies, validGiftCard)
        cookies = mergeCookies(giftCardTwo)
        const removeCardResponse = await removeGiftCardResponse(
          cookies,
          addValidGiftCard.body.giftCards[0].giftCardId
        )
        const body = removeCardResponse.body.basket
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      60000
    )
  })

  describe('POST: - Add Giftcard errors', () => {
    it(
      'Giftcard Error Schema => Duplicate Giftcard',
      async () => {
        let addDuplicateGiftCard
        try {
          await addGiftCardResponse(cookies, validGiftCard)
          addDuplicateGiftCard = await addGiftCardResponse(
            cookies,
            validGiftCard
          )
        } catch (e) {
          addDuplicateGiftCard = e.response.body
        }

        expect(addDuplicateGiftCard).toMatchSchema(
          GIFTCARD_DUPLICATE_CARD_MESSAGE
        )
      },
      60000
    )

    it(
      'Giftcard Error Schema => Declined Giftcard',
      async () => {
        let addDeclinedGiftCard
        try {
          addDeclinedGiftCard = await addGiftCardResponse(
            cookies,
            declinedGiftCard
          )
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
          addZeroBalanceGiftCard = await addGiftCardResponse(
            cookies,
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
          addInvalidGiftcardNumber = await addGiftCardResponse(
            cookies,
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
          addEmptyGiftCard = await addGiftCardResponse(cookies, emptyGiftCard)
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
          addInvalidPinNumber = await addGiftCardResponse(
            cookies,
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
          addIncorrectCurrency = await addGiftCardResponse(
            cookies,
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
})
