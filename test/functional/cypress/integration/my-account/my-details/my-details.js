import MyDetails from '../../../page-objects/my-account/my-details/MyDetails.page'
import MyAccountStart from '../../../page-objects/my-account/MyAccount.Page'
import accountProfile from './../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import { isMobileLayout } from '../../../lib/helpers'

const myDetails = new MyDetails()
const myAccountStart = new MyAccountStart()

const urls = {
  myAccount: '/my-account',
  myDetails: '/my-account/my-details',
  editDetails: '/my-account/details/edit',
}

if (isMobileLayout()) {
  describe('My Account - My Details', () => {
    beforeEach(() => {
      myDetails.mocksForAccountAndLogin({
        setAuthStateCookie: 'yes',
        getAccount: accountProfile,
        putAccountShort: accountProfile,
      })
    })

    describe('Navigation', () => {
      beforeEach(() => {
        cy.visit(urls.myAccount)
        myAccountStart.clickNavigation(urls.myDetails)
      })

      it('should retain my details when I reload the page', () => {
        cy.url().should('include', urls.myDetails)
        cy.reload()
        cy.url().should('include', urls.myDetails)

        myDetails.assertAllInputHasValuesGreaterThan()
      })

      describe('User navigates to edit user details', () => {
        it('should display delivery/billing forms without `AddressForm--multiColumn` class', () => {
          cy.visit(urls.editDetails)
          cy.get('.AddressFormDetails--billingMCD').should('be.visible')
          cy.get('.AddressFormDetails--deliveryMCD').should('be.visible')
          cy.get('.AddressForm').should('be.visible')
          cy.get('.AddressForm--multiColumn').should('not.be.visible')
        })
      })
    })

    describe('Updating Existing Details', () => {
      beforeEach(() => {
        cy.visit(urls.myDetails)
      })

      it('Update my existing details', () => {
        myDetails
          .typeFirstName('Micky')
          .typeLastName('Tan')
          .typeEmailAddress('micky.tan@mock.com')
          .clickSaveChanges()
          .assertMessageIsSuccessful()
      })
    })

    describe('Validation', () => {
      beforeEach(() => {
        cy.visit(urls.myDetails)
      })

      it('should display an error message if first name is left empty', () => {
        myDetails
          .clearFirstName()
          .clickOutSide()
          .assertFirstNameFailedRequiredValidation()
      })

      it('should display an error message if last name is left empty', () => {
        myDetails
          .clearLastName()
          .clickOutSide()
          .assertLastNameFailedValidation()
      })

      it('should display error message if the user enters over 60 characters in first name input', () => {
        const name60Chars =
          'Hello my name is micky tan and i think we should not type in long sir names into the database'
        myDetails
          .typeFirstName(name60Chars)
          .clickOutSide()
          .assertFirstNameFailedRequiredValidation('Maximum characters is 60')
      })

      it('should display error message if the user enters over 60 characters in last name input', () => {
        const name60Chars =
          'Hello my name is micky tan and i think we should not type in long sir names into the database'
        myDetails
          .typeLastName(name60Chars)
          .clickOutSide()
          .assertLastNameFailedValidation('Maximum characters is 60')
      })

      it('should display error when entering invalid Email', () => {
        const invalidEmailAddress = 'hduiahuhatmock.com'
        myDetails
          .typeEmailAddress(invalidEmailAddress)
          .clickOutSide()
          .assertEmailNameFailedValidation()
      })

      it('should trigger an error if fields contain special characters', () => {
        const validationMessage = 'Please remove special characters'
        myDetails
          .typeFirstName('ânt')
          .typeLastName('€âvis')
          .clickOutSide()
          .assertSpecialCharacterValidation('be.visible', validationMessage)
      })
    })
  })
}
