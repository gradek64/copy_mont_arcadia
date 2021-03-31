export const freeDeliveryNudge = {
  default: (l, price) => {
    return {
      nudgeTextPartOne: l`Spend ${price}`,
      nudgeTextPartTwo: l('more and get '),
      nudgeTextPartThree: l('free shipping'),
    }
  },
  dp: (l, price) => {
    return {
      nudgeTextPartOne: l`Spend ${price}`,
      nudgeTextPartTwo: l('more and get '),
      nudgeTextPartThree: l('FREE Standard Delivery'),
    }
  },
  ms: (l, price) => {
    return {
      nudgeTextPartOne: l`You're only ${price} away from`,
      nudgeTextPartTwo: l('FREE standard delivery'),
      nudgeTextPartThree: l('Go on, treat yourself...'),
    }
  },
}

export const getFreeDeliveryNudgeText = (l, brandCode, price) => {
  const freeDeliveryNudgeTextToRetrieve =
    freeDeliveryNudge[brandCode] || freeDeliveryNudge.default
  return freeDeliveryNudgeTextToRetrieve(l, price)
}

const freeDeliveryMessage = {
  default: {
    qualifiedForFreeDeliveryText: 'Your bag qualifies for',
    freeDeliveryText: 'free shipping',
  },
  dp: {
    qualifiedForFreeDeliveryText: 'Hurrah! You have qualified for ',
    freeDeliveryText: 'FREE Standard Delivery',
  },
  ms: {
    qualifiedForFreeDeliveryText: 'Congratulations!',
    freeDeliveryText: `You've qualified for FREE standard delivery`,
  },
}

export const getFreeDeliveryText = (brandCode) =>
  freeDeliveryMessage[brandCode] || freeDeliveryMessage.default

const freeExpressDeliveryMessage = {
  default: {
    qualifiedForFreeExpressDeliveryText: '',
    freeExpressDeliveryText: '',
  },
  ms: {
    qualifiedForFreeExpressDeliveryText: 'Congratulations!',
    freeExpressDeliveryText: `You've qualified for FREE express delivery`,
  },
}

export const getFreeExpressDeliveryText = (brandCode) =>
  freeExpressDeliveryMessage[brandCode] || freeExpressDeliveryMessage.default
