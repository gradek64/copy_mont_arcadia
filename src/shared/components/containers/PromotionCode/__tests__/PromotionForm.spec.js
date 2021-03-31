import deepFreeze from 'deep-freeze'
import testComponentHelper from 'test/unit/helpers/test-component'
import PromotionForm from '../PromotionForm'
import ButtonLoader from '../../../common/ButtonLoader/ButtonLoader'

const renderComponent = testComponentHelper(PromotionForm)

const initialProps = deepFreeze({
  promotionForm: {
    fields: {
      promotionCode: {
        value: 'TEST',
        isDirty: false,
        isTouched: false,
      },
    },
  },
  show: true,
  setField: () => {},
  setFormMeta: () => {},
  setFormMessage: () => {},
  resetForm: () => {},
  touchedField: () => {},
})

describe('<PromotionForm />', () => {
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('disables the submit button when the input field is empty', () => {
      const props = {
        ...initialProps,
        promotionForm: {
          fields: {
            promotionCode: {
              value: '',
            },
          },
        },
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(ButtonLoader).props().isDisabled).toBe(true)
    })
  })
})
