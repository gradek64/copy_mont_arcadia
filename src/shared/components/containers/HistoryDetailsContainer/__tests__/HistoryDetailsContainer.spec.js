import testComponentHelper, {
  buildComponentRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import HistoryDetailsContainer from '../HistoryDetailsContainer'
import { compose } from 'ramda'
import { sortOrdersByTrackingNumber } from '../../../../lib/order-details'

const orderLines = [
  {
    lineNo: '02J50LBLK',
    name: 'MOTO Hook & Eye Joni Jeans',
    size: 'W2430',
    colour: 'BLACK',
    imageUrl:
      'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS02J50LBLK_Small_F_1.jpg',
    quantity: 1,
    unitPrice: '52.00',
    discount: '',
    total: '52.00',
    nonRefundable: false,
    trackingAvailable: false,
  },
  {
    lineNo: '26B07MOCH',
    name: 'PETITE Knot Front Top',
    size: '4',
    colour: 'Ochre',
    imageUrl:
      'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
    quantity: 1,
    unitPrice: '29.00',
    discount: '',
    total: '29.00',
    nonRefundable: false,
    trackingAvailable: false,
  },
]

const paymentDetails = [
  {
    paymentMethod: 'Visa',
    cardNumberStar: '************1111',
    totalCost: '£174.00',
  },
]

const address = {
  name: 'Ms elroy antao',
  address1: 'Wallis',
  address2: '216 Oxford Street',
  address3: 'LONDON',
  address4: 'W1C 1DB',
  country: 'United Kingdom',
}

describe('<HistoryDetailsContainer />', () => {
  const initialProps = {
    paramId: 'fake-id',
    orderDetails: {
      statusCode: 'D',
    },
  }
  const renderComponent = testComponentHelper(HistoryDetailsContainer) // shallow mount

  const render = compose(
    mountRender,
    withStore({ config: { brandName: 'topman' } })
  )
  const mountRenderComponent = buildComponentRender(
    render,
    HistoryDetailsContainer
  ) // full mount

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with no orderDetails - orderId it should display paramId', () => {
      const { wrapper, getTreeFor } = renderComponent(initialProps)
      expect(
        getTreeFor(wrapper.find('.HistoryDetailsContainer-orderNumber'))
      ).toMatchSnapshot()
    })
    it('with no orderDetails - orderStatus it should not render', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
      })
      expect(
        getTreeFor(wrapper.find('.HistoryDetailsContainer-orderStatusLabel'))
      ).toBe(null)
      expect(
        getTreeFor(wrapper.find('.HistoryDetailsContainer-orderStatus'))
      ).toBe(null)
    })
    it('with orderDetails - orderId it should display orderId', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          orderId: 'fake-order-id',
        },
      })
      expect(
        getTreeFor(wrapper.find('.HistoryDetailsContainer-orderNumber'))
      ).toMatchSnapshot()
    })
    it('with orderDetails - orderStatus it should display orderStatus', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          status: 'Your order has been cancelled',
        },
      })
      expect(
        getTreeFor(wrapper.find('.HistoryDetailsContainer-orderStatus'))
      ).toMatchSnapshot()
    })
    it('with orderLines', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          orderId: 'fake-order-id',
          orderLines,
        },
      })
      expect(
        getTreeFor(wrapper.find('.HistoryDetailsContainer-list'))
      ).toMatchSnapshot()
    })
    it('with orderLines as []', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          orderId: 'fake-order-id',
          orderLines: [],
        },
      })
      expect(
        getTreeFor(wrapper.find('.HistoryDetailsContainer-notFound'))
      ).toMatchSnapshot()
    })
    it('with totalOrderPrice and deliveryPrice', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          totalOrderPrice: '75',
          deliveryPrice: '4',
        },
      })
      expect(
        getTreeFor(wrapper.find('OrderHistoryDetailsSummary'))
      ).toMatchSnapshot()
    })
    it('with paymentDetails and billingAddress', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          billingAddress: address,
          paymentDetails,
        },
      })
      expect(
        getTreeFor(wrapper.find('OrderHistoryDetailsAddress[type="billing"]'))
      ).toMatchSnapshot()
    })
    it('with paymentDetails and deliveryAddress', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          deliveryAddress: address,
          paymentDetails,
          deliveryMethod: 'UK Standard up to 4 working days',
        },
      })
      expect(
        getTreeFor(wrapper.find('OrderHistoryDetailsAddress[type="shipping"]'))
      ).toMatchSnapshot()
    })
    it('with paymentDetails', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          paymentDetails,
        },
      })
      expect(
        getTreeFor(wrapper.find('OrderHistoryDetailsPayment'))
      ).toMatchSnapshot()
    })
    it('with paymentDetails and deliveryMethod, deliveryDate, deliveryCarrier', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...initialProps,
        orderDetails: {
          paymentDetails,
          deliveryMethod: 'UK Standard up to 4 working days',
          deliveryDate: 'Monday 17 July 2017',
          deliveryCarrier: 'Parcelnet',
        },
      })
      expect(
        getTreeFor(wrapper.find('OrderHistoryDetailsDelivery'))
      ).toMatchSnapshot()
    })
    it('should not display the order status if it is a DDPOrderOnly', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        orderDetails: {
          status: true,
          isDDPOrder: true,
          orderLines: [
            {
              lineNo: '02J50LBLK',
              name: 'MOTO Hook & Eye Joni Jeans',
              size: 'W2430',
              colour: 'BLACK',
              imageUrl:
                'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS02J50LBLK_Small_F_1.jpg',
              quantity: 1,
              unitPrice: '52.00',
              discount: '',
              total: '52.00',
              nonRefundable: false,
            },
          ],
        },
      })

      expect(
        wrapper.find('.HistoryDetailsContainer-orderStatus').exists()
      ).toBe(false)
    })
    it('should display the default order status if it is not a DDPOrder only', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        orderDetails: {
          status: 'Your order has been sent to our warehouse to be picked.',
          isDDPOrder: true,
          orderLines,
        },
      })

      expect(
        wrapper.find('.HistoryDetailsContainer-orderStatus strong').text()
      ).toBe('Your order has been sent to our warehouse to be picked.')
    })
    it('should not display the delivery method if it is a DDPOrder', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        orderDetails: {
          isDDPOrder: true,
          paymentDetails,
          deliveryMethod: 'UK Standard up to 4 working days',
          deliveryDate: 'Monday 17 July 2017',
          deliveryCarrier: 'Parcelnet',
          orderLines: [
            {
              lineNo: '02J50LBLK',
              name: 'MOTO Hook & Eye Joni Jeans',
              size: 'W2430',
              colour: 'BLACK',
              imageUrl:
                'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS02J50LBLK_Small_F_1.jpg',
              quantity: 1,
              unitPrice: '52.00',
              discount: '',
              total: '52.00',
              nonRefundable: false,
            },
          ],
        },
      })
      expect(wrapper.find('OrderHistoryDetailsDelivery').exists()).toBe(false)
    })

    describe('Order returns', () => {
      const orderReturnsProps = {
        ...initialProps,
        isFeatureOrderReturnsEnabled: true,
        orderReturnUrl: 'https://topman.zigzag-demo.co.uk',
        orderDetails: {
          statusCode: 'D',
          orderId: '278hdhjhd',
          deliveryAddress: address,
        },
      }

      const orderReturnContainerClass = '.HistoryDetailsContainer-returns'

      it('Should not render - start a return button if isFeatureOrderReturnsEnabled set to false', () => {
        const { wrapper } = renderComponent({
          ...orderReturnsProps,
          isFeatureOrderReturnsEnabled: false,
        })
        expect(wrapper.find(orderReturnContainerClass).exists()).toBe(false)
      })

      it('Should render start a return button if the postcode from the address is within the United Kingdom', () => {
        const { wrapper } = renderComponent(orderReturnsProps)
        expect(wrapper.find(orderReturnContainerClass).exists()).toBe(true)
      })

      it('Should render the postcode and url within the href link with target = _blank', () => {
        const { wrapper } = mountRenderComponent(orderReturnsProps)
        expect(wrapper.find(orderReturnContainerClass).exists()).toBe(true)
        const hrefLink = wrapper.find(orderReturnContainerClass).find('a')
        expect(hrefLink.prop('href')).toContain('&DeliveryPostcode=W1C 1DB')
        expect(hrefLink.find('a').prop('href')).toContain(
          orderReturnsProps.orderDetails.orderId
        )
        expect(hrefLink.prop('target')).toBe('_blank')
      })

      it('Should not render button if there is no order returns link ', () => {
        const { wrapper } = renderComponent({
          ...orderReturnsProps,
          orderReturnUrl: '',
        })
        expect(wrapper.find(orderReturnContainerClass).exists()).toBe(false)
      })

      describe('Valid countries', () => {
        it('Should not render start a return button if the post code or country is not from United Kingdom (excluding Guernsey or Jersey)', () => {
          const { wrapper } = renderComponent({
            ...orderReturnsProps,
            orderDetails: {
              orderId: '32323232',
              deliveryAddress: {
                name: 'Mr Elvis Presley',
                address1: 'Wallis',
                address2: 'Vegas',
                address3: 'Baby',
                address4: '2332',
                country: 'France',
              },
            },
          })
          expect(wrapper.find(orderReturnContainerClass).exists()).toBe(false)
        })

        it('Should render the returns button if the country is Jersey', () => {
          const { wrapper } = renderComponent({
            ...orderReturnsProps,
            orderDetails: {
              isOrderFullyRefunded: false,
              statusCode: 'D',
              orderId: '32323232',
              deliveryAddress: {
                name: 'Mr Elvis Presley',
                address1: 'Wallis',
                address2: 'Forest gump road',
                address3: 'Baby',
                address4: 'JE2 4WE',
                country: 'Jersey',
              },
            },
          })
          expect(wrapper.find(orderReturnContainerClass).exists()).toBe(true)
        })

        it('Should render the returns button if the country is Guernsey', () => {
          const { wrapper } = renderComponent({
            ...orderReturnsProps,
            orderDetails: {
              isOrderFullyRefunded: false,
              statusCode: 'D',
              orderId: '32323232',
              deliveryAddress: {
                name: 'Mr Elvis Presley',
                address1: 'Wallis',
                address2: 'Forest gump road',
                address3: 'Baby',
                address4: 'GY1 1WF',
                country: 'Guernsey',
              },
            },
          })

          expect(wrapper.find(orderReturnContainerClass).exists()).toBe(true)
        })
      })

      describe('isOrderFullyRefunded + orderStatus', () => {
        it('Should not render the button if the orderStatus does not allow to start a return', () => {
          /**
           * M - order placed
           * C - order placed
           * W - order on hold
           * G - order shipment delayed
           * N - order payment pending approval
           * FLD - order payment failed
           * s - order partially shipped
           * L - order - low stock
           * r - item returned
           * i - parcel ready for collection
           */
          const orderStatusNotAllowed = [
            'M',
            'C',
            'W',
            'G',
            'N',
            'FLD',
            's',
            'L',
            'r',
            'i',
          ]
          orderStatusNotAllowed.forEach((status) => {
            const orderReturnsProps = {
              ...initialProps,
              isFeatureOrderReturnsEnabled: true,
              orderReturnUrl: 'https://topman.zigzag-demo.co.uk',
              orderDetails: {
                isOrderFullyRefunded: false,
                orderId: '278hdhjhd',
                deliveryAddress: address,
                statusCode: status,
              },
            }
            const { wrapper } = renderComponent(orderReturnsProps)
            expect(wrapper.find('StartAReturnButton').length).toBeFalsy()
          })
        })

        it('Should render the button if the orderStatus allows a return cta and order not fully refunded', () => {
          /**
           * S - Order shipped
           * D - Order payment settled
           * c - Parcel collected by customer
           * */
          const allowedReturnOnStatus = ['S', 'D', 'c']
          allowedReturnOnStatus.forEach((status) => {
            const orderReturnsProps = {
              ...initialProps,
              isFeatureOrderReturnsEnabled: true,
              orderReturnUrl: 'https://topman.zigzag-demo.co.uk',
              orderDetails: {
                isOrderFullyRefunded: false,
                orderId: '278hdhjhd',
                deliveryAddress: address,
                statusCode: status,
              },
            }
            const { wrapper } = renderComponent(orderReturnsProps)
            expect(wrapper.find('StartAReturnButton').length).toBeTruthy()
          })
        })

        it('should not render the button if order is fully refunded, regardless of order status', () => {
          const orderReturnsProps = {
            ...initialProps,
            isFeatureOrderReturnsEnabled: true,
            orderReturnUrl: 'https://topman.zigzag-demo.co.uk',
            orderDetails: {
              isOrderFullyRefunded: true,
              orderId: '278hdhjhd',
              deliveryAddress: address,
              statusCode: 'D',
            },
          }
          const { wrapper } = renderComponent(orderReturnsProps)
          expect(wrapper.find('StartAReturnButton').length).toBeFalsy()
        })
      })
    })

    describe('UK Track My Orders Only', () => {
      describe('if FEATURE_TRACK_ORDERS enabled', () => {
        describe('UK Single Shipments', () => {
          describe('No Tracking Available ', () => {
            it('Should render button NOT YET DISPATCHED if tracking number is not available', () => {
              const orderLinesSortedByTracking = sortOrdersByTrackingNumber(
                orderLines
              )
              const orderTrackMyReturnsProps = {
                ...initialProps,
                isFeatureTrackMyOrdersEnabled: true,
                orderDetails: {
                  deliveryType: 'H',
                  orderId: '278hdhjhd',
                  deliveryAddress: address,
                  orderLines,
                  orderLinesSortedByTracking,
                },
              }

              const { wrapper } = mountRenderComponent(orderTrackMyReturnsProps)
              const orderItemsWithNoTracking = wrapper.find(
                '.order-items-no-tracking'
              )
              expect(orderItemsWithNoTracking.exists()).toBeTruthy()
              expect(orderItemsWithNoTracking.find('OrderItem').length).toEqual(
                2
              )
              expect(wrapper.find('NotYetDispatchedButton').exists()).toBe(true)
            })
          })

          describe('UK Tracking Available', () => {
            it('Should not render button TRACK MY ORDER for non-UK countries', () => {
              const orderWithTrackingNumber = {
                lineNo: '26B07MOCH',
                name: 'PETITE Knot Front Top',
                size: '4',
                colour: 'Ochre',
                imageUrl:
                  'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
                quantity: 1,
                unitPrice: '29.00',
                discount: '',
                total: '29.00',
                nonRefundable: false,
                trackingNumber: '12345',
                retailStoreTrackingUrl: 'url.com',
              }

              const orderTrackMyReturnsProps = {
                ...initialProps,
                isFeatureTrackMyOrdersEnabled: true,
                orderDetails: {
                  orderId: '278hdhjhd',
                  deliveryAddress: { ...address, country: 'Tongo' },
                  orderLines: [...orderLines, orderWithTrackingNumber],
                },
              }

              const { wrapper } = renderComponent(orderTrackMyReturnsProps)
              const orderItemsWithTracking = wrapper.find(
                '.order-items-tracking'
              )
              const orderItemTrackMyButton = wrapper.find('TrackMyOrderButton')
              const orderHistoryList = wrapper.find(
                '.HistoryDetailsContainer-list'
              )

              expect(orderItemsWithTracking.exists()).toBeFalsy()
              expect(orderItemsWithTracking.find('OrderItem')).toHaveLength(0)
              expect(orderItemTrackMyButton.exists()).toBeFalsy()
              expect(orderHistoryList.exists()).toBeTruthy()
              expect(orderHistoryList.find('OrderItem')).toHaveLength(3)
            })
          })

          it('DDP: Should not render any buttons when the order item is just DDP product only', () => {
            const orderWithTrackingNumber = {
              lineNo: '26B07MOCH',
              name: 'PETITE Knot Front Top DDP',
              size: '4',
              colour: 'Ochre',
              imageUrl:
                'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
              quantity: 1,
              unitPrice: '29.00',
              discount: '',
              total: '29.00',
              nonRefundable: false,
              isDDPProduct: true,
            }

            const orders = [orderWithTrackingNumber]
            const orderLinesSortedByTracking = sortOrdersByTrackingNumber(
              orders
            )

            const orderTrackMyReturnsProps = {
              ...initialProps,
              isFeatureTrackMyOrdersEnabled: true,
              orderDetails: {
                orderId: '278hdhjhd',
                deliveryAddress: { ...address },
                orderLines: orders,
                orderLinesSortedByTracking,
              },
            }

            const { wrapper } = mountRenderComponent(orderTrackMyReturnsProps)
            expect(wrapper.find('.order-items-tracking').exists()).toBe(false)
            expect(wrapper.find('.order-items-ddp').exists()).toBe(true)
            expect(wrapper.find('TrackMyOrderButton').exists()).toBe(false)
            expect(wrapper.find('NotYetDispatchedButton').exists()).toBe(false)
          })
        })

        describe('UK Multiple Shipments', () => {
          it('Should render button TRACK MY ORDER if there is at least one tracking tracking number', () => {
            const orderWithTrackingNumber = {
              lineNo: '26B07trackingno',
              name: 'PETITE Knot Front Top',
              size: '4',
              colour: 'Ochre',
              imageUrl:
                'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
              quantity: 1,
              unitPrice: '29.00',
              discount: '',
              total: '29.00',
              nonRefundable: false,
              trackingNumber: '12345',
              retailStoreTrackingUrl: 'http://navar.com',
              trackingAvailable: true,
            }

            const orders = [...orderLines, orderWithTrackingNumber]
            const orderLinesSortedByTracking = sortOrdersByTrackingNumber(
              orders
            )

            const orderTrackMyReturnsProps = {
              ...initialProps,
              isFeatureTrackMyOrdersEnabled: true,
              orderDetails: {
                orderId: '278hdhjhd',
                deliveryAddress: { ...address, country: 'United Kingdom' },
                orderLines: orders,
                orderLinesSortedByTracking,
              },
            }

            const { wrapper } = mountRenderComponent(orderTrackMyReturnsProps)
            const orderItemsWithTracking = wrapper.find('.order-items-tracking')
            const orderItemTrackMyButton = wrapper
              .find('.Button--trackOrder.enabled')
              .first()
            const orderItemsWithNoTracking = wrapper.find(
              '.order-items-no-tracking'
            )
            expect(orderItemsWithTracking.length).toEqual(1)
            expect(orderItemsWithNoTracking.find('OrderItem').length).toEqual(2)
            expect(orderItemsWithTracking.find('OrderItem')).toHaveLength(1)
            expect(orderItemTrackMyButton.exists()).toBeTruthy()
            expect(orderItemTrackMyButton.find('a').prop('target')).toEqual(
              '_blank'
            )
            expect(orderItemTrackMyButton.find('a').prop('href')).toContain(
              orderWithTrackingNumber.retailStoreTrackingUrl
            )
          })

          it('Should render multiple TRACK MY ORDER buttons && render NOT YET DISPATCH button', () => {
            const orderWithTrackingNumber = [
              {
                lineNo: '26B07MOCH',
                name: 'PETITE Knot Front Top',
                size: '4',
                colour: 'Ochre',
                imageUrl:
                  'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
                quantity: 1,
                unitPrice: '29.00',
                discount: '',
                total: '29.00',
                nonRefundable: false,
                trackingNumber: '12345',
                retailStoreTrackingUrl: 'http://navar.com/26B07MOCH',
                trackingAvailable: true,
              },
              {
                lineNo: '26B072323CH',
                name: 'PETITE T Shirt angle',
                size: '4',
                colour: 'Ochre',
                imageUrl:
                  'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
                quantity: 1,
                unitPrice: '29.00',
                discount: '',
                total: '29.00',
                nonRefundable: false,
                trackingNumber: '32211',
                retailStoreTrackingUrl: 'http://navar.com/hgjhgjg',
                trackingAvailable: true,
              },
            ]

            const orders = [...orderLines, ...orderWithTrackingNumber]
            const orderLinesSortedByTracking = sortOrdersByTrackingNumber(
              orders
            )
            const orderTrackMyReturnsProps = {
              ...initialProps,
              isFeatureTrackMyOrdersEnabled: true,
              orderDetails: {
                deliveryType: 'H',
                orderId: '278hdhjhd',
                deliveryAddress: { ...address, country: 'United Kingdom' },
                orderLines: orders,
                orderLinesSortedByTracking,
              },
            }

            const { wrapper } = mountRenderComponent(orderTrackMyReturnsProps)
            const orderItemsWithNoTracking = wrapper.find(
              '.order-items-no-tracking'
            )
            const orderItemTracking = wrapper.find('.order-items-tracking')
            const orderItemTrackMyButton = orderItemTracking.find(
              'TrackMyOrderButton'
            )
            expect(orderItemTracking.length).toEqual(1)
            expect(orderItemTrackMyButton.length).toEqual(2)
            expect(
              orderItemsWithNoTracking.find('NotYetDispatchedButton').exists()
            ).toBeTruthy()
          })

          it('Should render, items with - Track my order, Not yet dispatched and DDP', () => {
            const orderWithTrackingNumberAndDDP = [
              {
                lineNo: '26B07MOCH',
                name: 'PETITE Knot Front Top',
                size: '4',
                colour: 'Ochre',
                imageUrl:
                  'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
                quantity: 1,
                unitPrice: '29.00',
                discount: '',
                total: '29.00',
                nonRefundable: false,
                isDDPProduct: true,
                trackingAvailable: true,
              },
              {
                lineNo: '26B072323CH',
                name: 'PETITE T Shirt angle',
                size: '4',
                colour: 'Ochre',
                imageUrl:
                  'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
                quantity: 1,
                unitPrice: '29.00',
                discount: '',
                total: '29.00',
                nonRefundable: false,
                trackingNumber: '32211',
                retailStoreTrackingUrl: 'http://navar.com/26B072323CH',
                trackingAvailable: true,
              },
              {
                lineNo: '26B072323CH',
                name: 'DDP',
                size: '4',
                colour: 'Ochre',
                imageUrl:
                  'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS26B07MOCH_Small_F_1.jpg',
                quantity: 1,
                unitPrice: '29.00',
                discount: '',
                total: '29.00',
                nonRefundable: false,
                isDDPProduct: true,
                trackingAvailable: false,
              },
            ]

            const orders = [...orderLines, ...orderWithTrackingNumberAndDDP]
            const orderLinesSortedByTracking = sortOrdersByTrackingNumber(
              orders
            )
            const orderTrackMyReturnsProps = {
              ...initialProps,
              isFeatureTrackMyOrdersEnabled: true,
              orderDetails: {
                orderId: '278hdhjhd',
                deliveryAddress: { ...address, country: 'United Kingdom' },
                orderLines: orders,
                orderLinesSortedByTracking,
              },
            }

            const { wrapper } = mountRenderComponent(orderTrackMyReturnsProps)
            const orderItemsWithNoTracking = wrapper.find(
              '.order-items-no-tracking'
            )
            const orderItemsTracking = wrapper.find('.order-items-tracking')
            const orderItemsDdp = wrapper.find('.order-items-ddp')

            expect(orderItemsTracking.find('OrderItem').length).toEqual(2)
            expect(orderItemsWithNoTracking.find('OrderItem').length).toEqual(2)
            expect(orderItemsDdp.find('OrderItem').length).toEqual(1)
          })
        })
      })

      describe('if FEATURE_TRACK_ORDERS not enabled', () => {
        it('Should render list of items like default', () => {
          const orderTrackMyReturnsProps = {
            ...initialProps,
            isFeatureTrackMyOrdersEnabled: false,
            orderDetails: {
              orderId: '278hdhjhd',
              deliveryAddress: address,
              orderLines,
            },
          }

          expect(
            renderComponent(orderTrackMyReturnsProps).getTree()
          ).toMatchSnapshot()
        })
      })
    })
  })
})
