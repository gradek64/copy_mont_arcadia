import testComponentHelper from 'test/unit/helpers/test-component'
import { clone } from 'ramda'

import RadioButton from '../RadioButton'

const initalProps = {
  checked: true,
  label: 'PLEASE SELECT ME',
  name: 'RadioButtonButton',
  onChange: jest.fn(),
  value: 'test-value',
}

describe('<RadioButton />', () => {
  const renderComponent = testComponentHelper(RadioButton)
  const renderComponentWithClone = (props) => renderComponent(clone(props))

  beforeEach(jest.resetAllMocks)

  describe('@render', () => {
    it('with text', () => {
      const { wrapper } = renderComponentWithClone(initalProps)
      expect(wrapper.find('.RadioButton').text()).toBe(initalProps.label)
    })

    it('with name', () => {
      const { wrapper } = renderComponentWithClone(initalProps)
      expect(wrapper.find('.RadioButton-input').props().checked).toBe(
        initalProps.checked
      )
      expect(wrapper.find('.RadioButton-input').props().name).toBe(
        initalProps.name
      )
    })

    it('without name', () => {
      const { wrapper } = renderComponentWithClone({
        ...initalProps,
        name: undefined,
      })
      expect(wrapper.find('label').prop('className')).not.toEqual(
        expect.stringContaining('FormComponent-')
      )
    })

    it('with disable', () => {
      const { wrapper } = renderComponentWithClone({
        ...initalProps,
        isDisabled: true,
      })
      expect(wrapper.find('label').hasClass('is-disabled')).toBeTruthy()
    })

    it('with full width', () => {
      const { wrapper } = renderComponentWithClone({
        ...initalProps,
        fullWidth: true,
      })
      expect(
        wrapper.find('label').hasClass('RadioButton--fullWidth')
      ).toBeTruthy()
    })

    it('without margin', () => {
      const { wrapper } = renderComponentWithClone({
        ...initalProps,
        noMargin: true,
      })
      expect(
        wrapper.find('label').hasClass('RadioButton--noMargin')
      ).toBeTruthy()
    })
  })

  describe('@event', () => {
    it('triggers setField if changed', () => {
      const e = {
        target: {
          checked: false,
        },
      }
      const { wrapper } = renderComponentWithClone(initalProps)

      wrapper.find('.RadioButton-input').simulate('change', e)
      expect(initalProps.onChange).toHaveBeenCalledTimes(1)
      expect(initalProps.onChange).toHaveBeenCalledWith(e)
    })
  })
})
