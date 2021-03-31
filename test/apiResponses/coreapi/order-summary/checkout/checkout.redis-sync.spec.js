require('@babel/register')

jest.unmock('superagent')
import { getProducts } from '../../utilis/selectProducts'
import { createAccount } from '../../utilis/userAccount'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import { getOrderSummary } from '../../utilis/orderSummary'
import { getResponseAndSessionCookies } from '../../utilis/redis'

describe('It should return Order Summary Json', () => {
  it(
    'should keep redis in sync with client',
    async () => {
      const products = await getProducts()
      const newAccount = await createAccount()
      const jsessionId = newAccount.jsessionid
      await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
      const orderSummaryResp = await getOrderSummary(jsessionId)
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderSummaryResp
      )
      expect(responseCookies).toMatchSession(session)
    },
    60000
  )
})
