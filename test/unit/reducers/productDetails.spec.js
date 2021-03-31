import configureStore from '../../../src/shared/lib/configure-store'
import * as actions from '../../../src/shared/actions/common/productsActions'
import nock from 'nock'
import { joinQuery } from '../../../src/shared/lib/query-helper'

test('emailMeStock with valid data', () => {
  const store = configureStore()
  const formData = {
    productId: 24481716,
    firstName: 'Bob',
    surname: 'Bobson',
    email: 'bob10@test.com',
    sku: 602016000957085,
    size: 8,
    quantity: 0,
  }
  const response = {
    body: {
      success: true,
      message: 'It works',
      additionalData: [],
      validationErrors: [],
      version: '1.3',
    },
  }

  nock('http://localhost:3000')
    .get(`/api/email-me-in-stock${joinQuery(formData)}`)
    .reply(200, response)

  store.dispatch(actions.emailMeStock(formData))
  const data = store.getState().forms
  expect(response.message).toEqual(data.notifyStock.state)
})
