import * as DataMapper from '../middleware/data-mapper'
import {
  getCheckoutDeliveryStore,
  getCheckoutOrderCompleted,
  getCheckoutOrderCountry,
} from '../../../shared/selectors/checkoutSelectors'
import { isDDPOrder, isDDPUser } from '../../../shared/selectors/ddpSelectors'

export default (state, products) => {
  const deliveryStore = getCheckoutDeliveryStore(state)
  const orderCompleted = getCheckoutOrderCompleted(state)
  const isDdpOrder = isDDPOrder(state) || isDDPUser(state) ? 'True' : 'False'

  const deliveryPrice = orderCompleted.deliveryPrice
    ? parseFloat(orderCompleted.deliveryPrice)
    : 0
  const totalOrderPrice = parseFloat(orderCompleted.totalOrderPrice)
  const productsPrice = totalOrderPrice - deliveryPrice
  const totalOrdersDiscount = orderCompleted.totalOrdersDiscount
    ? parseFloat(
        orderCompleted.totalOrdersDiscount
          .replace(/^[^\d]+/, '')
          .replace(/[^\d]+$/, '')
      )
    : 0.0
  const deliveryCountry = getCheckoutOrderCountry(state)
  const productRevenue = products.reduce(
    (acc, product) =>
      acc +
      parseFloat(product.unitWasPrice || product.unitNowPrice) *
        product.quantity,
    0
  )
  const markdown = products.reduce(
    (acc, cur) => acc + parseFloat(cur.unitNowPrice) * cur.quantity,
    0
  )

  const id = orderCompleted.orderId
    ? orderCompleted.orderId.toString()
    : undefined

  return {
    id,
    revenue: DataMapper.currency(totalOrderPrice),
    productRevenue: DataMapper.currency(productRevenue),
    markdownRevenue: DataMapper.currency(markdown),
    paymentType: orderCompleted.paymentDetails
      .map((item) => item.paymentMethod)
      .join(','),
    orderDiscount: DataMapper.currency(
      (totalOrdersDiscount / (productsPrice + totalOrdersDiscount)) * 100
    ),
    discountValue: DataMapper.currency(totalOrdersDiscount),
    orderCountry: deliveryCountry,
    deliveryPrice: DataMapper.currency(deliveryPrice),
    deliveryDiscount: undefined, // no way I can see of getting this from state (using a shipping discount code)
    shippingOption: orderCompleted.deliveryMethod,
    deliverToStore: deliveryStore ? deliveryStore.deliveryStoreCode : undefined,
    ddpOrder: isDdpOrder,
  }
}
