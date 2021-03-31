import { createAccount } from '../../utilis/userAccount'
import { getProducts } from '../../utilis/selectProducts'
import { payOrder } from '../../utilis/payOrder'
import { addItemToShoppingBag2 } from '../../utilis/shoppingBag'
import completedOrderSchema from '../order-complete.schema'

describe('ClearPay POST /order', () => {
  let orderCompleted

  beforeAll(async () => {
    const products = await getProducts()
    const newAccount = await createAccount()
    const shoppingBag = await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId
    )

    orderCompleted = await payOrder(
      newAccount.jsessionid,
      shoppingBag.orderId,
      'CLRPY',
      {
        nameAndPhone: {
          firstName: 'Mario',
          lastName: 'Rossi',
        },
      }
    )
  }, 60000)

  it('should have a status code of 200', () => {
    expect(orderCompleted.statusCode).toBe(200)
  })

  it('should match the completeOrder schema', () => {
    const responseBodySchema = {
      title: 'clearPay',
      type: 'object',
      required: completedOrderSchema.requiredPropertiesClearPay,
      properties: completedOrderSchema.clearPaySchemaSuccess,
    }
    expect(orderCompleted.body).toMatchSchema(responseBodySchema)
  })
})
