import GetPaymentsMethods from './lib/payments/getPaymentsMethods'

/* **** We expose this handler (like interface) **** */

/*
 **** GET ****
 *
 * - ACCEPT : (delivery OR billing optional)
 * delivery (string) - ex: '?delivery=United%20Kingdom'
 * billing (string) - ex: '?billing=United%20Kingdom'
 *
 * - RETURN :
 * list of objects (payments methods)
 */
export const paymentMethodsHandler = (req, reply) => {
  try {
    const payments = new GetPaymentsMethods(req)
    reply(payments.selectRequest()).code(200)
  } catch (err) {
    reply({ error: err.message }).code(417)
  }
}

export const getPaymentMethodsSpec = {
  summary: 'Returns the available payment methods for the given brand code',
  parameters: [
    {
      in: 'query',
      name: 'delivery',
      description: 'Delivery country name e.g. "United Kingdom"',
      required: true,
      type: 'string',
    },
    {
      in: 'query',
      name: 'billing',
      description: 'Billing country name e.g. "United Kingdom"',
      required: true,
      type: 'string',
    },
  ],
  responses: {
    200: {
      description: 'The available payment methods',
      schema: {
        type: 'array',
        items: {
          required: [
            'value',
            'type',
            'label',
            'description',
            'icon',
            'validation',
          ],
          properties: {
            value: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
            label: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            icon: {
              type: 'string',
            },
            validation: {
              required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
              properties: {
                cardNumber: {
                  required: ['length', 'message'],
                  properties: {
                    length: {
                      type: 'number',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                  type: 'object',
                },
                cvv: {
                  required: ['length', 'message'],
                  properties: {
                    length: {
                      type: 'number',
                    },
                    message: {
                      type: 'string',
                    },
                  },
                  type: 'object',
                },
                expiryDate: {
                  type: 'string',
                },
              },
              type: 'object',
            },
          },
        },
      },
    },
  },
}
