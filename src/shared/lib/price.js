const currencyConfig = {
  GBP: {
    symbol: '\u00A3',
    position: 'before',
    radixChar: '.',
  },
  EUR: {
    symbol: ' \u20AC',
    position: 'after',
    radixChar: ',',
  },
  USD: {
    symbol: '$',
    position: 'before',
    radixChar: '.',
  },
}

export function formatForRadix(price, radixChar = ',') {
  return typeof price === 'string'
    ? parseFloat(price.replace(radixChar, '.'))
    : price
}

export function format(currencyCode, price = 0, asObject) {
  const config = currencyConfig[currencyCode]

  if (!config) {
    return currencyCode
  }

  const { symbol, position, radixChar } = config

  const valueToUpdate = formatForRadix(price, radixChar)
  const value = valueToUpdate
    .toFixed(2)
    .toString()
    .replace('.', radixChar)

  if (asObject) {
    price = {
      symbol,
      value,
      position,
    }
  } else {
    price = position === 'before' ? `${symbol}${value}` : `${value}${symbol}`
  }

  return price
}

export function normalizePrice(price) {
  return price.replace(/[^\d,.-]/g, '')
}
