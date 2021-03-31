import R from 'ramda'

describe('Forms Reducers', () => {
  const reducerStub = '👍'
  let createFormReducer

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    jest.doMock('../createFormReducer')
    jest.doMock('redux')
    const combineReducers = require('redux').combineReducers
    combineReducers.mockImplementation(R.identity)
    createFormReducer = require('../createFormReducer').default
  })

  const assertReducer = (expectedName, expectedFields) => {
    it(`${expectedName} is configured correctly`, () => {
      createFormReducer.mockImplementation((name, fields) => {
        if (name === expectedName && R.equals(fields, expectedFields)) {
          return reducerStub
        }
      })
      const reducers = require('../index.js').default
      expect(reducers[expectedName]).toBe(reducerStub)
    })
  }

  assertReducer('changePassword', ['email', 'oldPassword', 'newPassword'])

  assertReducer('cmsForm', [])

  assertReducer('customerDetails', [
    'title',
    'firstName',
    'lastName',
    'telephone',
    'country',
    'postcode',
    'address1',
    'address2',
    'city',
    'state',
    'type',
    'cardNumber',
    'expiryMonth',
    'expiryYear',
  ])

  assertReducer('customerShortProfile', [
    'title',
    'firstName',
    'lastName',
    'email',
  ])

  assertReducer('forgetPassword', ['email'])

  assertReducer('login', ['email', 'password', 'rememberMe'])

  assertReducer('notifyStock', ['firstName', 'surname', 'email', 'state'])

  assertReducer('promotionCode', ['promotionCode'])

  assertReducer('register', [
    'email',
    'password',
    'subscribe',
    'rememberMeRegister',
  ])

  assertReducer('resetPassword', ['email', 'password'])

  assertReducer('search', ['searchTerm'])

  assertReducer('storeDelivery', ['postcode'])

  assertReducer('userLocator', ['userLocation'])

  assertReducer('giftCard', ['giftCardNumber', 'pin'])
})
