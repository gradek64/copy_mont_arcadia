const promosSchema = {
  type: 'object',
  properties: {
    ecommerce: {
      type: 'object',
      properties: {
        promoClick: {
          type: 'object',
          properties: {
            promotions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                  creative: {
                    type: ['string'],
                  },
                  position: {
                    type: ['string'],
                  },
                },
                required: ['id', 'name'],
              },
            },
          },
          required: ['promotions'],
        },
      },
      required: ['promoClick'],
    },
  },
  required: ['ecommerce'],
}

export default promosSchema
