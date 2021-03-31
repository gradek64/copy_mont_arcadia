export const productSchemaForBasket = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    lineNumber: { type: 'string' },
    name: { type: 'string' },
    price: { type: 'string' },
    unitWasPrice: { type: 'string' },
    unitNowPrice: { type: 'string' },
    markdown: { type: 'string' },
    brand: { type: 'string' },
    colour: { type: 'string' },
    quantity: { type: 'string' },
    category: { type: 'string' },
    size: { type: 'string' },
    totalSizes: { type: 'string' },
    sizesInStock: { type: 'string' },
    sizesAvailable: { type: 'string' },
    reviewRating: { type: 'string' },
  },
  required: ['name', 'price'],
}

export const productClickSchema = {
  type: 'object',
  properties: {
    ecommerce: {
      type: 'object',
      properties: {
        click: {
          type: 'object',
          properties: {
            actionField: {
              type: 'object',
              properties: {
                list: {
                  type: 'string',
                },
              },
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  id: {
                    type: 'number',
                  },
                  price: {
                    type: 'string',
                  },
                  brand: {
                    type: 'string',
                  },
                  category: {
                    type: 'string',
                  },
                  position: {
                    type: 'number',
                  },
                },
                required: ['id', 'name'],
              },
            },
          },
          required: ['actionField', 'products'],
        },
      },
      required: ['click'],
    },
  },
  required: ['ecommerce'],
}
