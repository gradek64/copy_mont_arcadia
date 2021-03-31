require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import {
  headers,
  stringType,
  objectType,
  numberTypePattern,
  stringTypePattern,
} from '../utilis'
import { SriLankaPaymentQuery, UKPaymentQuery } from './payments-data'

describe('It should return Payments available in the UK', () => {
  let response
  beforeAll(async () => {
    response = await superagent
      .get(eps.payments.payment.path)
      .query(UKPaymentQuery)
      .set(headers)
  }, 30000)

  it(
    'Payments Schema in the UK => VISA',
    () => {
      const body = response.body[0]
      const paymentSchema = {
        title: 'Visa payment Schema',
        type: 'object',
        required: [
          'value',
          'type',
          'label',
          'description',
          'icon',
          'validation',
        ],
        properties: {
          value: stringTypePattern('VISA'),
          type: stringTypePattern('CARD'),
          label: stringTypePattern('Visa'),
          description: stringType,
          icon: stringType,
          validation: objectType,
        },
      }
      expect(body).toMatchSchema(paymentSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => VISA => validation',
    () => {
      const body = response.body[0].validation
      const validationSchema = {
        title: 'Visa payment Validation Schema',
        type: 'object',
        required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
        properties: {
          cardNumber: objectType,
          cvv: objectType,
          expiryDate: stringType,
          startDate: {
            type: 'null',
          },
        },
      }
      expect(body).toMatchSchema(validationSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => VISA => validation => cardNumber',
    () => {
      const body = response.body[0].validation.cardNumber
      const cardNumberSchema = {
        title: 'Visa payment card number Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(16),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cardNumberSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => VISA => validation => cvv',
    () => {
      const body = response.body[0].validation.cardNumber
      const cvvSchema = {
        title: 'Visa payment cvv Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(3),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cvvSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => MASTERCARD',
    () => {
      const body = response.body[1]
      const paymentSchema = {
        title: 'Mastercard payment Schema',
        type: 'object',
        required: [
          'value',
          'type',
          'label',
          'description',
          'icon',
          'validation',
        ],
        properties: {
          value: stringTypePattern('MCARD'),
          type: stringTypePattern('CARD'),
          label: stringTypePattern('MasterCard'),
          description: stringType,
          icon: stringType,
          validation: objectType,
        },
      }
      expect(body).toMatchSchema(paymentSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => MASTERCARD => validation',
    () => {
      const body = response.body[1].validation
      const validationSchema = {
        title: 'Mastercard payment Validation Schema',
        type: 'object',
        required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
        properties: {
          cardNumber: objectType,
          cvv: objectType,
          expiryDate: stringType,
          startDate: {
            type: 'null',
          },
        },
      }
      expect(body).toMatchSchema(validationSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => MASTERCARD => validation => cardNumber',
    () => {
      const body = response.body[1].validation.cardNumber
      const cardNumberSchema = {
        title: 'Mastercard payment card number Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(16),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cardNumberSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => MASTERCARD => validation => cvv',
    () => {
      const body = response.body[1].validation.cardNumber
      const cvvSchema = {
        title: 'Mastercard payment cvv Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(3),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cvvSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => AMEX',
    () => {
      const body = response.body[2]
      const paymentSchema = {
        title: 'American Express payment Schema',
        type: 'object',
        required: [
          'value',
          'type',
          'label',
          'description',
          'icon',
          'validation',
        ],
        properties: {
          value: stringTypePattern('AMEX'),
          type: stringTypePattern('CARD'),
          label: stringTypePattern('American Express'),
          description: stringType,
          icon: stringType,
          validation: objectType,
        },
      }
      expect(body).toMatchSchema(paymentSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => AMEX => validation',
    () => {
      const body = response.body[2].validation
      const validationSchema = {
        title: 'American Express payment Validation Schema',
        type: 'object',
        required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
        properties: {
          cardNumber: objectType,
          cvv: objectType,
          expiryDate: stringType,
          startDate: {
            type: 'null',
          },
        },
      }
      expect(body).toMatchSchema(validationSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => AMEX => validation => cardNumber',
    () => {
      const body = response.body[2].validation.cardNumber
      const cardNumberSchema = {
        title: 'American Express payment card number Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(15),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cardNumberSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => AMEX => validation => cvv',
    () => {
      const body = response.body[2].validation.cardNumber
      const cvvSchema = {
        title: 'American Express payment cvv Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(4),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cvvSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => ACCNT',
    () => {
      const body = response.body[6]
      const paymentSchema = {
        title: 'Account payment Schema',
        type: 'object',
        required: [
          'value',
          'type',
          'label',
          'description',
          'icon',
          'validation',
        ],
        properties: {
          value: stringTypePattern('ACCNT'),
          type: stringTypePattern('OTHER_CARD'),
          label: stringTypePattern('Account Card'),
          description: stringType,
          icon: stringType,
          validation: objectType,
        },
      }
      expect(body).toMatchSchema(paymentSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => ACCNT => validation',
    () => {
      const body = response.body[6].validation
      const validationSchema = {
        title: 'Account payment Validation Schema',
        type: 'object',
        required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
        properties: {
          cardNumber: objectType,
          cvv: objectType,
          expiryDate: stringType,
          startDate: {
            type: 'null',
          },
        },
      }
      expect(body).toMatchSchema(validationSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => ACCNT => validation => cardNumber',
    () => {
      const body = response.body[6].validation.cardNumber
      const cardNumberSchema = {
        title: 'Account payment card number Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(16),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cardNumberSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => ACCNT => validation => cvv',
    () => {
      const body = response.body[6].validation.cardNumber
      const cvvSchema = {
        title: 'Account payment cvv Schema',
        type: 'object',
        required: ['length', 'message'],
        properties: {
          length: numberTypePattern(3),
          message: stringType,
        },
      }
      expect(body).toMatchSchema(cvvSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => APPLEPAY',
    () => {
      const body = response.body[4]
      const paymentSchema = {
        title: 'ApplePay payment Schema',
        type: 'object',
        required: ['value', 'type', 'label', 'description', 'icon'],
        properties: {
          value: stringTypePattern('APPLE'),
          type: stringTypePattern('OTHER'),
          label: stringTypePattern('Apple Pay'),
          description: stringType,
          icon: stringType,
        },
      }
      expect(body).toMatchSchema(paymentSchema)
    },
    30000
  )

  it(
    'Payments Schema in the UK => PAYPAL',
    () => {
      const body = response.body[5]
      const paymentSchema = {
        title: 'PayPal payment Schema',
        type: 'object',
        required: ['value', 'type', 'label', 'description', 'icon'],
        properties: {
          value: stringTypePattern('PYPAL'),
          type: stringTypePattern('OTHER'),
          label: stringTypePattern('PayPal'),
          description: stringType,
          icon: stringType,
        },
      }
      expect(body).toMatchSchema(paymentSchema)
    },
    30000
  )

  describe('It should return Payments available in the Sri Lanka', () => {
    let response
    beforeAll(async () => {
      response = await superagent
        .get(eps.payments.payment.path)
        .query(SriLankaPaymentQuery)
        .set(headers)
    }, 30000)

    it(
      'Payments Schema in the UK => VISA',
      () => {
        const body = response.body[0]
        const paymentSchema = {
          title: 'Visa payment Schema',
          type: 'object',
          required: [
            'value',
            'type',
            'label',
            'description',
            'icon',
            'validation',
          ],
          properties: {
            value: stringTypePattern('VISA'),
            type: stringTypePattern('CARD'),
            label: stringTypePattern('Visa'),
            description: stringType,
            icon: stringType,
            validation: objectType,
          },
        }
        expect(body).toMatchSchema(paymentSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => VISA => validation',
      () => {
        const body = response.body[0].validation
        const validationSchema = {
          title: 'Visa payment Validation Schema',
          type: 'object',
          required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
          properties: {
            cardNumber: objectType,
            cvv: objectType,
            expiryDate: stringType,
            startDate: {
              type: 'null',
            },
          },
        }
        expect(body).toMatchSchema(validationSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => VISA => validation => cardNumber',
      () => {
        const body = response.body[0].validation.cardNumber
        const cardNumberSchema = {
          title: 'Visa payment card number Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(16),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cardNumberSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => VISA => validation => cvv',
      () => {
        const body = response.body[0].validation.cardNumber
        const cvvSchema = {
          title: 'Visa payment cvv Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(3),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cvvSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => MASTERCARD',
      () => {
        const body = response.body[1]
        const paymentSchema = {
          title: 'Mastercard payment Schema',
          type: 'object',
          required: [
            'value',
            'type',
            'label',
            'description',
            'icon',
            'validation',
          ],
          properties: {
            value: stringTypePattern('MCARD'),
            type: stringTypePattern('CARD'),
            label: stringTypePattern('MasterCard'),
            description: stringType,
            icon: stringType,
            validation: objectType,
          },
        }
        expect(body).toMatchSchema(paymentSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => MASTERCARD => validation',
      () => {
        const body = response.body[1].validation
        const validationSchema = {
          title: 'Mastercard payment Validation Schema',
          type: 'object',
          required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
          properties: {
            cardNumber: objectType,
            cvv: objectType,
            expiryDate: stringType,
            startDate: {
              type: 'null',
            },
          },
        }
        expect(body).toMatchSchema(validationSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => MASTERCARD => validation => cardNumber',
      () => {
        const body = response.body[1].validation.cardNumber
        const cardNumberSchema = {
          title: 'Mastercard payment card number Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(16),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cardNumberSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => MASTERCARD => validation => cvv',
      () => {
        const body = response.body[1].validation.cardNumber
        const cvvSchema = {
          title: 'Mastercard payment cvv Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(3),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cvvSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => AMEX',
      () => {
        const body = response.body[2]
        const paymentSchema = {
          title: 'American Express payment Schema',
          type: 'object',
          required: [
            'value',
            'type',
            'label',
            'description',
            'icon',
            'validation',
          ],
          properties: {
            value: stringTypePattern('AMEX'),
            type: stringTypePattern('CARD'),
            label: stringTypePattern('American Express'),
            description: stringType,
            icon: stringType,
            validation: objectType,
          },
        }
        expect(body).toMatchSchema(paymentSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => AMEX => validation',
      () => {
        const body = response.body[2].validation
        const validationSchema = {
          title: 'American Express payment Validation Schema',
          type: 'object',
          required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
          properties: {
            cardNumber: objectType,
            cvv: objectType,
            expiryDate: stringType,
            startDate: {
              type: 'null',
            },
          },
        }
        expect(body).toMatchSchema(validationSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => AMEX => validation => cardNumber',
      () => {
        const body = response.body[2].validation.cardNumber
        const cardNumberSchema = {
          title: 'American Express payment card number Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(15),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cardNumberSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => AMEX => validation => cvv',
      () => {
        const body = response.body[2].validation.cardNumber
        const cvvSchema = {
          title: 'American Express payment cvv Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(4),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cvvSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => ACCNT',
      () => {
        const body = response.body[6]
        const paymentSchema = {
          title: 'Account payment Schema',
          type: 'object',
          required: [
            'value',
            'type',
            'label',
            'description',
            'icon',
            'validation',
          ],
          properties: {
            value: stringTypePattern('ACCNT'),
            type: stringTypePattern('OTHER_CARD'),
            label: stringTypePattern('Account Card'),
            description: stringType,
            icon: stringType,
            validation: objectType,
          },
        }
        expect(body).toMatchSchema(paymentSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => ACCNT => validation',
      () => {
        const body = response.body[6].validation
        const validationSchema = {
          title: 'Account payment Validation Schema',
          type: 'object',
          required: ['cardNumber', 'cvv', 'expiryDate', 'startDate'],
          properties: {
            cardNumber: objectType,
            cvv: objectType,
            expiryDate: stringType,
            startDate: {
              type: 'null',
            },
          },
        }
        expect(body).toMatchSchema(validationSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => ACCNT => validation => cardNumber',
      () => {
        const body = response.body[6].validation.cardNumber
        const cardNumberSchema = {
          title: 'Account payment card number Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(16),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cardNumberSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => ACCNT => validation => cvv',
      () => {
        const body = response.body[6].validation.cardNumber
        const cvvSchema = {
          title: 'Account payment cvv Schema',
          type: 'object',
          required: ['length', 'message'],
          properties: {
            length: numberTypePattern(3),
            message: stringType,
          },
        }
        expect(body).toMatchSchema(cvvSchema)
      },
      30000
    )

    it(
      'Payments Schema in the UK => PAYPAL',
      () => {
        const body = response.body[5]
        const paymentSchema = {
          title: 'PayPal payment Schema',
          type: 'object',
          required: ['value', 'type', 'label', 'description', 'icon'],
          properties: {
            value: stringTypePattern('PYPAL'),
            type: stringTypePattern('OTHER'),
            label: stringTypePattern('PayPal'),
            description: stringType,
            icon: stringType,
          },
        }
        expect(body).toMatchSchema(paymentSchema)
      },
      30000
    )
  })
})
