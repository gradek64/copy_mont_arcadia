import { productSchemaForBasket } from './product'

export default {
  type: 'object',
  properties: {
    ecommerce: {
      oneOf: [
        {
          type: 'object',
          properties: {
            add: {
              type: 'object',
              properties: {
                actionField: {
                  type: 'object',
                  properties: {
                    addType: {
                      type: 'string',
                      enum: ['Add to Basket', 'Merge Bag'],
                    },
                  },
                },
                products: {
                  type: 'array',
                  items: productSchemaForBasket,
                },
              },
              required: ['actionField', 'products'],
            },
          },
          required: ['add'],
        },
        {
          type: 'object',
          properties: {
            remove: {
              type: 'object',
              properties: {
                products: {
                  type: 'array',
                  items: productSchemaForBasket,
                },
              },
              required: ['products'],
            },
          },
          required: ['remove'],
        },
      ],
    },
  },
  required: ['ecommerce'],
}
