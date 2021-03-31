export default {
  type: 'object',
  strict: true,
  properties: {
    titles: {
      type: 'array',
      items: { type: 'string' },
    },
    billingCountries: {
      type: 'array',
      items: { type: 'string' },
    },
    creditCardOptions: {
      type: 'array',
      items: {
        type: 'object',
        strict: true,
        properties: {
          value: { type: 'string' },
          label: { type: 'string' },
          defaultPayment: { type: 'boolean' },
        },
      },
    },
    expiryMonths: {
      type: 'array',
      items: { type: 'string', exactLength: 2 },
    },
    expiryYears: {
      type: 'array',
      items: { type: 'string', exactLength: 4 },
    },
    currencyCode: { type: 'string', exactLength: 3 },
    USStates: {
      type: 'array',
      items: { type: 'string', exactLength: 2 },
    },
    peakService: { type: 'boolean' },
    version: { type: 'string' },
  },
}
