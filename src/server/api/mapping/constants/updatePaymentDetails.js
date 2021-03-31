export const updateAccountQueryConstants = {
  ShippingCountryInList: 'true',
  callingForm: 'QuickCheckout',
  page: 'quickcheckout',
  errorViewName: 'ProfileFormView',
  URL:
    'LogonForm?shipping*=&billing*=&nickName*=&lastName*=&firstName*=&address*=&zipCode*=&city*=&state*=&country*=&phone1*=&phone2*=&pay_cardNumber*=',
  billing_errorViewName: 'ProfileFormView',
  shipping_errorViewName: 'ProfileFormView',
  primary: '0',
  dropDownAction: '0',
  isoCode: '',
  encryptedCCFlag: 'encryptedCCFlag',
  'submitButton.x': '41',
  'submitButton.y': '7',
}

export const addressFields = [
  {
    key: 'personTitle',
    name: 'title',
    path: 'nameAndPhone',
  },
  {
    name: 'firstName',
    path: 'nameAndPhone',
  },
  {
    name: 'lastName',
    path: 'nameAndPhone',
  },
  {
    key: 'phone1',
    path: 'nameAndPhone',
    name: 'telephone',
  },
  {
    name: 'country',
    path: 'address',
  },
  {
    name: 'address1',
    path: 'address',
  },
  {
    name: 'address2',
    path: 'address',
  },
  {
    name: 'city',
    path: 'address',
  },
  {
    name: 'postcode',
    path: 'address',
  },
  {
    key: 'zipCode',
    path: 'address',
    name: 'postcode',
  },
]
