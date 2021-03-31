import testComponentHelper from 'test/unit/helpers/test-component'
import { WrappedForgetPassword as ForgetPassword } from '../ForgetPassword'
import Accordion from '../../../common/Accordion/Accordion'

const renderComponent = testComponentHelper(ForgetPassword)

describe('<ForgetPasswordForm />', () => {
  const props = {}

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@render', () => {
    it('renders', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('renders with the provided "className"', () => {
      const { wrapper } = renderComponent({ ...props, className: 'foo' })
      expect(wrapper.prop('className')).toBe('ForgetPassword foo')
    })
  })

  describe('@lifecycle', () => {
    describe('constructor', () => {
      it('should set initial state for accordion to be contracted', () => {
        const { instance } = renderComponent(props)
        expect(instance.state.isAccordionExpanded).toBe(false)
      })
    })
  })

  describe('@events', () => {
    describe('Accordion', () => {
      describe('onAccordionToggle', () => {
        it('should toggle instance state of accordion', () => {
          const { instance, wrapper } = renderComponent(props)
          wrapper.find(Accordion).prop('onAccordionToggle')()
          expect(instance.state.isAccordionExpanded).toBe(true)
          wrapper.find(Accordion).prop('onAccordionToggle')()
          expect(instance.state.isAccordionExpanded).toBe(false)
        })
      })
    })
  })

  describe('clicking accordion', () => {
    function createDomElements({ className } = {}) {
      const containerEl = document.createElement('section')
      containerEl.getBoundingClientRect = () => ({
        top: 100,
        height: 20,
      })
      const accordionHeader = document.createElement('div')
      accordionHeader.className = className || Accordion.headerClassName
      containerEl.appendChild(accordionHeader)
      return { containerEl, accordionHeader }
    }

    const scrollY = window.scrollY
    beforeEach(() => {
      jest.spyOn(window, 'scroll').mockImplementation(() => {})
      window.scrollY = 100
    })

    afterAll(() => {
      window.scrollY = scrollY
    })

    it('scrolls the user to the forget password section when accordion is opening', () => {
      const { containerEl, accordionHeader } = createDomElements()
      const { instance, wrapper } = renderComponent(props)
      instance.scrollRef = containerEl

      wrapper
        .find('.ForgetPassword')
        .simulate('click', { target: accordionHeader })

      expect(window.scroll).toHaveBeenCalledWith({
        behavior: 'smooth',
        top: 180,
      })
    })

    it('does not scroll the page if the accordion is closing', () => {
      const { containerEl, accordionHeader } = createDomElements()
      const { instance, wrapper } = renderComponent(props)
      instance.scrollRef = containerEl

      instance.setState({ isAccordionExpanded: true })
      wrapper
        .find('.ForgetPassword')
        .simulate('click', { target: accordionHeader })

      expect(window.scroll).not.toHaveBeenCalled()
    })

    it('does not scroll the page if not clicked in accordion header', () => {
      const { containerEl } = createDomElements()
      const { instance, wrapper } = renderComponent(props)
      const someContent = document.createElement('div')
      containerEl.appendChild(someContent)
      instance.scrollRef = containerEl

      instance.setState({ isAccordionExpanded: true })
      wrapper.find('.ForgetPassword').simulate('click', { target: someContent })

      expect(window.scroll).not.toHaveBeenCalled()
    })

    it('should throw an error if the Accordion.headerClassName does not exist', () => {
      const { containerEl, accordionHeader } = createDomElements({
        className: 'Foo',
      })
      const { instance, wrapper } = renderComponent(props)
      instance.scrollRef = containerEl

      expect(() =>
        wrapper
          .find('.ForgetPassword')
          .simulate('click', { target: accordionHeader })
      ).toThrow()
    })
  })
})
