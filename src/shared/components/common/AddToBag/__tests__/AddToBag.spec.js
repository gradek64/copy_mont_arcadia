import React from 'react'

import testComponentHelper from 'test/unit/helpers/test-component'
import { mockStoreCreator } from 'test/unit/helpers/get-redux-mock-store'

import AddToBag, { WrappedAddToBag } from '../AddToBag'
import AddToBagModal from '../../AddToBagModal/AddToBagModal'
import InlineConfirm from '../InlineConfirm'
import Button from '../../Button/Button'
import DeliveryCutoffMessage from '../../../common/DeliveryCutoffMessage/DeliveryCutoffMessage'
import { GTM_TRIGGER, GTM_EVENT } from '../../../../analytics'

const noop = () => {}
const addToBagPromise = Promise.resolve()
describe('<AddToBag />', () => {
  const requiredProps = {
    productId: 29434263,
    addToBag: () => addToBagPromise,
    showMiniBagConfirm: noop,
    openMiniBag: noop,
    sendAnalyticsDisplayEvent: jest.fn(),
    isAddingToBag: false,
    isCountryExcluded: false,
  }
  const renderComponent = testComponentHelper(WrappedAddToBag)

  describe('@connected', () => {
    it('should get `quantity` from `productDetail.selectedQuantity` in state', () => {
      const store = mockStoreCreator({
        currentProduct: {},
        productDetail: {
          selectedQuantity: 2,
        },
      })
      const { wrapper } = testComponentHelper(AddToBag)({
        store,
        ...requiredProps,
      })
      expect(wrapper.prop('quantity')).toBe(2)
    })
    it('should get `addToBagIsReady` from `addToBagIsReady` in state if its true', () => {
      const store = mockStoreCreator({
        currentProduct: {},
        productDetail: {
          activeItem: {},
        },
      })
      const { wrapper } = testComponentHelper(AddToBag)({
        store,
        ...requiredProps,
        addToBagIsReady: true,
      })
      expect(wrapper.prop('addToBagIsReady')).toBe(true)
    })

    it('should take supplied `quantity` prop over state', () => {
      const store = mockStoreCreator({
        currentProduct: {},
        productDetail: {
          selectedQuantity: 2,
        },
      })
      const { wrapper } = testComponentHelper(AddToBag)({
        ...requiredProps,
        quantity: 4,
        store,
      })
      expect(wrapper.prop('quantity')).toBe(4)
    })
  })

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render `InlineConfirm` if `showInlineConfirm` state is `true` and `isMobile` is false', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        isMobile: false,
      })
      wrapper.setState({
        showInlineConfirm: true,
      })
      expect(wrapper.find(InlineConfirm).exists()).toBeTruthy()
    })

    it('Button component should render "Add All to Bag" when `bundleItems` is truthy (empty array)', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        bundleItems: [],
      })
      expect(
        wrapper
          .find(Button)
          .render()
          .text()
      ).toBe('Add All to Bag')
    })

    it('Button component should render without is-active class', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        shouldAddToBag: () => false,
      })
      expect(wrapper.find(Button).hasClass('is-active')).toBe(false)
    })

    it('Button component should render with is-active class', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        shouldAddToBag: () => true,
      })
      expect(wrapper.find(Button).hasClass('is-active')).toBe(true)
    })

    it('Button component should render "Add All to Bag" when `bundleItems` is truthy (array with items)', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        bundleItems: [
          {
            productId: 29752415,
            sku: '602017001154368',
          },
          {
            productId: 29750936,
            sku: '602017001154352',
          },
        ],
      })
      expect(
        wrapper
          .find(Button)
          .render()
          .text()
      ).toBe('Add All to Bag')
    })

    it('Button component should render "Add to bag" when `bundleItems` is falsey', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
      })
      expect(
        wrapper
          .find(Button)
          .render()
          .text()
      ).toBe('Add to bag')
    })

    it('Button Component should not render the ellipsis animation span on the 1st render', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
      })
      expect(wrapper.find(Button).contains('span')).toBe(false)
    })

    it(`should pass 'deliveryMessage' prop to ${(
      <DeliveryCutoffMessage />
    )}`, () => {
      const deliveryMessage = 'Order in 9 hrs 23 mins for next day delivery'
      const { wrapper } = renderComponent({
        ...requiredProps,
        deliveryMessage,
      })
      expect(wrapper.find(DeliveryCutoffMessage).prop('message')).toBe(
        deliveryMessage
      )
    })

    it('should render the button in disabled state if it is an excluded country', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        isCountryExcluded: true,
      })

      const button = wrapper.find('Button').props().isDisabled
      expect(button).toBeTruthy()
    })
  })

  describe('@events', () => {
    describe('on click of ‘Add to Bag’ button', () => {
      const expectButtonText = (wrapper, text) => {
        expect(
          wrapper
            .find(Button)
            .render()
            .text()
        ).toBe(text)
      }

      const expectButtonAfterClick = (
        wrapper,
        { text = null, isDisabled = null, ellipsisLength = null }
      ) => {
        wrapper
          .find(Button)
          .first()
          .prop('clickHandler')()
        wrapper.update()

        if (text !== null) {
          expectButtonText(wrapper, text)
        }

        if (isDisabled !== null) {
          const expectation = expect(
            wrapper
              .find(Button)
              .render()
              .prop('disabled')
          )
          if (isDisabled) {
            expectation.toBeTruthy()
          } else {
            expectation.toBeFalsy()
          }
        }

        if (ellipsisLength !== null) {
          expect(
            wrapper
              .find(Button)
              .first()
              .find('.ellipsis').length
          ).toBe(ellipsisLength)
        }
      }

      it('on click should display animation and get back to the original state after the request is completed', async () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          isAddingToBag: true,
          sku: '602017001144094',
          partNumber: '602017001144094',
          quantity: 5,
        })

        expectButtonAfterClick(wrapper, {
          text: 'Adding to bag',
          ellipsisLength: 1,
          isDisabled: true,
        })

        wrapper.setProps({
          isAddingToBag: false,
        })

        expectButtonText(wrapper, 'Add to bag')
      })

      it('should set `showInlineConfirm` state to `false`', () => {
        const { wrapper } = renderComponent(requiredProps)
        wrapper.find('Button').prop('clickHandler')()
        expect(wrapper.state('showInlineConfirm')).toBe(false)
      })

      it('should change text from "Add All to Bag" to "Adding All to bag" for a bundle item', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          isAddingToBag: true,
          bundleItems: [
            {
              productId: 29752415,
              sku: '602017001154368',
            },
          ],
        })
        expectButtonAfterClick(wrapper, { text: 'Adding All to Bag' })
      })

      it('should not call `addToBag` if `shouldAddToBag` returns `false`', () => {
        const addToBagMock = jest.fn(() => Promise.resolve())
        const { wrapper } = renderComponent({
          ...requiredProps,
          shouldAddToBag: () => false,
          addToBag: addToBagMock,
        })
        wrapper.find('Button').prop('clickHandler')()
        expect(addToBagMock).not.toHaveBeenCalled()
      })

      it('should call `addToBag` prop with `productId`,`sku`,`quantity`, `partNumber`', () => {
        const addToBagMock = jest.fn(() => Promise.resolve())
        const { wrapper } = renderComponent({
          ...requiredProps,
          sku: '602017001144094',
          partNumber: '602017001144094',
          quantity: 5,
          addToBag: addToBagMock,
        })
        wrapper.find('Button').prop('clickHandler')()
        const [
          productIdArg,
          skuArg,
          partNumberArg,
          quantityArg,
        ] = addToBagMock.mock.calls[0]
        expect(productIdArg).toBe(29434263)
        expect(skuArg).toBe('602017001144094')
        expect(partNumberArg).toBe('602017001144094')
        expect(quantityArg).toBe(5)
      })

      it('should pass correct successHTML to `addToBag`', () => {
        const addToBagMock = jest.fn(() => Promise.resolve())
        const additionalProps = {
          sku: '602017001144094',
          partNumber: '602017001144094',
          quantity: 1,
          bundleItems: undefined,
          addToBag: addToBagMock,
        }
        const { wrapper } = renderComponent({
          ...requiredProps,
          ...additionalProps,
        })
        wrapper.find('Button').prop('clickHandler')()
        const args = addToBagMock.mock.calls[0]
        expect(args[4]).toEqual(<AddToBagModal />)
      })

      it('should call `addToBag` prop with `bundleItems`', () => {
        const addToBagMock = jest.fn(() => Promise.resolve())
        const { wrapper } = renderComponent({
          ...requiredProps,
          bundleItems: [
            {
              productId: 29752415,
              sku: '602017001154368',
            },
          ],
          addToBag: addToBagMock,
        })
        wrapper.find('Button').prop('clickHandler')()
        const args = addToBagMock.mock.calls[0]
        expect(args[5]).toEqual([
          {
            productId: 29752415,
            sku: '602017001154368',
          },
        ])
      })

      describe('on `addToBag` fulfilled', () => {
        beforeEach(jest.useFakeTimers)

        it('should set `showInlineConfirm` state to `true` if `shouldShowInlineConfirm` prop is `true`', () => {
          const addToBagMock = jest.fn(() => Promise.resolve())
          const { wrapper } = renderComponent({
            ...requiredProps,
            sku: '602017001144094',
            shouldShowInlineConfirm: true,
            addToBag: addToBagMock,
          })

          return wrapper
            .find('Button')
            .prop('clickHandler')()
            .then(() => {
              expect(wrapper.state('showInlineConfirm')).toBe(true)
            })
        })

        it('should call updateWishlist if function passed in', async () => {
          const addToBagMock = jest.fn(() => Promise.resolve())
          const updateWishlistMock = jest.fn(() => {})
          const { wrapper } = renderComponent({
            ...requiredProps,
            updateWishlist: updateWishlistMock,
            addToBag: addToBagMock,
          })

          await wrapper.find('Button').prop('clickHandler')()

          await wrapper.update()

          expect(updateWishlistMock).toHaveBeenCalled()
        })

        it('should open mini bag with a 100ms delay if `shouldShowMiniBagConfirm` prop is `true`', () => {
          const addToBagMock = jest.fn(() => Promise.resolve())
          const openMiniBagMock = jest.fn()
          const sendAnalyticsDisplayEventMock = jest.fn()
          const { wrapper } = renderComponent({
            ...requiredProps,
            sku: '602017001144094',
            shouldShowMiniBagConfirm: true,
            addToBag: addToBagMock,
            isMobile: false,
            openMiniBag: openMiniBagMock,
            sendAnalyticsDisplayEvent: sendAnalyticsDisplayEventMock,
          })

          return wrapper
            .find('Button')
            .prop('clickHandler')()
            .then(() => {
              expect(openMiniBagMock).not.toHaveBeenCalled()
              expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100)
              jest.runAllTimers()
              expect(openMiniBagMock).toHaveBeenCalledTimes(1)
              expect(openMiniBagMock).toHaveBeenCalledWith(true)
              expect(sendAnalyticsDisplayEventMock).toHaveBeenCalledWith(
                {
                  bagDrawerTrigger: GTM_TRIGGER.PRODUCT_ADDED_TO_BAG,
                  openFrom: 'pdp',
                },
                GTM_EVENT.BAG_DRAWER_DISPLAYED
              )
            })
        })

        it('should not open mini bag when on mobile', () => {
          const addToBagMock = jest.fn(() => Promise.resolve())
          const openMiniBagMock = jest.fn()
          const sendAnalyticsDisplayEventMock = jest.fn()

          const { wrapper } = renderComponent({
            ...requiredProps,
            sku: '602017001144094',
            shouldShowInlineConfirm: true,
            shouldShowMiniBagConfirm: true,
            addToBag: addToBagMock,
            openMiniBag: openMiniBagMock,
            sendAnalyticsDisplayEvent: sendAnalyticsDisplayEventMock,
            isMobile: true,
          })

          return wrapper
            .find('Button')
            .prop('clickHandler')()
            .then(() => {
              expect(setTimeout).not.toHaveBeenCalled()
              jest.runAllTimers()
              expect(openMiniBagMock).not.toHaveBeenCalled()
              expect(sendAnalyticsDisplayEventMock).not.toHaveBeenCalled()
            })
        })

        it('should do nothing if `addToBag` fulfills with an `Error`', () => {
          const addToBagMock = jest.fn(() => Promise.resolve(new Error()))
          const { wrapper } = renderComponent({
            ...requiredProps,
            sku: '602017001144094',
            shouldShowInlineConfirm: true,
            shouldShowMiniBagConfirm: true,
            addToBag: addToBagMock,
          })

          return wrapper
            .find('Button')
            .prop('clickHandler')()
            .then(() => {
              expect(wrapper.state('showInlineConfirm')).toBe(false)
              expect(setTimeout).not.toHaveBeenCalled()
            })
        })

        it('button should be enabled', () => {
          const addToBagMock = jest.fn(() => Promise.resolve())
          const { wrapper } = renderComponent({
            ...requiredProps,
            sku: '602017001144094',
            shouldShowInlineConfirm: true,
            addToBag: addToBagMock,
          })

          return wrapper
            .find(Button)
            .first()
            .prop('clickHandler')()
            .then(() => {
              expect(
                wrapper
                  .find(Button)
                  .render()
                  .prop('disabled')
              ).toBeFalsy()
            })
        })
      })
    })
  })
})
