import testComponentHelper from 'test/unit/helpers/test-component'
import OrderCompleteDelivery from '../OrderCompleteDelivery'

const store = {
  storeId: 'S14121',
  address: {
    line1: '30 Fauconberg Road',
    line2: '',
    city: 'Chiswick',
    postcode: 'W4 3JY',
    country: 'United Kingdom',
  },
  openingHours: {
    monday: '07:00-23:00',
    tuesday: '07:00-23:00',
    wednesday: '07:00-23:00',
    thursday: '07:00-23:00',
    friday: '07:00-23:00',
    saturday: '07:00-23:00',
    sunday: '07:00-22:00',
  },
}

const storeWithNoHours = {
  storeId: 'S14121',
  address: {
    line1: '30 Fauconberg Road',
    line2: '',
    city: 'Chiswick',
    postcode: 'W4 3JY',
    country: 'United Kingdom',
  },
  openingHours: {},
}

const storeAddress = {
  address1: 'HERMES - Grove Park Wine',
  name: 'Test Test',
  country: 'United Kingdom',
  address2: '30 Fauconberg Road',
  address3: 'Chiswick',
  address4: 'W4 3JY',
}

const initialProps = {
  brandName: 'topshop',
  ddpDefaultName: 'Topshop Premier',
  deliveryDate: 'Wednesday 10 June 2020',
  orderCompleted: {
    orderId: 3464616,
    deliveryCarrier: 'Standard',
    deliveryAddress: {
      address1: 'Arcadia Group Ltd',
      name: 'Test Test',
      country: 'United Kingdom',
      address2: 'Colegrave House, 70 Berners Street',
      address3: 'LONDON',
      address4: 'W1T 3NL',
    },
    guestUserEmail: '',
    isGuestOrder: false,
  },
  isDDPStandaloneOrderCompleted: false,
  isCollectFromOrder: false,
  isDDPOrderCompleted: false,
  logoVersion: '19102018',
  minLaptop: true,
  stores: [],
}

const confirmationCopy = {
  regular: `You'll get an order confirmation email shortly.`,
  guest: `You'll get an order confirmation email shortly to`,
}

describe('<OrderCompleteDelivery />', () => {
  const renderComponent = testComponentHelper(OrderCompleteDelivery)

  describe('@render', () => {
    describe('Regular order', () => {
      const {
        deliveryDate,
        brandName,
        logoVersion,
        orderCompleted,
      } = initialProps
      const component = renderComponent(initialProps)
      const { wrapper } = component

      it('should show components for regular order', () => {
        expect(component.getTree()).toMatchSnapshot()
      })
      it('should show the correct confirmation email message', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-confirmationMail').text()
        ).toBe(confirmationCopy.regular)
      })
      it('should show the correct delivery estimate', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-estimatedDelivery').text()
        ).toBe(deliveryDate)
      })
      it('should show the correct icon', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-deliveryIcon').props().src
        ).toBe(
          `/assets/${brandName}/images/lorry-icon.svg?version=${logoVersion}`
        )
      })
      it('should show the correct number address lines', () => {
        const output = Object.keys(orderCompleted.deliveryAddress).length
        expect(
          wrapper
            .find('.OrderCompleteDelivery-address')
            .childAt(1)
            .map((node) => node.text())[0]
            .split('><').length
        ).toBe(output)
      })
    })
    describe('Guest checkout order', () => {
      const guestUserEmail = 'guest.user@arcadia.co.uk'
      const component = renderComponent({
        ...initialProps,
        orderCompleted: {
          ...initialProps.orderCompleted,
          guestUserEmail,
          isGuestOrder: true,
        },
      })
      const { wrapper } = component
      it('should show the guest checkout components', () => {
        expect(component.getTree()).toMatchSnapshot()
      })
      it('should show the correct confirmation email message', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-confirmationMail').text()
        ).toBe(confirmationCopy.guest)
      })
      it('should show guest checkout email', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-guestUserEmail').text()
        ).toBe(guestUserEmail)
      })
    })
    describe('DDP order', () => {
      const { ddpDefaultName } = initialProps
      const component = renderComponent({
        ...initialProps,
        isDDPOrderCompleted: true,
      })
      const { wrapper } = component

      it('should show DDP subscription section', () => {
        expect(component.getTree()).toMatchSnapshot()
      })
      it('should show DDP subscription wording', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-ddpSubscription').text()
        ).toContain(`You can manage your ${ddpDefaultName} subscription in`)
      })
    })
    describe('DDP standalone order', () => {
      const component = renderComponent({
        ...initialProps,
        isDDPStandaloneOrderCompleted: true,
      })
      const { wrapper } = component

      it('should match standalone DDP', () => {
        expect(component.getTree()).toMatchSnapshot()
      })
      it('should not show collect from section', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-collectFrom').exists()
        ).toBeFalsy()
      })
      it('should not show address', () => {
        expect(
          wrapper.find('.OrderCompleteDelivery-addressContainer').exists()
        ).toBeFalsy()
      })
    })
    describe('Collect from order', () => {
      describe('Desktop', () => {
        describe('The store has opening times', () => {
          const { brandName, logoVersion } = initialProps
          const { monday: week, saturday, sunday } = store.openingHours
          const component = renderComponent({
            ...initialProps,
            isCollectFromOrder: true,
            orderCompleted: {
              ...initialProps.orderCompleted,
              deliveryAddress: storeAddress,
              deliveryCarrier: 'Retail Store Collection',
            },
            stores: [store],
          })
          const { wrapper } = component

          it('should show opening times', () => {
            expect(component.getTree()).toMatchSnapshot()
          })
          it('should show the desktop wording', () => {
            expect(
              wrapper.find('.OrderCompleteDelivery-openingHoursTitle').text()
            ).toBe('Store opening times')
          })
          it('should show collect within wording', () => {
            expect(
              wrapper.find('.OrderCompleteDelivery-collectWithin').exists()
            ).toBeTruthy()
          })
          it('should show the correct icon', () => {
            expect(
              wrapper.find('.OrderCompleteDelivery-deliveryIcon').props().src
            ).toBe(
              `/assets/${brandName}/images/hermes-icon.svg?version=${logoVersion}`
            )
          })
          it('should show week days and week ends times', () => {
            expect(
              wrapper
                .find('.OrderCompleteDelivery--store')
                .childAt(1)
                .text()
            ).toBe(`Monday to Friday: ${week}`)

            expect(
              wrapper
                .find('.OrderCompleteDelivery--store')
                .childAt(2)
                .text()
            ).toBe(`Saturday: ${saturday}`)

            expect(
              wrapper
                .find('.OrderCompleteDelivery--store')
                .childAt(3)
                .text()
            ).toBe(`Sunday: ${sunday}`)
          })
        })

        describe('The store does not have opening hours', () => {
          const component = renderComponent({
            ...initialProps,
            isCollectFromOrder: true,
            orderCompleted: {
              ...initialProps.orderCompleted,
              deliveryAddress: storeAddress,
              deliveryCarrier: 'Retail Store Collection',
            },
            stores: [storeWithNoHours],
          })
          const { wrapper } = component

          it('should not show opening times', () => {
            expect(component.getTree()).toMatchSnapshot()
          })
          it('should not show week days and week ends times', () => {
            expect(
              wrapper.find('.OrderCompleteDelivery--store').exists()
            ).toBeFalsy()
          })
        })

        describe('There is no estimate delivery', () => {
          const component = renderComponent({
            ...initialProps,
            deliveryDate: '',
          })
          const { wrapper } = component
          it('should not display delivery estimation', () => {
            expect(component.getTree()).toMatchSnapshot()
            expect(
              wrapper.find('.OrderCompleteDelivery-collectFrom').exists()
            ).toBeFalsy()
          })
        })

        describe('`postcode` and `address4` mismatch', () => {
          const component = renderComponent({
            ...initialProps,
            isCollectFromOrder: true,
            orderCompleted: {
              ...initialProps.orderCompleted,
              deliveryCarrier: 'Retail Store Collection',
            },
            stores: [store],
          })
          const { wrapper } = component
          it('should not display opening times', () => {
            expect(component.getTree()).toMatchSnapshot()
            expect(
              wrapper.find('.OrderCompleteDelivery-storeContainer').exists()
            ).toBeFalsy()
          })
        })
      })

      describe('Non desktop', () => {
        const component = renderComponent({
          ...initialProps,
          isCollectFromOrder: true,
          minLaptop: false,
          orderCompleted: {
            ...initialProps.orderCompleted,
            deliveryAddress: storeAddress,
            deliveryCarrier: 'Retail Store Collection',
          },
          stores: [store],
        })
        const { wrapper } = component

        it('should show opening times', () => {
          expect(component.getTree()).toMatchSnapshot()
        })
        it('should show the non desktop wording', () => {
          expect(
            wrapper.find('.OrderCompleteDelivery-openingHoursTitle').text()
          ).toBe('Opening hours')
        })
      })
    })
  })
})
