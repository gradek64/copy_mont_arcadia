import React from 'react'

import testComponentHelper from 'test/unit/helpers/test-component'

import ListItemLink from '../ListItemLink'

describe('<ListItemLink />', () => {
  const renderComponent = testComponentHelper(ListItemLink)

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })

    it('should add supplied `className`', () => {
      const { wrapper } = renderComponent({
        className: 'MyClass',
      })
      expect(wrapper.find('.MyClass').exists()).toBe(true)
    })

    it('should render supplied `children`', () => {
      const { getTree } = renderComponent({
        children: <p>Child</p>,
      })
      expect(getTree()).toMatchSnapshot()
    })
  })
})
