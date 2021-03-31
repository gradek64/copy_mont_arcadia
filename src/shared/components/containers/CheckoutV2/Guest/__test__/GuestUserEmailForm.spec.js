import {
  buildComponentRender,
  withStore,
  mountRender,
} from 'test/unit/helpers/test-component'
import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'
import { compose } from 'ramda'
import GuestUserEmailForm from '../GuestUserEmailForm'
import * as userAgent from '../../../../../lib/user-agent'
import Input from '../../../../common/FormComponents/Input/Input'
import Checkbox from '../../../../common/FormComponents/Checkbox/Checkbox'

jest.spyOn(userAgent, 'isIOS')
userAgent.isIOS.mockImplementation(() => false)

describe('<GuestUserEmailForm />', () => {
  const initialState = {
    forms: {
      checkout: {
        guestUser: {
          fields: {
            email: {
              value: '',
            },
            signUpGuest: {
              value: '',
            },
          },
        },
      },
    },
  }

  const store = mockStoreCreator(initialState)
  const state = store.getState()

  const renderComponent = buildComponentRender(
    compose(
      mountRender,
      withStore(state)
    ),
    GuestUserEmailForm
  )

  describe('@render', () => {
    const { getTree, wrapper } = renderComponent({})

    it('default render', () => {
      expect(getTree()).toMatchSnapshot()
    })

    it('renders the email field', () => {
      expect(wrapper.find(Input).exists()).toBe(true)
      expect(wrapper.find(Input).props().name).toBe('email')
    })

    it('renders the signUpGuest checkbox', () => {
      expect(wrapper.find(Checkbox).exists()).toBe(true)
      expect(wrapper.find(Checkbox).props().name).toBe('signUpGuest')
    })
  })

  describe('email input behaviour', () => {
    it('should change the state on change', async () => {
      const { wrapper, store } = renderComponent({})
      const input = wrapper.find(Input).find('input')

      await input.simulate('change', { target: { value: 'myemail@gmail.com' } })

      expect(store.getActions()).toEqual([
        {
          field: 'email',
          formName: 'guestUser',
          isDirty: true,
          key: null,
          type: 'SET_FORM_FIELD',
          value: 'myemail@gmail.com',
        },
      ])
    })
  })

  describe('checkbox behaviour', () => {
    it('should change the state to checked', async () => {
      const { wrapper, store } = renderComponent({})
      const checkboxInput = wrapper.find(Checkbox).find('input')

      await checkboxInput.simulate('change', { target: { checked: true } })

      expect(store.getActions()).toEqual([
        {
          field: 'signUpGuest',
          formName: 'guestUser',
          isDirty: true,
          key: null,
          type: 'SET_FORM_FIELD',
          value: true,
        },
      ])
    })

    it('should change the state to unchecked', async () => {
      const { wrapper, store } = renderComponent({})
      const checkboxInput = wrapper.find(Checkbox).find('input')

      await checkboxInput.simulate('change', { target: { checked: false } })

      expect(store.getActions()).toEqual([
        {
          field: 'signUpGuest',
          formName: 'guestUser',
          isDirty: true,
          key: null,
          type: 'SET_FORM_FIELD',
          value: false,
        },
      ])
    })
  })
})
