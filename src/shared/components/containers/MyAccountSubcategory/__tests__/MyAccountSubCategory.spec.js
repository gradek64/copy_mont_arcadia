import renderComponentHelper from 'test/unit/helpers/test-component'
import { getAllPaymentMethods } from '../../../../actions/common/paymentMethodsActions'
import React from 'react'

jest.mock('../../../../actions/common/accountActions.js', () => ({
  getAccount: jest.fn(),
}))

jest.mock('../../../../actions/common/paymentMethodsActions', () => ({
  getAllPaymentMethods: jest.fn(),
}))

import MyAccountSubcategory, { mapStateToProps } from '../MyAccountSubcategory'
import * as accountActions from '../../../../actions/common/accountActions'

describe('<MyAccountSubcategory />', () => {
  const getAccountSpy = jest.spyOn(accountActions, 'getAccount')
  const renderComponent = renderComponentHelper(
    MyAccountSubcategory.WrappedComponent
  )
  const props = {
    children: <p>foo</p>,
    user: {},
    getAccount: getAccountSpy,
    getAllPaymentMethods,
    visited: [],
    paymentMethods: [],
  }

  beforeEach(() => {
    jest.resetAllMocks()
    getAccountSpy.mockReset()
    getAccountSpy.mockRestore()
  })

  describe('@render', () => {
    it('render default', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@needs', () => {
    it('should have getAccount and getAllPaymentMethods in the needs array', () => {
      expect(MyAccountSubcategory.needs).toEqual([accountActions.getAccount])
    })
  })

  describe('@mapStateToProps', () => {
    let state
    beforeEach(() => {
      state = {
        account: {
          user: 'someUser',
        },
        routing: {
          visited: true,
        },
        paymentMethods: [{ value: 'VISA' }],
      }
    })

    it('expect mapStateToProps to match snapshot', () => {
      expect(mapStateToProps(state)).toMatchSnapshot()
    })
  })

  describe('@lifecycle methods', () => {
    describe('@componentDidMount', () => {
      it('should NOT call getAccount method if visited length < 1', () => {
        const { instance } = renderComponent(props)
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
      })

      it('should call getAccount method if visited length > 1 and user NOT logged in', () => {
        const { instance } = renderComponent({
          ...props,
          visited: ['/abc', 'cde'],
        })
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(getAccountSpy).toHaveBeenCalledTimes(1)
      })

      it('should NOT call getAccount method if visited length > 1 BUT user already logged in', () => {
        const { instance } = renderComponent({
          ...props,
          user: { exists: true },
          visited: ['/abc', 'cde'],
        })
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(getAccountSpy).toHaveBeenCalledTimes(0)
      })
    })
  })
})
