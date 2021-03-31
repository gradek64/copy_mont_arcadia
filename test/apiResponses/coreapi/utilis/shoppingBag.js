require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

// DELIVERY OPTIONS
import eps from '../routes_tests'

export const PROMOTION_CODE = 'F84MB92NV9'

export const headers = {
  'Content-Type': 'application/json',
  'BRAND-CODE': 'tsuk',
}

export const deliveryOptions = {
  collectFromParcelShop: { deliveryOptionId: '47524' },
  collectFromStoreExpress: { deliveryOptionId: '45020' },
  standardDelivery: { deliveryOptionId: '26504' },
  freeCollectFromStoreStandard: { deliveryOptionId: '45019' },
  expressNominatedDayDelivery: { deliveryOptionId: '28004' },
  collectFromStoreToday: { deliveryOptionId: '51017' },
}

// GET
export const shoppingBagAddProduct = 21248188
export const shoppingBagProductWasPrice = 17699927
// POST
export const shoppingBagAddProductSimple = {
  productId: 21919934,
  sku: '602015000890858',
  quantity: 1,
}
export const shoppingBagAddProductWasPrice = {
  productId: 17699927,
  sku: '602014000789145',
  quantity: 1,
}
export const shoppingBagAddProductWasWasPrice = {
  productId: 21986324,
  sku: '602015000892527',
  quantity: 1,
}
// PUT
export const shoppingBagAddProductWasWasPriceChangeQty = {
  quantity: '2',
  catEntryIdToDelete: 21986331,
  catEntryIdToAdd: 21986331,
}
export const expectedTotalPriceOnChangeQty = '110.00'
export const expectedPriceOnChangeQty = '106.00'
export const shoppingBagAddProductWasWasPriceChangeSize = {
  quantity: '1',
  catEntryIdToDelete: 21986331,
  catEntryIdToAdd: 21986341,
}

export const addItemToShoppingBag = async (
  jsessionid = '',
  item = {},
  responseType = 'basket'
) => {
  const product = {
    productId: item.productId,
    sku: item.productSku,
    quantity: item.productQuantity,
    responseType,
  }
  const shoppingBagResponse = await superagent
    .post(eps.shoppingBag.addItem.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(product)
  return shoppingBagResponse.body
}

export const addItemToShoppingBag2 = async (
  jsessionid = '',
  item = {},
  extraparams = true,
  responseType = 'basket'
) => {
  const product = {
    productId: item.productId,
    sku: item.productSku,
    partNumber: item.productSku,
    quantity: item.productQuantity,
    responseType,
    catEntryid: extraparams ? item.catEntry : undefined,
    noRedirect: extraparams,
  }
  const shoppingBagResponse = await superagent
    .post(eps.shoppingBag.addItem2.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(product)
  return shoppingBagResponse.body
}

export const guestAddItemToShoppingBag = async (
  item = {},
  extraparams = true,
  responseType = 'basket'
) => {
  const product = {
    productId: item.productId,
    sku: item.productSku,
    partNumber: item.productSku,
    quantity: item.productQuantity,
    responseType,
    catEntryid: extraparams ? item.catEntry : undefined,
    noRedirect: extraparams,
  }
  const shoppingBagResponse = await superagent
    .post(eps.shoppingBag.addItem2.path)
    .set(headers)
    .send(product)

  const sessionId = shoppingBagResponse.headers['set-cookie']
    .toString()
    .split(';')

  return {
    shoppingBag: shoppingBagResponse.body,
    jsessionid: sessionId[0],
  }
}

export const addItemToShoppingBagResponse = async (
  cookies = '',
  item = {},
  extraparams = true,
  responseType = 'basket'
) => {
  const product = {
    productId: item.productId,
    sku: item.productSku,
    partNumber: item.productSku,
    quantity: item.productQuantity,
    responseType,
    catEntryid: extraparams ? item.catEntry : undefined,
    noRedirect: extraparams,
  }
  const shoppingBagResponse = await superagent
    .post(eps.shoppingBag.addItem2.path)
    .set(headers)
    .set('Cookie', cookies)
    .send(product)
  return shoppingBagResponse
}

export const removeItemFromShoppingBag = async (
  jsessionid,
  idOrder,
  idItemOrder,
  isDDPItem = false,
  responseType = 'basket'
) => {
  const itemTobeRemoved = await superagent
    .delete(eps.shoppingBag.deleteItem.path)
    .query(
      `orderId=${idOrder}&orderItemId=${idItemOrder}&responseType=${responseType}&isDDPItem=${isDDPItem}`
    )
    .set(headers)
    .set({ Cookie: jsessionid })

  const { body, statusCode } = itemTobeRemoved
  return {
    body,
    statusCode,
  }
}

export const removeItemFromShoppingBagResponse = async (
  cookies = '',
  idOrder,
  idItemOrder,
  isDDPItem = false,
  responseType = 'basket'
) => {
  const itemTobeRemoved = await superagent
    .delete(eps.shoppingBag.deleteItem.path)
    .query(
      `orderId=${idOrder}&orderItemId=${idItemOrder}&responseType=${responseType}&isDDPItem=${isDDPItem}`
    )
    .set(headers)
    .set({ Cookie: cookies })

  return itemTobeRemoved
}

export const fetchSizeQty = async (jsessionid, catEntryId) => {
  const fetchBody = await superagent
    .get(eps.shoppingBag.fetchSizeQty.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .query({
      catEntryId,
    })
  return fetchBody.body
}

export const fetchSizeQtyResponse = async (cookies = '', catEntryId) => {
  const fetchBody = await superagent
    .get(eps.shoppingBag.fetchSizeQty.path)
    .set(headers)
    .set({ Cookie: cookies })
    .query({
      catEntryId,
    })
  return fetchBody
}

export const updateShoppingBagItem = async (
  jsessionid,
  catEntryIdToAdd,
  catEntryIdToDelete,
  quantity,
  responseType
) => {
  const payload = {
    catEntryIdToAdd,
    catEntryIdToDelete,
    quantity,
    responseType,
  }
  const updateShoppingBagBody = await superagent
    .put(eps.shoppingBag.updateItem.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(payload)
  return updateShoppingBagBody.body
}

export const updateShoppingBagItemResponse = async (
  cookies = '',
  catEntryIdToAdd,
  catEntryIdToDelete,
  quantity,
  responseType
) => {
  const payload = {
    catEntryIdToAdd,
    catEntryIdToDelete,
    quantity,
    responseType,
  }
  const updateShoppingBagBody = await superagent
    .put(eps.shoppingBag.updateItem.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(payload)
  return updateShoppingBagBody
}

export const updateShoppingBagDelivery = async (
  jsessionid,
  deliveryOptionsId
) => {
  const shoppingBagDeliveryBody = await superagent
    .put(eps.shoppingBag.updateDelivery.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send(deliveryOptionsId)
  return shoppingBagDeliveryBody.body
}

export const updateShoppingBagDeliveryResponse = async (
  cookies,
  deliveryOptionsId
) => {
  const shoppingBagDeliveryResponse = await superagent
    .put(eps.shoppingBag.updateDelivery.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(deliveryOptionsId)
  return shoppingBagDeliveryResponse
}

export const promotionCode = async (
  jsessionid,
  responseType = 'basket',
  newPromoCode = PROMOTION_CODE
) => {
  const addPromoBody = await superagent
    .post(eps.shoppingBag.addPromotionCode.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send({ promotionId: newPromoCode, responseType })
  return addPromoBody.body
}

export const promotionCodeResponse = async (
  cookies = '',
  responseType = 'basket',
  newPromoCode = PROMOTION_CODE
) => {
  const addPromoBody = await superagent
    .post(eps.shoppingBag.addPromotionCode.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send({ promotionId: newPromoCode, responseType })
  return addPromoBody
}

export const deletePromotionCode = async (
  jsessionid,
  responseType = 'basket',
  newPromoCode = PROMOTION_CODE
) => {
  const removePromoBody = await superagent
    .delete(eps.shoppingBag.deletePromotionCode.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send({ promotionCode: newPromoCode, responseType })
  return removePromoBody.body
}

export const deletePromotionCodeResponse = async (
  cookies = '',
  responseType = 'basket',
  newPromoCode = PROMOTION_CODE
) => {
  const removePromoBody = await superagent
    .delete(eps.shoppingBag.deletePromotionCode.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send({ promotionCode: newPromoCode, responseType })
  return removePromoBody
}

export const transferShoppingBag = async (jsessionid = '') => {
  const transfer = await superagent
    .post(eps.shoppingBag.transferShoppingBag.path)
    .set(headers)
    .set({ Cookie: jsessionid })
    .send({
      transferStoreID: 13058,
      transferOrderID: 9596538,
    })
  return transfer.body
}

export const transferShoppingBagResponse = async (cookies = '') => {
  const transfer = await superagent
    .post(eps.shoppingBag.transferShoppingBag.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send({
      transferStoreID: 13058,
      transferOrderID: 9596538,
    })
  return transfer
}
