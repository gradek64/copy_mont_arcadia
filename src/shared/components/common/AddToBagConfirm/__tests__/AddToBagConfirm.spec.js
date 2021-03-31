import testComponentHelper from 'test/unit/helpers/test-component'
import AddToBagConfirm from '../AddToBagConfirm'
import { browserHistory } from 'react-router'
import { GTM_TRIGGER, GTM_EVENT } from '../../../../analytics'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

describe('<AddToBagConfirm /> ', () => {
  const initProps = {
    openMiniBag: jest.fn(),
    onClose: jest.fn(),
    sendAnalyticsDisplayEvent: jest.fn(),
    closeModal: jest.fn(),
    pageType: 'pdp',
  }
  const mockedEvent = {
    stopPropagation: jest.fn(),
  }

  const renderComponent = testComponentHelper(AddToBagConfirm.WrappedComponent)

  describe('@renders', () => {
    it('with default props', () => {
      expect(renderComponent(initProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('on click viewBag', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })
      it('should call openMiniBag and onClose', () => {
        const { wrapper } = renderComponent(initProps)
        wrapper
          .find('.AddToBagConfirm-viewBag')
          .props()
          .clickHandler(mockedEvent)
        expect(initProps.onClose).toHaveBeenCalledTimes(1)
        expect(initProps.openMiniBag).toHaveBeenCalledTimes(1)
        expect(initProps.sendAnalyticsDisplayEvent).toHaveBeenCalledWith(
          {
            bagDrawerTrigger: GTM_TRIGGER.PRODUCT_VIEW_BAG,
            openFrom: 'pdp',
          },
          GTM_EVENT.BAG_DRAWER_DISPLAYED
        )
      })
      it('should call evt.stopPropagation if evt is defined', () => {
        const { wrapper } = renderComponent(initProps)
        wrapper
          .find('.AddToBagConfirm-viewBag')
          .props()
          .clickHandler(mockedEvent)
        expect(mockedEvent.stopPropagation).toHaveBeenCalledTimes(1)
      })
    })
    describe('onclick goToCheckout', () => {
      beforeEach(() => {
        jest.clearAllMocks()
      })
      it('should call browserHistory.push and onClose', () => {
        const { wrapper, instance } = renderComponent(initProps)
        wrapper
          .find('.AddToBagConfirm-goToCheckout')
          .props()
          .clickHandler(mockedEvent)
        expect(instance.props.onClose).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenLastCalledWith('/checkout')
      })
      it('should call evt.stopPropagation if evt is defined', () => {
        const { wrapper } = renderComponent(initProps)
        wrapper
          .find('.AddToBagConfirm-goToCheckout')
          .props()
          .clickHandler(mockedEvent)
        expect(mockedEvent.stopPropagation).toHaveBeenCalledTimes(1)
      })
      it('should call closeModal if modal is open', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          modalOpen: true,
        })
        wrapper
          .find('.AddToBagConfirm-goToCheckout')
          .props()
          .clickHandler(mockedEvent)
        expect(initProps.closeModal).toHaveBeenCalledTimes(1)
      })
      it('should not call closeModal if modal is not open', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          modalOpen: false,
        })
        wrapper
          .find('.AddToBagConfirm-goToCheckout')
          .props()
          .clickHandler(mockedEvent)
        expect(initProps.closeModal).not.toHaveBeenCalled()
      })
    })
  })
})
