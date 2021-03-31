import testComponentHelper from 'test/unit/helpers/test-component'

import Button from '../../../Button/Button'
import InputError from '../../InputError/InputError'
import FormButton from '../Button'

describe('FormComponents', () => {
  describe('<Button />', () => {
    const renderComponent = testComponentHelper(FormButton)

    it('should render button wrapped', () => {
      const props = {
        name: 'arcadia',
        isDisabled: true,
        type: 'submit',
        onClick: jest.fn(),
      }
      const { wrapper } = renderComponent({
        ...props,
        children: 'Click Here',
      })

      expect(wrapper.find('div').props().className).toBe(
        'ButtonContainer ButtonContainer-arcadia FormComponent-arcadia'
      )
      expect(
        wrapper.find(Button).find({
          isDisabled: props.isDisabled,
          type: props.type,
          clickHandler: props.onClick,
        })
      ).toHaveLength(1)
      expect(wrapper.find(InputError)).toHaveLength(0)
    })

    it('should pass and render custom classNames', () => {
      const props = { name: 'submitButton', customClass: 'arcadia-custom' }
      const { wrapper } = renderComponent({
        ...props,
        children: 'Click Here',
      })

      expect(wrapper.find('div').props().className).toBe(
        'ButtonContainer ButtonContainer-submitButton FormComponent-submitButton arcadia-custom'
      )
    })

    it('should display <InputError />', () => {
      const props = {
        name: 'submit',
        error: 'This is an error message',
        touched: true,
      }
      const { wrapper } = renderComponent({
        ...props,
        children: 'Click Here',
      })

      expect(
        wrapper.find(InputError).find({
          className: 'Input-validationMessage',
          name: 'submit',
          children: props.error,
        })
      ).toHaveLength(1)
    })
  })
})
