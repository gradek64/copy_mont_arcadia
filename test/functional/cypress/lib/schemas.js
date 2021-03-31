import t from 'tcomb'

const validator = (regex, name) => {
  const Validator = t.refinement(
    t.maybe(t.Any),
    (v) => {
      if (typeof v !== 'string') {
        return false
      }
      return regex.test(v)
    },
    name
  )
  return Validator
}

const CurrencyCode = validator(/[A-Z]{3}/, 'CurrencyCode')

const StringCurrency = validator(/[0-9]+\.[0-9]{2}/, 'StringCurrency')

const StringPercentage = validator(/[0-9]+\.[0-9]{2}/, 'StringPercentage')

const StringInteger = validator(/[0-9]+/, 'StringInteger')

const stringConstant = (str) =>
  t.refinement(t.maybe(t.String), (x) => x === str, `Constant(${str})`)

const numberConstant = (num) =>
  t.refinement(t.maybe(t.Number), (x) => x === num, `Constant(${num})`)

const Product = t.struct(
  {
    category: t.maybe(t.String),
    colour: t.maybe(t.String),
    dimension16: t.maybe(t.String),
    dimension20: t.maybe(t.String),
    dimension21: t.maybe(StringInteger),
    dimension6: t.maybe(StringCurrency),
    dimension7: t.maybe(StringInteger),
    dimension8: t.maybe(t.String),
    dimension9: t.maybe(StringCurrency),
    id: t.maybe(t.String),
    productId: StringInteger,
    markdown: t.maybe(StringCurrency),
    metric1: t.maybe(t.Number),
    name: t.String,
    price: StringCurrency,
    quantity: StringInteger,
    size: t.maybe(t.String),
    sizesAvailable: t.maybe(StringPercentage),
    sizesInStock: t.maybe(t.String),
    totalSizes: t.maybe(StringInteger),
    unitNowPrice: StringCurrency,
  },
  'Product'
)

const checkoutStep = (step) =>
  t.struct(
    {
      ecommerce: t.struct({
        currencyCode: CurrencyCode,
        checkout: t.struct({
          actionField: t.struct({
            step: numberConstant(step),
            // action: stringConstant('checkout')
          }),
          products: t.list(Product),
        }),
      }),
    },
    `CheckoutStep${step}`
  )

export const CheckoutStep1 = checkoutStep(1)

export const CheckoutStep2 = checkoutStep(2)

export const CheckoutStep3 = checkoutStep(3)

export const CheckoutStep4 = checkoutStep(4)

export const EcommerceDetail = t.struct(
  {
    ecommerce: t.struct({
      currencyCode: CurrencyCode,
      detail: t.struct({
        products: t.list(Product),
      }),
    }),
  },
  'EcommerceDetail'
)

export const EcommerceProducts = t.struct(
  {
    ecommerce: t.struct({
      currencyCode: CurrencyCode,
      products: t.list(Product),
    }),
  },
  'EcommerceProducts'
)

export const ImpressionDetails = t.struct({
  ecommerce: t.struct({
    impressions: t.list(Product),
  }),
})

export const AddToBasket = t.struct(
  {
    ecommerce: t.struct({
      currencyCode: CurrencyCode,
      add: t.struct({
        actionField: t.struct({
          addType: stringConstant('Add to Basket'),
        }),
        products: t.list(Product),
      }),
    }),
    event: stringConstant('addToBasket'),
    'gtm.uniqueEventId': t.Number,
  },
  'AddToBasket'
)

export const RemoveFromBasket = t.struct(
  {
    ecommerce: t.struct({
      currencyCode: CurrencyCode,
      remove: t.struct({
        products: t.list(Product),
      }),
    }),
    event: stringConstant('removeFromBasket'),
    'gtm.uniqueEventId': t.Number,
  },
  'RemoveFromBasket'
)

export const OrderConfirmed = t.struct(
  {
    ecommerce: t.struct({
      currencyCode: CurrencyCode,
      purchase: t.struct({
        actionField: t.struct({
          id: StringInteger,
          revenue: StringCurrency,
          productRevenue: StringCurrency,
          markdownRevenue: StringCurrency,
          paymentType: t.String,
          orderDiscount: StringCurrency,
          discountValue: StringCurrency,
          orderCountry: t.String,
          deliveryPrice: StringCurrency,
          shippingOption: t.String,
          // action: stringConstant('purchase')
        }),
        products: t.list(Product),
      }),
    }),
    event: stringConstant('purchase'),
    'gtm.uniqueEventId': t.Number,
  },
  'OrderConfirmed'
)

export const QuickViewEventDetail = t.struct(
  {
    ecommerce: t.struct({
      currencyCode: CurrencyCode,
      detail: t.struct({
        products: t.list(Product),
      }),
    }),
    event: stringConstant('detail'),
  },
  'QuickViewEventDetail'
)

export const StringAvailableSizes = validator(
  /[0-9]+\.[0-9]{2}/,
  'String Available Sizes'
)
