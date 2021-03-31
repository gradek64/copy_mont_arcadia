import React from 'react'

import testComponentHelper from 'test/unit/helpers/test-component'

import ProductDescription from '../ProductDescription'
import ProductDescriptionSeeMore from '../../ProductDescriptionSeeMore/ProductDescriptionSeeMore'

describe('<ProductDescription/>', () => {
  const renderComponent = testComponentHelper(ProductDescription)

  describe('@renders', () => {
    it('should render in default state', () => {
      const description = 'These TALL black Leigh jeans are a classic fit'
      const className = 'ProductDescription--modifier'
      const { wrapper } = renderComponent({
        description,
        className,
      })
      expect(
        wrapper
          .find('.ProductDescription-content')
          .prop('dangerouslySetInnerHTML')
      ).toEqual({
        __html: description,
      })
      expect(wrapper.find(`.${className}`)).toHaveLength(1)
      expect(
        wrapper.find('.ProductDescription-productDetailText').hasClass('hidden')
      ).toBeFalsy()
      expect(wrapper.find(ProductDescriptionSeeMore)).toHaveLength(1)
    })

    it('should decode html entities in ‘description’', () => {
      const description =
        'These &lt;strong&gt;TALL&lt;/strong&gt; black Leigh jeans are a classic fit'
      const { wrapper } = renderComponent({
        description,
      })
      expect(
        wrapper
          .find('.ProductDescription-content')
          .prop('dangerouslySetInnerHTML')
      ).toEqual({
        __html:
          'These <strong>TALL</strong> black Leigh jeans are a classic fit',
      })
    })

    it('should render children', () => {
      const { wrapper } = renderComponent({
        children: <div className="child" />,
        description: 'Some description',
      })
      expect(wrapper.find('.child')).toHaveLength(1)
    })
  })
})
