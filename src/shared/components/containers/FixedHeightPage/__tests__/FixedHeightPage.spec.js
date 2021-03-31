import React from 'react'

import testComponentHelper from 'test/unit/helpers/test-component'

import FixedHeightPage from '../FixedHeightPage'

describe('<FixedHeightPage />', () => {
  const renderComponent = testComponentHelper(FixedHeightPage)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })

    it('should render `children`', () => {
      const { getTree } = renderComponent({
        children: <p>Child</p>,
      })
      expect(getTree()).toMatchSnapshot()
    })
  })
})
