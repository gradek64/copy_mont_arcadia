import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import TopSectionItemLayout from '../TopSectionItemLayout'

describe('<TopSectionItemLayout />', () => {
  const defaultProps = {
    lefIcon: '',
    text: '',
    rightIcon: undefined,
  }
  const renderComponent = testComponentHelper(TopSectionItemLayout)

  const TestComponent = () => <div>Something</div> // defined for testing

  describe('@renders', () => {
    it('should render the <TopSectionItemLayout /> component', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })
    it('should render the left icon', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        leftIcon: <TestComponent />,
      })
      expect(wrapper.find(TestComponent)).toHaveLength(1)
    })

    it('should render the text', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        text: 'some text',
      })
      expect(wrapper.find('.TopSectionItemLayout-textWrapper').text()).toBe(
        'some text'
      )
    })

    it('should render the right icon', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        rightIcon: <TestComponent />,
      })

      expect(wrapper.find(TestComponent)).toHaveLength(1)
    })

    it('should not render the right icon when right icon is not defined', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })

      expect(wrapper.children().length).toBe(2)
    })
  })
})
