import {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'
import CustomerServiceNumber from '../CustomerServiceNumber'
import { mockStoreCreator } from '../../../../../../test/unit/helpers/get-redux-mock-store'
import { compose } from 'ramda'
import { withStore } from '../../../../../../test/unit/helpers/test-component'
import { numbers } from '../../../../constants/customerCareNumbers'

describe('<CustomerServiceNumber />', () => {
  const initialState = {
    config: {
      brandName: 'topshop',
      brandCode: 'ts',
      region: 'United Kingdom',
    },
    viewport: {
      media: 'desktop',
    },
  }

  const initialProps = {
    brandCode: 'ts',
    myReturns: false,
  }

  describe('@renders', () => {
    const store = mockStoreCreator(initialState)
    const state = store.getState()
    const renderComponent = buildComponentRender(
      compose(
        mountRender,
        withStore(state)
      ),
      CustomerServiceNumber
    )

    it('should render the CustomerServiceNumber component', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('CustomerServiceNumber').length).toBe(1)
    })
    it('should render the correct number for topshop uk given the topshop brandcode', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('CustomerServiceNumber').text()).toBe(
        `(+44)${numbers[initialProps.brandCode].uk}`
      )
    })
  })
})
