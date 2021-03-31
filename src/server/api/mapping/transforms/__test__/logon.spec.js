import { omit } from 'ramda'
import logonTransform, {
  addressFragment,
  nameAndPhoneFragment,
  detailsFragment,
  creditCardFragment,
  extraLogonProperties,
} from '../logon'
import wcsLogonForm from '../../../../../../test/apiResponses/logon/wcs-LogonForm.json'
import monty from '../../../../../../test/apiResponses/logon/hapiMonty.json'

describe('logon transformer', () => {
  describe('addressFragment', () => {
    it('returns an address object setting properties to empty strings by default', () => {
      expect(
        addressFragment(wcsLogonForm.Account[0].billingDetails.address)
      ).toEqual(monty.billingDetails.address)
    })
    it('returns an address object omitting unnecessary properties', () => {
      expect(
        addressFragment(wcsLogonForm.Account[0].deliveryDetails.address)
      ).toEqual(monty.deliveryDetails.address)
    })
  })
  describe('nameAndPhoneFragment', () => {
    it('returns a nameAndPhone object', () => {
      expect(
        nameAndPhoneFragment(
          wcsLogonForm.Account[0].billingDetails.nameAndPhone
        )
      ).toEqual(monty.billingDetails.nameAndPhone)
    })
    it('returns a nameAndPhone object setting properties to empty strings by default', () => {
      expect(
        nameAndPhoneFragment(
          omit(
            ['lastName'],
            wcsLogonForm.Account[0].billingDetails.nameAndPhone
          )
        )
      ).toEqual(
        Object.assign({}, monty.billingDetails.nameAndPhone, { lastName: '' })
      )
    })
    it('returns a nameAndPhone object omitting unnecessary properties', () => {
      const nameAndPhone = wcsLogonForm.Account[0].billingDetails.nameAndPhone
      nameAndPhone.useless = 'Not needed'
      expect(nameAndPhoneFragment(nameAndPhone)).toEqual(
        monty.billingDetails.nameAndPhone
      )
    })
  })
  describe('detailsFragment', () => {
    it('returns a details object', () => {
      expect(detailsFragment(wcsLogonForm.Account[0].billingDetails)).toEqual(
        monty.billingDetails
      )
    })
    it('returns a details object where no addressDetailsId is present', () => {
      expect(detailsFragment(wcsLogonForm.Account[0].deliveryDetails)).toEqual(
        monty.deliveryDetails
      )
    })
    it("should simply pass the value of addressDetailsId if it can't be converted to an integer", () => {
      expect(detailsFragment({ addressDetailsId: 'foo' })).toEqual({
        address: {
          address1: '',
          address2: '',
          city: '',
          country: '',
          postcode: '',
          state: '',
        },
        addressDetailsId: 'foo',
        nameAndPhone: { firstName: '', lastName: '', telephone: '', title: '' },
      })
    })
  })
  describe('creditCardFragment', () => {
    it('returns a creditCardFragment', () => {
      expect(creditCardFragment(wcsLogonForm.Account[0].creditCard)).toEqual(
        monty.creditCard
      )
    })
  })
  describe('extraLogonProperties', () => {
    it('returns an object containing the extra properties on the logon', () => {
      expect(
        extraLogonProperties(
          monty.creditCard,
          monty.deliveryDetails,
          monty.billingDetails
        )
      ).toEqual({
        hasCardNumberHash: true,
        hasPayPal: false,
        hasDeliveryDetails: true,
        hasBillingDetails: true,
      })
      expect(extraLogonProperties({}, {}, {})).toEqual({
        hasCardNumberHash: false,
        hasPayPal: false,
        hasDeliveryDetails: false,
        hasBillingDetails: false,
      })
    })
  })
  describe('logonTransform', () => {
    const defaultLogonResponse = {
      basketItemCount: 0,
      billingDetails: {
        address: {
          address1: '',
          address2: '',
          city: '',
          country: '',
          postcode: '',
          state: '',
        },
        addressDetailsId: -1,
        nameAndPhone: {
          firstName: '',
          lastName: '',
          telephone: '',
          title: '',
        },
      },
      creditCard: {
        cardNumberHash: '',
        cardNumberStar: '',
        expiryMonth: '',
        expiryYear: '',
        type: '',
      },
      deliveryDetails: {
        address: {
          address1: '',
          address2: '',
          city: '',
          country: '',
          postcode: '',
          state: '',
        },
        addressDetailsId: -1,
        nameAndPhone: {
          firstName: '',
          lastName: '',
          telephone: '',
          title: '',
        },
      },
      email: '',
      exists: true,
      expId1: '',
      expId2: '',
      firstName: '',
      hasBillingDetails: false,
      hasCardNumberHash: false,
      hasDeliveryDetails: false,
      hasPayPal: false,
      lastName: '',
      subscriptionId: '',
      title: '',
      userTrackingId: '',
      version: '1.6',
    }
    it('transforms wcs responses into a logon object expected by monty', () => {
      expect(logonTransform(wcsLogonForm, true)).toEqual(monty)
    })
    it('return a default logon object if values cannot be found', () => {
      expect(logonTransform({}, true)).toEqual(defaultLogonResponse)
    })
    it('returns native app auth data if values are provided', () => {
      expect(
        logonTransform(
          {
            userId: 'userId',
            userToken: 'userToken',
          },
          true
        )
      ).toEqual({
        ...defaultLogonResponse,
        userId: 'userId',
        userToken: 'userToken',
      })
    })

    it('returns `isDDPUser` if value provided', () => {
      expect(logonTransform({ isDDPUser: false }, true)).toEqual({
        ...defaultLogonResponse,
        isDDPUser: false,
      })
    })

    it('returns `isDDPRenewable` if value provided', () => {
      expect(logonTransform({ isDDPRenewable: false }, true)).toEqual({
        ...defaultLogonResponse,
        isDDPRenewable: false,
      })
    })

    it('returns `ddpStartDate` if value provided', () => {
      expect(
        logonTransform({ ddpStartDate: '2018-07-23 18:57:30.659' }, true)
      ).toEqual({
        ...defaultLogonResponse,
        ddpStartDate: '2018-07-23 18:57:30.659',
      })
    })

    it('returns `ddpEndDate` if value provided', () => {
      expect(
        logonTransform({ ddpEndDate: '2019-01-23 18:57:30.659' }, true)
      ).toEqual({
        ...defaultLogonResponse,
        ddpEndDate: '2019-01-23 18:57:30.659',
      })
    })

    it('returns `wasDDPUser` if value provided', () => {
      expect(logonTransform({ wasDDPUser: true }, true)).toEqual({
        ...defaultLogonResponse,
        wasDDPUser: true,
      })
    })

    it('returns `ddpCurrentOrderCount` if value provided', () => {
      expect(logonTransform({ ddpCurrentOrderCount: 5 }, true)).toEqual({
        ...defaultLogonResponse,
        ddpCurrentOrderCount: 5,
      })
    })

    it('returns `ddpPreviousOrderCount` if value provided', () => {
      expect(logonTransform({ ddpPreviousOrderCount: 2 }, true)).toEqual({
        ...defaultLogonResponse,
        ddpPreviousOrderCount: 2,
      })
    })

    it('returns `ddpCurrentSavings` if value provided', () => {
      expect(logonTransform({ ddpCurrentSavings: 5.07 }, true)).toEqual({
        ...defaultLogonResponse,
        ddpCurrentSaving: 5.07,
      })
    })

    it('returns `ddpPreviousSaving` if value provided', () => {
      expect(logonTransform({ ddpPreviousSaving: 6.05 }, true)).toEqual({
        ...defaultLogonResponse,
        ddpPreviousSaving: 6.05,
      })
    })

    it('returns `ddpStandardPrice` if value provided', () => {
      expect(logonTransform({ ddpStandardPrice: 9.95 }, true)).toEqual({
        ...defaultLogonResponse,
        ddpStandardPrice: 9.95,
      })
    })

    it('returns `ddpExpressDeliveryPrice` if value provided', () => {
      expect(logonTransform({ ddpExpressDeliveryPrice: 6.0 }, true)).toEqual({
        ...defaultLogonResponse,
        ddpExpressDeliveryPrice: 6.0,
      })
    })

    it('should return the exponea expId1 and expId2 on logon', () => {
      const expId1 =
        'b145f248b6c72bf2cfa4fdb4eb4c5d102db5c6de1d2f110f3e77ab37d9b39602'
      const expId2 =
        '23fd686635a89cc75ea7635c00b9cf7a062aae4505488a99565557c94455ca6d'
      expect(logonTransform({ expId1, expId2 }, true)).toEqual({
        ...defaultLogonResponse,
        expId1,
        expId2,
      })
    })
  })
})
