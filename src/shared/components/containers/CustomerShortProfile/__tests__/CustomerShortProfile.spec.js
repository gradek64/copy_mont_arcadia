import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import generateMockFormProps from 'test/unit/helpers/form-props-helper'
import CustomerShortProfile from '../CustomerShortProfile'
import { mockStoreCreator } from '../../../../../../test/unit/helpers/get-redux-mock-store'

jest.mock('react-router', () => ({ browserHistory: { push: jest.fn() } }))
import { browserHistory } from 'react-router'

describe('<CustomerShortProfile />', () => {
  const renderComponent = testComponentHelper(
    CustomerShortProfile.WrappedComponent.WrappedComponent
  )

  const initialFormProps = {
    customerShortProfile: {
      lastName: 'Lee',
      firstName: 'Robert',
      email: 'bob2@test.com',
    },
  }

  const initialProps = {
    customerShortProfile: {
      fields: {},
    },
    user: {
      email: 'bob2@test.com',
      firstName: 'Bob',
      lastName: 'lee',
    },
    resetForm: jest.fn(),
    setFormSuccess: jest.fn(),
    setFormField: jest.fn(),
    touchedFormField: jest.fn(),
    changeShortProfileRequest: jest.fn(),
  }

  const propsWithFields = {
    ...initialProps,
    ...generateMockFormProps(initialFormProps),
  }

  describe('@decorators', () => {
    analyticsDecoratorHelper(CustomerShortProfile, 'my-details', {
      componentName: 'CustomerShortProfile',
      isAsync: false,
      redux: true,
    })
  })
  describe('@renders', () => {
    describe('mobile and desktop', () => {
      it('in default state (disabled submit button because of missing fields)', () => {
        expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
      })
      it('with filled fields (disabled submit button because of no dirty value)', () => {
        expect(renderComponent(propsWithFields).getTree()).toMatchSnapshot()
      })
      it('with enabled submit button when there is a dirty value', () => {
        const { getTree, wrapper } = renderComponent({
          ...propsWithFields,
          customerShortProfile: {
            ...propsWithFields.customerShortProfile,
            fields: {
              ...propsWithFields.customerShortProfile.fields,
              email: {
                ...propsWithFields.customerShortProfile.fields.email,
                isDirty: true,
              },
            },
          },
        })
        expect(
          getTree(wrapper.find('.CustomerShortProfile-saveChanges'))
        ).toMatchSnapshot()
      })
      it('with disabled submit button on success', () => {
        const { getTree, wrapper } = renderComponent({
          ...propsWithFields,
          customerShortProfile: {
            ...propsWithFields.customerShortProfile,
            fields: {
              ...propsWithFields.customerShortProfile.fields,
              email: {
                ...propsWithFields.customerShortProfile.fields.email,
                isDirty: true,
              },
            },
            success: true,
          },
        })
        expect(
          getTree(wrapper.find('.CustomerShortProfile-saveChanges'))
        ).toMatchSnapshot()
      })
    })
  })
  describe('@lifecycle', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    describe('on componentDidMount', () => {
      it("calls setFormSuccess with ('customerShortProfile', false)", () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.setFormSuccess).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.setFormSuccess).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormSuccess).toHaveBeenLastCalledWith(
          'customerShortProfile',
          false
        )
      })
      it("calls resetForm with ('customerShortProfile', getCustomerShortProfile(user))", () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.resetForm).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenLastCalledWith(
          'customerShortProfile',
          initialProps.user
        )
      })
    })
    describe('on componentWillUnmount', () => {
      it("calls setFormMessage with ('customerShortProfile', {})", () => {
        const props = {
          ...initialProps,
          setFormMessage: jest.fn(),
        }
        const { instance } = renderComponent(props)
        expect(instance.props.setFormMessage).not.toHaveBeenCalled()
        instance.componentWillUnmount()
        expect(instance.props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormMessage).toHaveBeenLastCalledWith(
          'customerShortProfile',
          {}
        )
      })
    })
  })
  describe('@events', () => {
    let renderedComponent
    const event = {
      target: {
        value: 123,
      },
      preventDefault: jest.fn(),
    }
    beforeEach(() => {
      renderedComponent = renderComponent(propsWithFields)
      jest.resetAllMocks()
    })
    describe('firstName Input', () => {
      const field = 'firstName'
      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('setField')(field)(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'customerShortProfile',
          field,
          event.target.value
        )
      })
      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.touchedFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('touchedField')(field)(
          event
        )
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'customerShortProfile',
          field
        )
      })
    })
    describe('lastName Input', () => {
      const field = 'lastName'
      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('setField')(field)(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'customerShortProfile',
          field,
          event.target.value
        )
      })
      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.touchedFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('touchedField')(field)(
          event
        )
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'customerShortProfile',
          field
        )
      })
    })
    describe('email Input', () => {
      const field = 'lastName'
      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('setField')(field)(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'customerShortProfile',
          field,
          event.target.value
        )
      })
      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.touchedFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find(`[name="${field}"]`).prop('touchedField')(field)(
          event
        )
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'customerShortProfile',
          field
        )
      })
    })
    describe('form submit', () => {
      it('should call e.preventDefault() ', () => {
        const { wrapper } = renderedComponent
        expect(event.preventDefault).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })
      it('should call changeShortProfileRequest on submit', () => {
        const { instance, wrapper } = renderedComponent
        instance.getErrors = jest.fn(() => ({}))
        expect(instance.props.changeShortProfileRequest).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.changeShortProfileRequest).toHaveBeenCalledTimes(
          1
        )
        expect(
          instance.props.changeShortProfileRequest
        ).toHaveBeenLastCalledWith(initialFormProps.customerShortProfile)
      })
    })

    describe('back to account click', () => {
      it('should call e.preventDefault() ', () => {
        const { wrapper } = renderedComponent
        expect(event.preventDefault).not.toHaveBeenCalled()
        wrapper.find('BackToAccountLink').prop('clickHandler')(event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })
      it('should call browserHistory.push ', () => {
        const { wrapper } = renderedComponent
        expect(browserHistory.push).not.toHaveBeenCalled()
        wrapper.find('BackToAccountLink').prop('clickHandler')(event)
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenLastCalledWith('/my-account')
      })
      it('should call setFormMessage ', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormMessage).not.toHaveBeenCalled()
        wrapper.find('BackToAccountLink').prop('clickHandler')(event)
        expect(instance.props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormMessage).toHaveBeenLastCalledWith(
          'customerShortProfile',
          {}
        )
      })
      it('should call setFormSuccess ', () => {
        const { wrapper, instance } = renderedComponent
        expect(instance.props.setFormSuccess).not.toHaveBeenCalled()
        wrapper.find('BackToAccountLink').prop('clickHandler')(event)
        expect(instance.props.setFormSuccess).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormSuccess).toHaveBeenLastCalledWith(
          'customerShortProfile',
          false
        )
      })
    })
  })
})

describe('Connected <CustomerShortProfile />', () => {
  const initialState = {
    forms: {
      customerShortProfile: {
        fields: {
          lastName: { value: 'Lee', isDirty: false, isTouched: false },
          firstName: { value: 'Robert', isDirty: false, isTouched: false },
          title: { value: 'Mr', isDirty: false, isTouched: false },
          email: { value: 'bob2@test.com', isDirty: false, isTouched: false },
        },
        errors: {
          lastName: undefined,
          firstName: undefined,
          title: undefined,
          email: undefined,
        },
        message: {
          message: null,
          type: null,
        },
      },
    },
    account: {
      user: {
        email: 'bob2@test.com',
        firstName: 'Bob',
        lastName: 'lee',
        title: 'Mr',
      },
    },
    siteOptions: {
      titles: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'],
    },
  }
  const store = mockStoreCreator(initialState)

  const renderConnectedComponent = testComponentHelper(
    CustomerShortProfile.WrappedComponent,
    { context: { store } }
  )
  const { instance } = renderConnectedComponent()
  describe('mapStateToProps', () => {
    it('should get customerShortProfile form from the store', () => {
      expect(instance.stateProps.customerShortProfile).toEqual(
        expect.objectContaining(initialState.forms.customerShortProfile)
      )
    })
    it('should get user from the store', () => {
      expect(instance.stateProps.user).toEqual(
        expect.objectContaining(initialState.account.user)
      )
    })
  })

  describe('mapDispatchToProps', () => {
    it('should pass changeShortProfileRequest action', () => {
      expect(instance.dispatchProps.changeShortProfileRequest).toBeInstanceOf(
        Function
      )
    })
    it('should pass resetForm action', () => {
      expect(instance.dispatchProps.resetForm).toBeInstanceOf(Function)
    })
    it('should pass setFormField action', () => {
      expect(instance.dispatchProps.setFormField).toBeInstanceOf(Function)
    })
    it('should pass setFormMessage action', () => {
      expect(instance.dispatchProps.setFormMessage).toBeInstanceOf(Function)
    })
    it('should pass setFormSuccess action', () => {
      expect(instance.dispatchProps.setFormSuccess).toBeInstanceOf(Function)
    })
    it('should pass touchedFormField action', () => {
      expect(instance.dispatchProps.touchedFormField).toBeInstanceOf(Function)
    })
  })
})
