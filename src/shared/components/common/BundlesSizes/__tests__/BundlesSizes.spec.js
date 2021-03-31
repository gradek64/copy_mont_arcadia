import testComponentHelper from 'test/unit/helpers/test-component'
import BundlesSizes from '../BundlesSizes'
import { GTM_CATEGORY, GTM_ACTION } from '../../../../analytics'

jest.mock('../../../../lib/product-utilities')
import {
  checkIfOneSizedItem,
  getMatchingAttribute,
} from '../../../../lib/product-utilities'

const addToBagForm = {
  28665413: {
    fields: {
      size: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      selected: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
    isLoading: false,
    errors: {},
    message: {},
  },
}

describe('<BundlesSizes />', () => {
  const renderComponent = testComponentHelper(BundlesSizes.WrappedComponent)
  const initialProps = {
    addToBagForm,
    items: [
      {
        size: 'XL',
        sku: '973429581273495',
      },
    ],
    linkAction: jest.fn(),
    productId: 28665413,
    initForm: jest.fn(),
    setFormMessage: jest.fn(),
    setFormField: jest.fn(),
    sendAnalyticsClickEvent: jest.fn(),
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('in selected state', () => {
      const props = {
        ...initialProps,
        addToBagForm: {
          28665413: {
            ...initialProps.addToBagForm['28665413'],
            fields: {
              ...initialProps.addToBagForm['28665413'].fields,
              size: {
                value: '973429581273495',
                isDirty: true,
                isTouched: true,
                isFocused: false,
              },
            },
          },
        },
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('in error state', () => {
      const props = {
        ...initialProps,
        addToBagForm: {
          28665413: {
            ...initialProps.addToBagForm['28665413'],
            message: {
              message: 'fake error message',
            },
          },
        },
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('with size guide', () => {
      checkIfOneSizedItem.mockImplementation(() => false)
      getMatchingAttribute.mockImplementation(() => 'Jackets & Coats')
      const props = {
        ...initialProps,
        attributes: {
          ECMC_PROD_SIZE_GUIDE_1: 'Jackets & Coats',
        },
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('with size guide on desktop', () => {
      checkIfOneSizedItem.mockImplementation(() => false)
      getMatchingAttribute.mockImplementation(() => 'Jackets & Coats')
      const props = {
        ...initialProps,
        isMobile: false,
        attributes: {
          ECMC_PROD_SIZE_GUIDE_1: 'Jackets & Coats',
        },
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('with one sized item (not display size guide)', () => {
      checkIfOneSizedItem.mockImplementation(() => true)
      getMatchingAttribute.mockImplementation(() => 'Jackets & Coats')
      const props = {
        ...initialProps,
        attributes: {
          ECMC_PROD_SIZE_GUIDE_1: 'Jackets & Coats',
        },
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifeCycles', () => {
    describe('componentDidMount', () => {
      it('should call initForm', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.props.initForm).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.initForm).toHaveBeenCalledTimes(1)
        expect(instance.props.initForm).toHaveBeenLastCalledWith(
          'bundlesAddToBag',
          instance.props.productId
        )
      })
    })
  })

  describe('@events', () => {
    describe('onChange of Select', () => {
      const event = Object.freeze({
        target: {
          value: 'fake value',
          0: {},
          1: {
            text: 'fake size',
          },
          selectedIndex: 1,
        },
      })
      beforeEach(() => jest.clearAllMocks())
      it('should call setFormField', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        wrapper.find('.BundlesSizes-size').simulate('change', event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'bundlesAddToBag',
          'size',
          event.target.value,
          instance.props.productId
        )
      })
      it('should call sendAnalyticsClickEvent', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.sendAnalyticsClickEvent).not.toHaveBeenCalled()
        wrapper.find('.BundlesSizes-size').simulate('change', event)
        expect(instance.props.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
        expect(instance.props.sendAnalyticsClickEvent).toHaveBeenLastCalledWith(
          {
            category: GTM_CATEGORY.BUNDLE,
            action: GTM_ACTION.CLICKED,
            label: `${GTM_ACTION.SIZE_SELECTED} ${event.target[1].text}`,
          }
        )
      })
    })
  })
})
