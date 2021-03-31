import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import OOSProductDescription from '../OOSProductDescription'
import Accordion from '../../../common/Accordion/Accordion'

describe('<OOSProductDescription />', () => {
  const defaultProps = {
    description: '<p>Description</p>',
    header: 'Product Details',
  }
  const renderComponent = testComponentHelper(OOSProductDescription)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render the <Accordion />', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })

      expect(wrapper.find(Accordion)).toHaveLength(1)
    })
  })

  describe('@events', () => {
    describe('onAccordionToggle', () => {
      it('should update the expanded prop', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
        })
        expect(wrapper.find(Accordion).prop('expanded')).toBe(false)
        wrapper.find(Accordion).prop('onAccordionToggle')()
        expect(wrapper.find(Accordion).prop('expanded')).toBe(true)
      })
    })
  })
})
