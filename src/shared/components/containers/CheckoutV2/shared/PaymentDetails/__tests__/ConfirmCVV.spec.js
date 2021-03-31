import {
  setAndValidateFormField,
  touchedFormField,
} from '../../../../../../actions/common/formActions'
import { showModal as showModalActionCreator } from '../../../../../../actions/common/modalActions'

import { mapStateToProps, mapDispatchToProps } from '../ConfirmCVV'

jest.mock('../../../../../../actions/common/formActions')
jest.mock('../../../../../../actions/common/modalActions')

describe('<ConfirmCVV/>', () => {
  afterAll(() => {
    jest.unmock('../../../../../../actions/common/formActions')
    jest.unmock('../../../../../../actions/common/modalActions')
  })

  describe('mapStateToProps', () => {
    const createFormsState = (value) => ({
      forms: {
        checkout: {
          billingCardDetails: {
            fields: {
              cvv: {
                value,
                isTouched: true,
              },
            },
          },
        },
      },
    })

    it('should return a default for `field` if not in the state', () => {
      const { field } = mapStateToProps()
      expect(field).toEqual({
        value: '',
        isTouched: false,
      })
    })

    it('should return correct `field` prop', () => {
      const { field } = mapStateToProps({ ...createFormsState('123') })
      expect(field).toEqual({
        value: '123',
        isTouched: true,
      })
    })

    it('should return an empty string for `error` prop by default', () => {
      const { error } = mapStateToProps()
      expect(error).toBe('')
    })

    it('should return correct `error` prop', () => {
      const { error } = mapStateToProps({
        ...createFormsState('12'),
        account: {
          user: {
            creditCard: {
              type: 'VISA',
            },
          },
        },
      })
      expect(error).toBeDefined()
    })

    it('should set `isMobile` to `true` if mobile viewport', () => {
      const { isMobile } = mapStateToProps({
        viewport: {
          media: 'mobile',
        },
      })
      expect(isMobile).toBe(true)
    })
  })

  describe('mapDispatchToProps', () => {
    it('should return correct `setField` function', () => {
      const setFormFieldAction = {}
      setAndValidateFormField.mockImplementation(() => setFormFieldAction)
      const dispatchMock = jest.fn()
      const { setField } = mapDispatchToProps(dispatchMock)
      setField(['require'])('cvv')({ target: { value: '123' } })
      expect(setAndValidateFormField).toHaveBeenCalledWith(
        'billingCardDetails',
        'cvv',
        '123',
        ['require']
      )
      expect(dispatchMock).toHaveBeenCalledWith(setFormFieldAction)
    })

    it('should return correct `touchedField` function', () => {
      const touchedFormFieldAction = {}
      touchedFormField.mockImplementation(() => touchedFormFieldAction)
      const dispatchMock = jest.fn()
      const { touchedField } = mapDispatchToProps(dispatchMock)
      touchedField('cvv')()
      expect(touchedFormField).toHaveBeenCalledWith('billingCardDetails', 'cvv')
      expect(dispatchMock).toHaveBeenCalledWith(touchedFormFieldAction)
    })

    it('should return correct `setModal` function', () => {
      const showModalAction = {}
      showModalActionCreator.mockImplementation(() => showModalAction)
      const dispatchMock = jest.fn()
      const { showModal } = mapDispatchToProps(dispatchMock)
      showModal('argOne', 'argTwo')
      expect(showModalActionCreator).toHaveBeenCalledWith('argOne', 'argTwo')
      expect(dispatchMock).toHaveBeenCalledWith(showModalAction)
    })
  })
})
