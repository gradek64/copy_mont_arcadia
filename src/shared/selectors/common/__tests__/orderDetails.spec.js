import { getOrderDetails } from '../orderDetails'
import {
  mockedState,
  mockedForm,
  mockedAccount,
  mockedCheckout,
} from '../../../../../test/mocks/paymentMethodsMocks'

const snapshot = (action) => expect(action).toMatchSnapshot()

describe('getOrderDetails creates object containing delivery, billing and amount', () => {
  it('returns countries from site config', () => {
    snapshot(getOrderDetails(mockedState))
  })
  it('returns countries from checkout forms', () => {
    snapshot(getOrderDetails({ ...mockedState, ...mockedForm }))
  })
  it('returns countries from user account details', () => {
    snapshot(getOrderDetails({ ...mockedState, ...mockedAccount }))
  })
  it('returns countries from user account and amount from shopping bag', () => {
    snapshot(
      getOrderDetails({ ...mockedState, ...mockedAccount, ...mockedCheckout })
    )
  })
})
