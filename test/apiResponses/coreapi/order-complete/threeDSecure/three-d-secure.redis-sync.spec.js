import { createAccount } from '../../utilis/userAccount'
import { getProducts } from '../../utilis/selectProducts'
import { payOrder } from '../../utilis/payOrder'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import { getResponseAndSessionCookies } from '../../utilis/redis'

describe('3D Secure v1 for new users', () => {
  let orderCompleted

  beforeAll(async () => {
    const products = await getProducts()
    const newAccount = await createAccount()
    const shoppingBag = await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId
    )

    // The name '3D. Authorised' must be used in conjunction with the card number
    // 4444333322221111 to trigger a 3D Secure flow in the payment sandbox.
    orderCompleted = await payOrder(
      newAccount.jsessionid,
      shoppingBag.orderId,
      'VISA',
      {
        nameAndPhone: {
          firstName: '3D.',
          lastName: 'Authorised',
        },
      }
    )
  }, 60000)

  it(
    'should keep redis and client cookies in sync',
    async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    },
    60000
  )
})
