const isBoohooCardType = (cartType) =>
  ['70', '73', '76', '0', '1', '7', '61', '60', '67'].includes(cartType)
const isBoohooBrand = (brandCode) => ['br', 'wl', 'dp'].includes(brandCode)
const isCityChickCardType = (cartType) => ['74', '2', '62'].includes(cartType)
const isCityChickBrand = (brandCode) => brandCode === 'ev'
const isRuleBasedOn9thDigit = (cartType) =>
  ['00', '01', '80', '81', '03'].includes(cartType)

export const canGiftCardBeRedeemed = (giftCardNumber, brandCode) => {
  const cardType = `${giftCardNumber.charAt(6)}${giftCardNumber.charAt(7)}`
  const cardIdentifier = isRuleBasedOn9thDigit(cardType)
    ? giftCardNumber.charAt(8)
    : cardType

  if (isCityChickCardType(cardIdentifier) && isCityChickBrand(brandCode))
    return true
  else if (isBoohooCardType(cardIdentifier) && isBoohooBrand(brandCode))
    return true
  return false
}
