import Connected, { WrappedPaymentOption } from '../PaymentOption'
import renderComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import { isMobile } from '../../../../selectors/viewportSelectors'

jest.mock('../../../../selectors/viewportSelectors')

const baseProps = {
  label: 'Visa',
  value: 'VISA',
  isMobile: false,
  description: 'description...',
  icons: [],
  isChecked: false,
  onChange: jest.fn(),
}

function render(props = baseProps) {
  const component = renderComponentHelper(
    WrappedPaymentOption,
    {},
    { mockBrowserEventListening: false }
  )(props)
  return {
    ...component,
    icons: component.wrapper.find('.PaymentOption-icons'),
    label: component.wrapper.find('.PaymentOption-label'),
    radioButton: component.wrapper.find('.RadioButton-input'),
    description: component.wrapper.find('.PaymentOption-description'),
  }
}

describe('<PaymentOption/>', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('@renders', () => {
    describe('the label', () => {
      it('should be the value of the label prop', () => {
        expect(render().label.text()).toBe(baseProps.label)
      })
    })

    describe('the description', () => {
      it('should only be rendered if the description prop has been set', () => {
        const props = { ...baseProps, description: '' }
        expect(render(props).description).toHaveLength(0)
      })

      it('should be the value of the description prop', () => {
        expect(render().description.text()).toBe(baseProps.description)
      })
    })

    describe('icons', () => {
      it('should not be rendered if no icons have specified', () => {
        expect(render().icons).toHaveLength(0)
      })

      it('should only be rendered if icons have been supplied', () => {
        const props = { ...baseProps, icons: ['foo'] }
        expect(render(props).icons).toHaveLength(1)
      })

      it('should display the icons that have been specified', () => {
        const props = { ...baseProps, icons: ['foo.png', 'bar.png'] }
        const icons = render(props)
          .icons.find('.PaymentOption-icon')
          .map((icon) => icon.prop('src'))
        const expectedIcons = [
          '/assets/common/images/foo.png',
          '/assets/common/images/bar.png',
        ]
        expect(icons).toEqual(expectedIcons)
      })
    })

    describe('the radio button', () => {
      it('should be checked if isChecked is true', () => {
        const props = { ...baseProps, isChecked: true }
        expect(render(props).radioButton.prop('checked')).toBe(true)
      })

      it('should be unchecked if isChecked is false', () => {
        expect(render().radioButton.prop('checked')).toBe(false)
      })
    })
  })

  describe('@events', () => {
    describe('the change event', () => {
      it('should call the onChange prop function', () => {
        render().radioButton.prop('onChange')('foo')
        expect(baseProps.onChange).toHaveBeenCalledTimes(1)
        expect(baseProps.onChange).toHaveBeenCalledWith('foo')
      })
    })
  })

  describe('@connected', () => {
    it('wraps the PaymentOption component', () => {
      expect(Connected.WrappedComponent).toBe(WrappedPaymentOption)
    })

    describe('mapping state to props', () => {
      describe('prop: isMobile', () => {
        it('is correctly mapped from state', () => {
          isMobile.mockReturnValue('foo')
          const props = renderConnectedComponentProps(Connected)
          expect(props.isMobile).toBe('foo')
        })
      })
    })
  })
})
