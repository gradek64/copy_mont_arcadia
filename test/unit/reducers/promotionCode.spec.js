import forms from '../../../src/shared/reducers/components/forms'

test('TOGGLE_ACCORDION should updated the form if the key is "promotionInfo"', () => {
  const state = {
    promotionCode: {
      fields: {
        promotionCode: {
          value: 'BEFORE',
          isDirty: true,
          isTouched: true,
        },
      },
      isVisible: true,
      message: {
        message: 'BEFORE MESSAGE',
        type: 'TEST',
      },
    },
  }
  const action = {
    type: 'TOGGLE_ACCORDION',
    key: 'promotionInfo',
  }

  const expected = {
    fields: {
      promotionCode: {
        value: null,
        isDirty: false,
        isTouched: false,
      },
    },
    isVisible: false,
    message: {},
  }

  expect(forms(state, action).promotionCode).toEqual(expected)
})
