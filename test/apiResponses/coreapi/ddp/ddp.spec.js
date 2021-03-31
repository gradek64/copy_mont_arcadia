require('@babel/register')

import { getProducts } from '../utilis/selectProducts'
import { createAccount } from '../utilis/userAccount'
import {
  addItemToShoppingBag2,
  updateShoppingBagDelivery,
  removeItemFromShoppingBag,
  deliveryOptions,
} from '../utilis/shoppingBag'

describe('DDP with home delivery', () => {
  let products
  let newAccount
  let shoppingBag

  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccount()

    await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId
    )

    shoppingBag = await addItemToShoppingBag2(newAccount.jsessionid, {
      productId: '32075155',
      productSku: '100000012',
      partNumber: '100000012',
      productQuantity: 1,
    })
  }, 60000)

  /*  Due to the covid related changes to the delivery options this test is skipped in ADP-3115
    PLEASE unskip once the WCS changes are reverted.
    The ticket to unskip this test is a placeholder ticket in the backlog: ADP-3116
  */
  it.skip('should default to home express when DDP is added to shopping bag', async () => {
    const selectedDeliveryMethods = shoppingBag.deliveryOptions.filter(
      (deliveryMethods) => deliveryMethods.selected === true
    )
    expect(selectedDeliveryMethods[0].type).toEqual('home_express')
  })

  it('should default to store standard when DDP is removed from shopping bag', async () => {
    const remove = await removeItemFromShoppingBag(
      newAccount.jsessionid,
      shoppingBag.orderId,
      shoppingBag.products[1].orderItemId,
      shoppingBag.products[1].isDDPProduct
    )

    const selectedDeliveryMethods = remove.body.deliveryOptions.filter(
      (deliveryMethods) => deliveryMethods.selected === true
    )
    expect(selectedDeliveryMethods[0].type).toEqual('home_standard')
  })
})

describe.skip('DDP with store collection', () => {
  let products
  let newAccount
  let shoppingBag

  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccount()

    await addItemToShoppingBag2(
      newAccount.jsessionid,
      products.productsSimpleId
    )

    await updateShoppingBagDelivery(
      newAccount.jsessionid,
      deliveryOptions.freeCollectFromStoreStandard
    )

    shoppingBag = await addItemToShoppingBag2(newAccount.jsessionid, {
      productId: '32075155',
      productSku: '100000012',
      partNumber: '100000012',
      productQuantity: 1,
    })
  }, 60000)

  it('should default to store express when DDP is added to shopping bag', async () => {
    const selectedDeliveryMethods = shoppingBag.deliveryOptions.filter(
      (deliveryMethods) => deliveryMethods.selected === true
    )
    expect(selectedDeliveryMethods[0].type).toEqual('store_express')
  })

  it('should default to store standard when DDP is removed from shopping bag', async () => {
    const remove = await removeItemFromShoppingBag(
      newAccount.jsessionid,
      shoppingBag.orderId,
      shoppingBag.products[1].orderItemId,
      shoppingBag.products[1].isDDPProduct
    )

    const selectedDeliveryMethods = remove.body.deliveryOptions.filter(
      (deliveryMethods) => deliveryMethods.selected === true
    )
    expect(selectedDeliveryMethods[0].type).toEqual('store_standard')
  })
})
