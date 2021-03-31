import testComponentHelper, {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'
import AccountHeader from '../AccountHeader'
import { browserHistory } from 'react-router'
import React from 'react'
import { TYPE } from '../../../containers/OrderListContainer/types'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
  Link: function LinkComponent(props) {
    return <div>{props.children}</div>
  },
}))

describe('<AccountHeader />', () => {
  const renderComponent = testComponentHelper(AccountHeader)
  const initialProps = {
    link: '/example',
    label: 'Back to My Account',
    title: 'My title',
  }

  describe('@renders', () => {
    it('in default state. There is a header with a left arrow that takes the user back to My Account', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('should render with custom classNames', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        classNames: 'classyMcClassFace',
      })
      expect(wrapper.find('.classyMcClassFace').exists()).toBe(true)
    })

    it('should not display a button when not on my return', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        classNames: 'myReturnBackButton',
      })
      expect(wrapper.find('Button').length).toBe(0)
    })

    describe('Component is in `My Returns`', () => {
      const mockProps = {
        ...initialProps,
        classNames: 'myReturnBackButton',
        type: TYPE.RETURN,
        l: jest.fn().mockImplementation((val) => val),
      }

      it('should display a button with the right copy', () => {
        const renderComponent = buildComponentRender(mountRender, AccountHeader)
        const { wrapper } = renderComponent({
          ...mockProps,
        })

        expect(wrapper.find('.myReturnBackButton')).not.toBeNull()
        expect(wrapper.find('Button').length).toBe(1)
        expect(wrapper.find('Button').text()).toBe(
          'View Orders & Start A Return'
        )
      })

      it('onClick should call browserHistory to redirect to order-history', () => {
        const renderComponent = buildComponentRender(mountRender, AccountHeader)
        const { wrapper } = renderComponent({
          ...mockProps,
        })
        const button = wrapper.find('Button')
        button.simulate('click')
        expect(browserHistory.push).toHaveBeenCalled()
        expect(browserHistory.push).toHaveBeenCalledWith(
          '/my-account/order-history'
        )
      })
    })
  })
})
