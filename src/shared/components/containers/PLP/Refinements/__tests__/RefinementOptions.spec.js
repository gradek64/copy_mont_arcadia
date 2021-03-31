import testComponentHelper from 'test/unit/helpers/test-component'
import RefinementOptions from '../RefinementOptions'

import ValueOption from '../OptionTypes/ValueOption'

describe('<RefinementOptions/>', () => {
  const renderComponent = testComponentHelper(RefinementOptions)
  const defaultProps = {
    isMobile: false,
    onChange: jest.fn(),
    label: 'price',
    hidden: false,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
    })
    it('with type and label', () => {
      expect(
        renderComponent({
          ...defaultProps,
          type: 'VALUE',
          label: 'Colour',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with options', () => {
      const options = [{ label: 'colour', count: 1, value: 'black' }]
      expect(
        renderComponent({
          ...defaultProps,
          type: 'VALUE',
          label: 'Colour',
          options,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with onChange function', () => {
      expect(
        renderComponent({
          ...defaultProps,
          onChange: jest.fn(),
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with className', () => {
      expect(
        renderComponent({
          ...defaultProps,
          className: 'simple-classname',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with `RANGE` type', () => {
      expect(
        renderComponent({
          ...defaultProps,
          type: 'RANGE',
          label: 'Price',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with `RATING` type', () => {
      expect(
        renderComponent({
          ...defaultProps,
          type: 'RATING',
          label: 'Rating',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with `SIZE` type', () => {
      expect(
        renderComponent({
          ...defaultProps,
          type: 'SIZE',
          label: 'Size',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with correct short label and SIZE type', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        type: 'SIZE',
        options: [{ label: 'Size' }],
      })
      expect(wrapper.find(ValueOption)).toHaveLength(1)
      expect(wrapper.find(ValueOption).prop('options')).toEqual([
        { label: 'SIZE' },
      ])
    })
    it('with correct long label and SIZE type', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        type: 'SIZE',
        options: [{ label: 'longlabel' }],
      })
      expect(wrapper.find(ValueOption)).toHaveLength(1)
      expect(wrapper.find(ValueOption).prop('options')).toEqual([
        { label: 'Longlabel' },
      ])
    })
    it('with invalid type', () => {
      const { wrapper } = renderComponent({ ...defaultProps, type: 'Invalid' })
      expect(wrapper.find('.RefinementOptions')).toHaveLength(0)
    })

    describe('when hidden is equal to true', () => {
      it('should render only `<a/>` tags with the seoUrl as href', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          type: 'VALUE',
          options: [{ label: 'Bags', seoUrl: 'bags/anyproduct' }],
          hidden: true,
        })
        expect(wrapper.find('.RefinementOptions')).toHaveLength(1)
        expect(wrapper.html()).toEqual(
          '<div class="RefinementOptions"><a href="bags/anyproduct">Bags</a></div>'
        )
      })
    })
  })
})
