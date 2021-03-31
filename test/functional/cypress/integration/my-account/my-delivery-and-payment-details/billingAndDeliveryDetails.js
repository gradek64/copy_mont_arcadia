import currentCustomerDetails from '../../../fixtures/my-account/secondCustomerDetails.json'
import customerDetails from '../../../fixtures/my-account/customerDetails.json'
import MyAccountCheckoutDetails from '../../../page-objects/my-account/my-delivery-and-payment/MyAccountCheckoutDetails.page'
import findAddress from '../../../fixtures/my-account/findAddress.json'
import returnAddressResult from '../../../fixtures/my-account/returnAddressResult.json'
import accountProfile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import { isMobileLayout } from '../../../lib/helpers'

const deliveryPaymentPage = new DeliveryPaymentPage()
const myAccountDetails = new MyAccountCheckoutDetails()
const urls = {
  myAccount: '/my-account/details',
  editAccount: '/my-account/details/edit',
}
const accountWithPaypalAsSavedMethod = {
  ...accountProfile,
  creditCard: {
    type: 'PYPAL',
    cardNumberHash: '',
    cardNumberStar: '',
    expiryMonth: '',
    expiryYear: '',
  },
}

if (isMobileLayout()) {
  describe('My account - change address and billing details', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        setAuthStateCookie: 'yes',
        getAccount: currentCustomerDetails,
        putCustomerDetails: customerDetails,
        searchAddress: findAddress,
        searchAddressResult: returnAddressResult,
      })
      cy.visit(urls.myAccount)
      myAccountDetails.assertUrlIsOnPage(urls.myAccount)
    })

    describe('Billing details update', () => {
      it('Should allow the user to update the billing details manually', () => {
        myAccountDetails
          .changeAddressDetails('billing')
          .assertBillingPreviewAddressLine1(
            customerDetails.billingDetails.address.address1
          )
          .assertSavedChangesMessage()
      })
    })

    describe('Delivery details update', () => {
      it('Should allow the user to update the delivery details manually', () => {
        myAccountDetails
          .changeAddressDetails('delivery')
          .assertDeliveryPreviewAddressLine1(
            customerDetails.deliveryDetails.address.address1
          )
      })

      it('Should allow the user to update the Delivery details via the find address', () => {
        myAccountDetails
          .changeDeliveryDetails()
          .findAddress()
          .addCardNumber()
          .saveDetails()
          .assertDeliveryPreviewAddressLine1(
            customerDetails.deliveryDetails.address.address1
          )
      })
    })

    describe('Save edits', () => {
      it('Should save updates after page refresh', () => {
        myAccountDetails
          .changeDeliveryDetails()
          .assertUrlIsOnPage(urls.editAccount)
        cy.reload()
        myAccountDetails.assertBillingAddressFormValuesGreaterThan(1)
      })
    })

    describe('Validation', () => {
      beforeEach(() => {
        myAccountDetails
          .changeDeliveryDetails()
          .assertUrlIsOnPage(urls.editAccount)
      })

      const validationMessage = 'Maximum characters is 60'
      const Name60Chars =
        'Hello my name is micky tan and i think we should not type in long sir names into the database'

      it('Should validate if billing First name is over 60 chars', () => {
        myAccountDetails
          .typeBillingFirstName(Name60Chars)
          .clickBillingLastName()
          .assertFirstNameFailedValidation('billingMCD', validationMessage)
      })

      it('Should validate if billing Last name is over 60 chars', () => {
        myAccountDetails
          .typeBillingLastName(Name60Chars)
          .clickBillingFirstName()
          .assertLastNameFailedValidation('billingMCD', validationMessage)
      })

      it('Should validate if delivery name is over 60 chars', () => {
        myAccountDetails
          .typeDeliveryLastName(Name60Chars)
          .clickDeliveryFirstName()
          .assertLastNameFailedValidation('deliveryMCD', validationMessage)
      })

      it('should trigger an error if fields contain special characters', () => {
        const validationMessage = 'Please remove special characters'
        myAccountDetails
          .clearSpecialChars()
          .enterDetailsSpecialChar()
          .assertSpecialCharacterValidation('be.visible', validationMessage)
      })
    })
    describe('Payment edit validations', () => {
      beforeEach(() => {
        deliveryPaymentPage.mocksForCheckout({
          setAuthStateCookie: 'yes',
          getAccount: accountWithPaypalAsSavedMethod,
        })
        cy.visit('/my-account/details')
      })

      it('should return error when saving details without entering credit card number', () => {
        myAccountDetails
          .clickChangePaymentMethod()
          .selectPaymentMethod(1)
          .clickSavePaymentChanges()
        deliveryPaymentPage.checkInputValidationMessage(
          0,
          'A 16 digit card number is required'
        )
      })
    })
  })
}
