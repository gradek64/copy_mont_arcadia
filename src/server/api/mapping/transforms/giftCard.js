import { path } from 'ramda'
import orderSummaryTransform from './orderSummary'
import basketTransform from './basket'

const numberFragment = (number = 0) => {
  return number ? Number(number).toFixed(2) : '0.00'
}

const giftCardFragment = ({
  giftCardId = '',
  giftCardNumber = '',
  balance = 0,
  amountUsed = 0,
  remainingBalance = 0,
}) => ({
  giftCardId:
    typeof giftCardId === 'string' ? giftCardId.replace('gift_card_', '') : '',
  giftCardNumber,
  balance: numberFragment(balance),
  amountUsed: numberFragment(amountUsed),
  remainingBalance: numberFragment(remainingBalance),
})

const giftCardsFragment = (giftCards = []) => {
  if (Array.isArray(giftCards)) {
    return giftCards.map(giftCardFragment)
  }
  return []
}

const giftCardDiscountFragment = ({
  giftCardNumber = '',
  amountUsed = 0,
} = {}) => ({
  label: giftCardNumber ? `Gift Card - ${giftCardNumber}` : '',
  value: Math.abs(amountUsed).toFixed(2),
})

const giftCardDiscountsFragment = (giftCards = [], discounts = []) => {
  if (Array.isArray(giftCards) && Array.isArray(discounts)) {
    return [...giftCards.map(giftCardDiscountFragment), ...discounts]
  }
  return []
}

const giftCardTransform = (
  {
    Basket = {},
    deliveryLocationTypeForm = {},
    deliveryOptionsDetails = {},
    giftCards = {},
    paymentDetailsDisplay = {},
    storeDeliveryOptionsDetails = {},
    isGuestOrder,
  },
  isGuest = false,
  currencySymbol = ''
) => {
  const orderSummary = {
    Basket,
    deliveryLocationTypeForm,
    // In case of Home Delivery the delivery options will be inside the "deliveryOptionsDetails" property.
    // In case of Store Delivery selected the delivery options will be inside the "storeDeliveryOptionsDetails" property.
    deliveryoptionsform:
      deliveryOptionsDetails.deliveryoptionsform ||
      storeDeliveryOptionsDetails.deliveryoptionsform,
    OrderCalculateForm: paymentDetailsDisplay.OrderCalculateForm,
    isGuestOrder,
  }

  // Monty expects gift cards to be included in the "discounts" array however WCS is incapable of that, so the basket needs to be amended separately.
  const basket = {
    ...basketTransform(Basket, currencySymbol),
    discounts: giftCardDiscountsFragment(
      path(['GiftCardsManagerForm', 'giftCards'], giftCards),
      Basket.discounts
    ),
  }

  let response = {
    ...orderSummaryTransform(orderSummary, isGuest, currencySymbol),
    basket,
    giftCards: giftCardsFragment(
      path(['GiftCardsManagerForm', 'giftCards'], giftCards)
    ),
  }

  const storeAddress = path(
    ['deliveryoptionsform', 'deliveryDetails', 'address'],
    storeDeliveryOptionsDetails
  )

  if (storeAddress && storeAddress.address1) {
    response = {
      ...response,
      storeDetails: { ...storeAddress },
      deliveryStoreCode:
        path(['deliveryoptionsform', 'field1'], storeDeliveryOptionsDetails) ||
        '',
    }
  }

  return response
}

export {
  numberFragment,
  giftCardFragment,
  giftCardsFragment,
  giftCardDiscountFragment,
  giftCardDiscountsFragment,
}

export default giftCardTransform
