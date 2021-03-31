import nock from 'nock'
import { serverSideRenderer } from '../server-side-renderer'
import { getAllPaymentMethods } from '../../../shared/actions/common/paymentMethodsActions'

jest.mock('../../../shared/actions/common/paymentMethodsActions')
jest.mock('react-helmet', () => {
  const { Component } = require('react')
  return class MockedHelmet extends Component {
    static rewind = () => ({ title: '', meta: '', link: '' })
    rewind() {}
    render() {
      return null
    }
  }
})

process.env.USE_NEW_HANDLER = true

const BASE_REQUEST = {
  info: {
    hostname: 'local.m.topshop.com',
  },
  url: {
    pathname: '/',
    query: {},
  },
  headers: {
    cookie: '',
  },
  state: {},
}

const response = {
  code: jest.fn(() => response),
}
const reply = jest.fn(() => response)
reply.redirect = jest.fn()
reply.view = jest.fn(() => reply)
reply.state = jest.fn(() => reply)
reply.code = jest.fn(() => reply)

describe('/delivery-payment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches payment methods only once', async () => {
    nock('http://localhost:3000')
      .get('/api/account')
      .reply(200, {})

    nock('http://localhost:3000')
      .get('/api/checkout/order_summary')
      .reply(200, {
        basket: {
          products: [],
          discounts: [],
        },
        deliveryLocations: [
          {
            selected: true,
            deliveryLocationType: 'HOME',
            deliveryMethods: [],
            savedAddresses: [],
          },
        ],
        deliveryDetails: {
          addressDetailsId: 663068,
        },
      })

    nock('http://localhost:3000')
      .get('/api/site-options')
      .reply(200, {})

    await serverSideRenderer(
      {
        ...BASE_REQUEST,
        url: {
          ...BASE_REQUEST.url,
          pathname: '/checkout/delivery-payment',
        },
        state: {
          authenticated: 'yes',
          bagCount: 3,
        },
      },
      reply
    )

    expect(getAllPaymentMethods).toHaveBeenCalledTimes(1)
    expect(reply.code).toHaveBeenCalledWith(200)
  })
})
