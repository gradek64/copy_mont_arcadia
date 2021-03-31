import MockDate from 'mockdate'
import {
  isCard,
  getPaymentMethodFromValue,
  yourDetailsExist,
  setActiveStep,
  updateCountryForChannelIslands,
  getUnconfirmedDDPUser,
} from '../utils'
import { paymentMethods } from 'test/unit/lib/checkout-mocks'

const mockFnisCard = jest.fn().mockImplementation(isCard)
const mockFnGetPay = jest.fn().mockImplementation(getPaymentMethodFromValue)

describe('Checkout utils', () => {
  it('isCard return true if receive visa credit card', () => {
    const test1 = mockFnisCard('VISA', paymentMethods)
    expect(mockFnisCard).toHaveBeenCalledTimes(1)
    expect(test1).toBe(true)
  })

  it('getPaymentMethodFromValue return visa details', () => {
    const test1 = mockFnGetPay('VISA', paymentMethods)
    expect(test1.type).toBe('CARD')
    expect(test1.label).toBe('Visa')
    expect(mockFnisCard).toHaveBeenCalledTimes(1)
  })

  describe('yourDetailsExist', () => {
    const fakeForms = {
      forms: {
        checkout: {
          yourDetails: {
            fields: {
              title: { value: '' },
              firstName: { value: null },
              lastName: { value: null },
              telephone: { value: null },
            },
          },
        },
      },
    }

    const trueForms = {
      forms: {
        checkout: {
          yourDetails: {
            fields: {
              title: { value: 'dr' },
              firstName: { value: 'Enzo' },
              lastName: { value: 'dono' },
              telephone: { value: '' },
            },
          },
        },
      },
    }
    it('should return false if yourDetails does not exist ', () => {
      expect(yourDetailsExist(fakeForms)).toBeFalsy()
    })
    it('should return true if yourDetails does exist ', () => {
      expect(yourDetailsExist(trueForms)).toBeTruthy()
    })
  })

  describe('updateCountryForChannelIslands', () => {
    it('should update the country to Guernsey when a Guernsey postcode is provided while in the United Kingdom', () => {
      const updateCountry = updateCountryForChannelIslands({
        postcode: 'GY99 1AB',
        country: 'United Kingdom',
      })

      expect(updateCountry).toBe('Guernsey')
    })

    it('should update the country to Jersey when a Jersey postcode is provided while in the United Kingdom', () => {
      const updateCountry = updateCountryForChannelIslands({
        postcode: 'JE99 1AB',
        country: 'United Kingdom',
      })

      expect(updateCountry).toBe('Jersey')
    })

    it('should not update the country for any other postcode while in the United Kingdom', () => {
      const updateCountry = updateCountryForChannelIslands({
        postcode: 'SF99 1AB',
        country: 'United Kingdom',
      })

      expect(updateCountry).toBeNull()
    })

    it('should not update the country Guernsey or Jersey while not in the United Kingdom', () => {
      const updateCountryGeurnsey = updateCountryForChannelIslands({
        postcode: 'GY99 1AB',
        country: 'Guernsey',
      })

      expect(updateCountryGeurnsey).toBeNull()

      const updateCountryJersey = updateCountryForChannelIslands({
        postcode: 'JE99 1AB',
        country: 'Jersey',
      })

      expect(updateCountryJersey).toBeNull()
    })
  })

  describe('setActiveStep', () => {
    describe('New user is on /checkout/payment and the passed object is /checkout/payment', () => {
      it('should set /checkout/payment as active', () => {
        const output = setActiveStep('/checkout/payment', {
          title: 'Payment',
          url: '/checkout/payment',
        })

        expect(output).toEqual({
          active: true,
          title: 'Payment',
          url: '/checkout/payment',
        })
      })
    })

    describe('Guest user is on /guest/checkout/delivery but passed object is /guest/checkout/payment', () => {
      it('should set /guest/checkout/payment as inactive', () => {
        const output = setActiveStep('/guest/checkout/delivery', {
          title: 'Payment',
          url: '/guest/checkout/payment',
        })

        expect(output).toEqual({
          active: false,
          title: 'Payment',
          url: '/guest/checkout/payment',
        })
      })
    })
  })
})

describe('getUnconfirmedDDPUser', () => {
  beforeEach(() => {
    MockDate.set(new Date('2020-05-05T06:00:00'))
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should return unchanged user if no date provided', () => {
    const user = {
      isDDPUser: false,
    }
    expect(getUnconfirmedDDPUser(user)).toBe(user)
  })

  it('should return unchanged user if isDDPUser is already true', () => {
    const user = {
      isDDPUser: true,
      ddpEndDate: '4 May 2021',
    }
    expect(getUnconfirmedDDPUser(user)).toBe(user)
  })

  it('should return unchanged user if an invalid date is provided', () => {
    const user = {
      isDDPUser: false,
      ddpEndDate: 'invalid',
    }
    expect(getUnconfirmedDDPUser(user)).toBe(user)
  })

  it('should return unchanged user if ddpEndDate is in the past', () => {
    const user = {
      isDDPUser: false,
      ddpEndDate: '4 May 2020',
    }
    expect(getUnconfirmedDDPUser(user)).toBe(user)
  })

  it('should return user with isDDPUser set to true if ddpEndDate is in the future', () => {
    const user = {
      isDDPUser: false,
      ddpEndDate: '5 May 2021',
    }
    expect(getUnconfirmedDDPUser(user)).toEqual({
      isDDPUser: true,
      isDDPRenewable: false,
      ddpEndDate: '5 May 2021',
    })
  })

  describe('isDDPRenewable', () => {
    it('should set isDDPRenewable to true when isDDPUser is changed to true and ddpEndDate is less than 30 days away', () => {
      const user = {
        isDDPUser: false,
        ddpEndDate: '4 June 2020',
      }
      expect(getUnconfirmedDDPUser(user)).toEqual({
        isDDPUser: true,
        isDDPRenewable: true,
        ddpEndDate: '4 June 2020',
      })
    })
    it('should set isDDPRenewable to false when ddpEndDate is more than 30 days away', () => {
      const user = {
        isDDPUser: false,
        ddpEndDate: '5 June 2020',
      }
      expect(getUnconfirmedDDPUser(user)).toEqual({
        isDDPUser: true,
        isDDPRenewable: false,
        ddpEndDate: '5 June 2020',
      })
    })

    it('should set isDDPRenewable to false if isDDPUser, and isDDPRenewable is passed in as true and date is greater than 30 days away', () => {
      const user = {
        isDDPUser: true,
        isDDPRenewable: true,
        ddpEndDate: '5 July 2020',
      }
      expect(getUnconfirmedDDPUser(user)).toEqual({
        isDDPUser: true,
        isDDPRenewable: false,
        ddpEndDate: '5 July 2020',
      })
    })

    it('should return unchanged user if isDDPUser, and isDDPRenewable is passed in as true and date is less than 30 days away', () => {
      const user = {
        isDDPUser: true,
        isDDPRenewable: true,
        ddpEndDate: '4 May 2020',
      }
      expect(getUnconfirmedDDPUser(user)).toBe(user)
    })
  })

  it('should return additional properties that are passed in', () => {
    const user = {
      some: 'property',
      another: 'prop',
      isDDPUser: false,
      ddpEndDate: '5 May 2021',
    }
    expect(getUnconfirmedDDPUser(user)).toEqual({
      some: 'property',
      another: 'prop',
      isDDPRenewable: false,
      isDDPUser: true,
      ddpEndDate: '5 May 2021',
    })
  })
})
