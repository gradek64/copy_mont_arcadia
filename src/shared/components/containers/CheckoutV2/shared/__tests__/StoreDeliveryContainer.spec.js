import React from 'react'
import { clone } from 'ramda'
import StoreDeliveryContainer from '../StoreDeliveryContainer'
import testComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import { orderSummaryUkStandard } from '../../../../../../../test/mocks/orderSummary/uk-standard'
import { orderSummaryCollectFromStoreExpress } from '../../../../../../../test/mocks/orderSummary/collect-from-store-express'
import { orderSummaryCollectFromParcelShop } from '../../../../../../../test/mocks/orderSummary/collect-from-parcel-shop'
import { setStoreUpdating } from '../../../../../actions/common/checkoutActions'
import { searchStoresCheckout } from '../../../../../actions/components/UserLocatorActions'
import CollectFromStore from '../../../../common/CollectFromStore/CollectFromStore'
import { showModal } from '../../../../../actions/common/modalActions'
import DeliveryDetailsForm from '../DetailsForm/DeliveryDetailsForm'
import { sendEvent } from '../../../../../actions/common/googleAnalyticsActions'
import CheckoutPrimaryTitle from '../../shared/CheckoutPrimaryTitle'

jest.mock('../../../../common/CollectFromStore/CollectFromStore', () =>
  jest.fn(() => {})
)

jest.mock('../../../../../actions/common/modalActions', () => ({
  showModal: jest.fn(() => ({ type: 'foo' })),
}))

jest.mock('../../../../../actions/common/checkoutActions', () => ({
  setStoreUpdating: jest.fn(() => ({ type: 'foo' })),
}))

jest.mock('../../../../../actions/components/UserLocatorActions', () => ({
  searchStoresCheckout: jest.fn(() => ({ type: 'foo' })),
}))

jest.mock('../../../../../actions/common/googleAnalyticsActions')

const mockState = {
  viewport: {
    media: 'mobile',
  },
  checkout: {
    orderSummary: {
      ...orderSummaryUkStandard,
      deliveryDetails: {
        address: {},
      },
    },
    storeUpdating: false,
  },
  userLocator: {
    pending: true,
  },
  features: {
    status: {
      FEATURE_CFS: true,
      FEATURE_PUDO: true,
    },
  },
}

const mockProps = {
  isMobile: false,
  isStoreUpdating: false,
  isStoreOrParcelDelivery: false,
  isDeliveryStoreChoiceAccepted: false,
  selectedDeliveryLocationType: 'STORE',
  storeDetails: null,
  setStoreUpdating: jest.fn(),
  searchStoresCheckout: jest.fn(),
  showModal: jest.fn(),
  sendEvent,
}

const $ = {
  root: '.StoreDeliveryContainer',
  searchForm: '.StoreDeliveryContainer-searchForm',
  storeDetails: '.StoreDeliveryContainer-addressLines',
  storeDetailsTitle: '.StoreDeliveryContainer-title',
  mobileStoreDetailsTitle: '.StoreDeliveryContainer-mobileTitle',
  desktopStoreDetailsTitle: '.StoreDeliveryContainer-desktopTitle',
  changeStoreButton: '.StoreDeliveryContainer-changeStoreCTA',
  deliveryDetailsForm: DeliveryDetailsForm,
}

const renderComponent = testComponentHelper(
  StoreDeliveryContainer.WrappedComponent
)

function renderConnectedProps(modifyState = () => {}) {
  const state = clone(mockState)
  modifyState(state)
  return renderConnectedComponentProps(StoreDeliveryContainer, state)
}

describe('<StoreDeliveryContainer/>', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('@renders', () => {
    describe('the `change store` button label', () => {
      const props = {
        ...mockProps,
        isMobile: false,
        isStoreOrParcelDelivery: true,
      }

      describe('for stores', () => {
        props.selectedDeliveryLocationType = 'STORE'

        describe('when a store has not actually been chosen', () => {
          props.isDeliveryStoreChoiceAccepted = false

          const component = renderComponent(props)
          const changeStoreBtn = component.wrapper.find($.changeStoreButton)

          it('renders with the label `Choose store`', () => {
            expect(changeStoreBtn.prop('children')).toBe('Choose store')
          })
        })

        describe('when a store has been chosen', () => {
          props.isDeliveryStoreChoiceAccepted = true

          const component = renderComponent(props)
          const changeStoreBtn = component.wrapper.find($.changeStoreButton)

          it('renders with the label `Change store`', () => {
            expect(changeStoreBtn.prop('children')).toBe('Change store')
          })
        })
      })

      describe('for parcel shops', () => {
        props.selectedDeliveryLocationType = 'PARCELSHOP'

        describe('when a parcel shop has not actually been chosen', () => {
          props.isDeliveryStoreChoiceAccepted = false

          const component = renderComponent(props)
          const changeStoreBtn = component.wrapper.find($.changeStoreButton)

          it('renders with the label `Choose shop`', () => {
            expect(changeStoreBtn.prop('children')).toBe('Choose shop')
          })
        })

        describe('when a parcel shop has been chosen', () => {
          props.isDeliveryStoreChoiceAccepted = true

          const component = renderComponent(props)
          const changeStoreBtn = component.wrapper.find($.changeStoreButton)

          it('renders with the label `Change shop`', () => {
            expect(changeStoreBtn.prop('children')).toBe('Change shop')
          })
        })
      })
    })

    describe('when in mobile', () => {
      const props = { ...mockProps, isMobile: true }

      describe('when a store or parcel shop delivery option has been chosen', () => {
        props.isStoreOrParcelDelivery = true

        describe('when no store has yet been chosen', () => {
          props.storeDetails = null
          props.isDeliveryStoreChoiceAccepted = false

          const component = renderComponent(props)

          it('renders the store search form', () => {
            expect(component.wrapper.find($.searchForm)).toHaveLength(1)
          })

          it('does not render the store details title', () => {
            expect(component.wrapper.find($.storeDetailsTitle)).toHaveLength(0)
          })

          it('does not render the store details', () => {
            expect(component.wrapper.find($.storeDetails)).toHaveLength(0)
          })

          it('does not render the change store button', () => {
            expect(component.wrapper.find($.changeStoreButton)).toHaveLength(0)
          })

          it('does not render the `delivery details` form', () => {
            expect(component.wrapper.find($.deliveryDetailsForm)).toHaveLength(
              0
            )
          })
        })

        describe('when a store has been chosen', () => {
          props.storeDetails = {}
          props.isDeliveryStoreChoiceAccepted = true

          const component = renderComponent(props)

          it('does not render the store search form', () => {
            expect(component.wrapper.find($.searchForm)).toHaveLength(0)
          })

          it('render the store title', () => {
            expect(component.wrapper.find(CheckoutPrimaryTitle)).toHaveLength(1)
          })

          it('renders the store details', () => {
            expect(component.wrapper.find($.storeDetails)).toHaveLength(1)
          })

          it('renders the change store CTA', () => {
            const changeStoreButton = component.wrapper.find(
              $.changeStoreButton
            )
            expect(changeStoreButton).toHaveLength(1)
            expect(changeStoreButton.text()).toBe('CHANGE')
          })

          it('renders the `delivery details` form', () => {
            expect(component.wrapper.find($.deliveryDetailsForm)).toHaveLength(
              1
            )
          })
        })
      })

      describe('when a delivery option other than store or parcel shop has been chosen', () => {
        props.isStoreOrParcelDelivery = false

        describe('when no store has yet been chosen', () => {
          props.storeDetails = null
          props.isDeliveryStoreChoiceAccepted = false

          const component = renderComponent(props)

          it('does not render anything', () => {
            expect(component.wrapper.find($.root)).toHaveLength(0)
          })
        })

        describe('when no store has yet been chosen', () => {
          props.storeDetails = {}

          const component = renderComponent(props)

          it('does not render anything', () => {
            expect(component.wrapper.find($.root)).toHaveLength(0)
          })
        })
      })
    })

    describe('when not mobile', () => {
      const props = { ...mockProps, isMobile: false }

      describe('when a store or parcel delivery option has been chosen', () => {
        props.isStoreOrParcelDelivery = true

        describe('when no store has yet been chosen', () => {
          props.storeDetails = null
          props.isDeliveryStoreChoiceAccepted = false

          const component = renderComponent(props)

          it('does not render the store search form', () => {
            expect(component.wrapper.find($.searchForm)).toHaveLength(0)
          })

          it('does not render the store details title', () => {
            expect(component.wrapper.find($.storeDetailsTitle)).toHaveLength(0)
          })

          it('does not render the store details', () => {
            expect(component.wrapper.find($.storeDetails)).toHaveLength(0)
          })

          it('renders the change store button', () => {
            expect(component.wrapper.find($.changeStoreButton)).toHaveLength(1)
          })

          it('does not render the `your details` form', () => {
            expect(component.wrapper.find($.deliveryDetailsForm)).toHaveLength(
              0
            )
          })
        })

        describe('when a store has been chosen', () => {
          props.storeDetails = {}
          props.isDeliveryStoreChoiceAccepted = true

          const component = renderComponent(props)

          it('does not render the store search form', () => {
            expect(component.wrapper.find($.searchForm)).toHaveLength(0)
          })

          it('does not render the mobile store details title', () => {
            expect(
              component.wrapper.find($.mobileStoreDetailsTitle)
            ).toHaveLength(0)
          })

          it('renders the store title', () => {
            expect(component.wrapper.find(CheckoutPrimaryTitle)).toHaveLength(1)
          })

          it('renders the store details', () => {
            expect(component.wrapper.find($.storeDetails)).toHaveLength(1)
          })

          it('renders the change store button', () => {
            const changeStoreButton = component.wrapper.find(
              $.changeStoreButton
            )
            expect(changeStoreButton).toHaveLength(1)
            expect(changeStoreButton.text()).toBe('CHANGE')
          })

          it('renders the `your details` form', () => {
            expect(component.wrapper.find($.deliveryDetailsForm)).toHaveLength(
              1
            )
          })
        })
      })

      describe('when a delivery option other than store or parcel shop has been chosen', () => {
        props.isStoreOrParcelDelivery = false

        describe('when no store has yet been chosen', () => {
          props.storeDetails = null

          const component = renderComponent(props)

          it('does not render anything', () => {
            expect(component.wrapper.find($.root)).toHaveLength(0)
          })
        })

        describe('when no store has yet been chosen', () => {
          props.storeDetails = {}

          const component = renderComponent(props)

          it('does not render anything', () => {
            expect(component.wrapper.find($.root)).toHaveLength(0)
          })
        })
      })
    })
  })

  describe('@lifecycle', () => {
    describe('The automatic showing of the store locator modal', () => {
      describe('when not mobile', () => {
        const props = { ...mockProps, isMobile: false }

        describe('when the store or parcel shop delivery option has been preselected before mounting', () => {
          props.isStoreOrParcelDelivery = true

          describe('when an actual store / shop has not been chosen', () => {
            props.storeDetails = undefined
            props.isDeliveryStoreChoiceAccepted = false

            const component = renderComponent(props)

            it('renders the store locator modal upon mounting', () => {
              component.instance.componentDidMount()
              expect(props.showModal).toHaveBeenCalledTimes(1)
              expect(props.showModal).toHaveBeenCalledWith(
                <CollectFromStore />,
                { mode: 'storeLocator' }
              )
            })
          })

          describe('when an actual store / shop has been chosen', () => {
            props.storeDetails = {}
            props.isDeliveryStoreChoiceAccepted = true

            const component = renderComponent(props)

            it('does not render the store locator modal', () => {
              component.instance.componentDidMount()
              expect(props.showModal).not.toHaveBeenCalled()
            })
          })
        })

        describe('when the store or parcel shop delivery option has been selected after mounting', () => {
          props.isStoreOrParcelDelivery = false
          props.isStoreUpdating = false

          const component = renderComponent(props)

          it('renders the store locator modal upon mounting', () => {
            component.instance.UNSAFE_componentWillReceiveProps({
              ...props,
              isStoreOrParcelDelivery: true,
              isStoreUpdating: true,
            })

            expect(props.showModal).toHaveBeenCalledTimes(1)
            expect(props.showModal).toHaveBeenCalledWith(<CollectFromStore />, {
              mode: 'storeLocator',
            })
          })
        })
      })
    })
  })

  describe('@events', () => {
    describe('when the search form is submitted', () => {
      it('results in props.searchStoresCheckout() being called', () => {
        const props = Object.assign({}, mockProps, {
          isMobile: true,
          isStoreOrParcelDelivery: true,
        })
        const component = renderComponent(props)
        const searchForm = component.wrapper.find($.searchForm)

        searchForm.simulate('submit', { preventDefault: () => {} })

        expect(mockProps.searchStoresCheckout).toHaveBeenCalled()
      })
    })

    describe('when the change store link is clicked', () => {
      const props = {
        ...mockProps,
        isMobile: true,
        isStoreOrParcelDelivery: true,
        isDeliveryStoreChoiceAccepted: true,
        storeDetails: {},
      }
      const component = renderComponent(props)
      const changeStoreButton = component.wrapper.find($.changeStoreButton)

      it('results in props.setStoreUpdating(true) being called', () => {
        changeStoreButton.simulate('click')
        expect(mockProps.setStoreUpdating).toHaveBeenCalledTimes(1)
        expect(mockProps.setStoreUpdating).toHaveBeenCalledWith(true)
      })

      it('results in props.showModal(...) not being called', () => {
        changeStoreButton.simulate('click')
        expect(mockProps.showModal).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the change store button is clicked', () => {
      const props = {
        ...mockProps,
        isMobile: false,
        isStoreOrParcelDelivery: true,
        storeDetails: {},
      }
      const component = renderComponent(props)
      const changeStoreBtn = component.wrapper.find($.changeStoreButton).dive()

      it('results in props.setStoreUpdating(true)', () => {
        changeStoreBtn.simulate('click')
        expect(mockProps.setStoreUpdating).toHaveBeenCalledTimes(1)
        expect(mockProps.setStoreUpdating).toHaveBeenCalledWith(true)
      })

      it('results in props.showModal(...) being called', () => {
        changeStoreBtn.simulate('click')
        expect(mockProps.showModal).toHaveBeenCalledTimes(1)
        expect(mockProps.showModal).toHaveBeenCalledWith(<CollectFromStore />, {
          mode: 'storeLocator',
        })
      })
    })
  })

  describe('@connected', () => {
    describe('mapping state to props', () => {
      describe('when in mobile', () => {
        const props = renderConnectedProps((state) => {
          state.viewport.media = 'mobile'
        })

        it('renders with appropriate props', () => {
          expect(props.isMobile).toBe(true)
        })
      })

      describe('when not in mobile', () => {
        const props = renderConnectedProps((state) => {
          state.viewport.media = 'desktop'
        })

        it('renders with appropriate props', () => {
          expect(props.isMobile).toBe(false)
        })
      })

      describe('when a store is being changed', () => {
        const props = renderConnectedProps((state) => {
          state.checkout.storeUpdating = true
        })

        it('renders with appropriate props', () => {
          expect(props.isStoreUpdating).toBe(true)
        })
      })

      describe('when a store is not being changed', () => {
        const props = renderConnectedProps((state) => {
          state.checkout.storeUpdating = false
        })

        it('renders with appropriate props', () => {
          expect(props.isStoreUpdating).toBe(false)
        })
      })

      describe('when the store delivery option has been selected', () => {
        const props = renderConnectedProps((state) => {
          state.checkout.orderSummary = {
            ...orderSummaryCollectFromStoreExpress,
            deliveryDetails: {
              address: {},
            },
          }
        })

        it('renders with appropriate props', () => {
          expect(props.isStoreOrParcelDelivery).toBe(true)
          expect(props.selectedDeliveryLocationType).toBe('STORE')
        })
      })

      describe('when the parcel shop delivery option has been selected', () => {
        const props = renderConnectedProps((state) => {
          state.checkout.orderSummary = {
            ...orderSummaryCollectFromParcelShop,
            deliveryDetails: {
              address: {},
            },
          }
        })

        it('renders with appropriate props', () => {
          expect(props.isStoreOrParcelDelivery).toBe(true)
          expect(props.selectedDeliveryLocationType).toBe('PARCELSHOP')
        })
      })

      describe('when the home delivery option has been selected', () => {
        const props = renderConnectedProps((state) => {
          state.checkout.orderSummary = {
            ...orderSummaryUkStandard,
            deliveryDetails: {
              address: {},
            },
          }
        })

        it('renders with appropriate props', () => {
          expect(props.isStoreOrParcelDelivery).toBe(false)
        })
      })

      describe('when an actual delivery store has been selected', () => {
        const storeDetails = { address1: '214 Oxford Street' }
        const props = renderConnectedProps((state) => {
          state.checkout.orderSummary = {
            ...orderSummaryCollectFromParcelShop,
            storeDetails,
          }
        })

        it('renders with appropriate props', () => {
          expect(props.storeDetails).toBe(storeDetails)
          expect(props.isDeliveryStoreChoiceAccepted).toBe(true)
        })
      })

      describe('when an actual delivery store has not been selected', () => {
        const props = renderConnectedProps((state) => {
          state.checkout.orderSummary = {
            ...orderSummaryCollectFromParcelShop,
            deliveryDetails: {
              address: {},
            },
            storeDetails: undefined,
          }
        })

        it('renders with appropriate props', () => {
          expect(props.isDeliveryStoreChoiceAccepted).toBe(false)
        })
      })
    })
  })

  describe('mapping dispatch to props', () => {
    jest.clearAllMocks()
    const props = renderConnectedProps()
    it('works as expected', () => {
      props.setStoreUpdating(true)
      props.searchStoresCheckout()
      props.showModal(true)

      expect(setStoreUpdating).toHaveBeenCalledTimes(1)
      expect(setStoreUpdating).toHaveBeenCalledWith(true)

      expect(searchStoresCheckout).toHaveBeenCalledTimes(1)
      expect(searchStoresCheckout).toHaveBeenCalled()

      expect(showModal).toHaveBeenCalledTimes(1)
      expect(showModal).toHaveBeenCalledWith(true)
    })
  })
})
