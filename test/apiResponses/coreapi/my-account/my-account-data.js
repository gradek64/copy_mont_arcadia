// IMPORTS
import randomstring from 'randomstring'

// TEST DATA
export const userCredentialsFullDetails = {
  username: 'automation1@a.com',
  password: 'test12',
}

// PAYLOAD FUNCTIONS
export const userShortProfile = () => {
  const email = randomstring.generate({ length: 6, charset: `alphabetic` })
  const firstName = randomstring.generate({ length: 6, charset: `alphabetic` })
  const lastName = randomstring.generate({ length: 6, charset: `alphabetic` })
  const titleList = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']
  const title = titleList[Math.floor(titleList.length * Math.random())]
  return {
    email: `${email.toLowerCase()}@sample.org`,
    firstName: `FirstName_${firstName}`,
    lastName: `LastName_${lastName}`,
    title,
  }
}

// CHANGE PASSWORD PAYLOAD
export const changePassword = (emailAddress) => ({
  emailAddress,
  newPassword: 'monty123',
  newPasswordConfirm: 'monty123',
  oldPassword: 'monty1',
})

// Address ITEM
const address = () => {
  const postCodeList = [
    'NW1 5QD',
    'IP3 0BL',
    'W1T 3NL',
    'EC3N 1HP',
    'W6 8BT',
    'SW6 7ST',
  ]
  const postCode = postCodeList[Math.floor(postCodeList.length * Math.random())]
  const cityList = [
    'London',
    'Manchester',
    'Norwich',
    'Ipswich',
    'York',
    'Brighton',
  ]
  const city = cityList[Math.floor(postCodeList.length * Math.random())]
  return {
    country: 'United Kingdom',
    postcode: postCode,
    address1: randomstring
      .generate({
        length: 6,
        charset: `alphabetic`,
      })
      .toLowerCase(),
    address2: randomstring
      .generate({
        length: 6,
        charset: `alphabetic`,
      })
      .toLowerCase(),
    city,
    state: '',
  }
}
// NAME AND PHONE ITEM
const nameAndPhone = () => ({
  title: 'Mr',
  firstName: randomstring
    .generate({
      length: 6,
      charset: `alphabetic`,
    })
    .toLowerCase(),
  lastName: randomstring
    .generate({
      length: 6,
      charset: `alphabetic`,
    })
    .toLowerCase(),
  telephone: `07${randomstring
    .generate({
      length: 8,
      charset: `numeric`,
    })
    .toLowerCase()}`,
})

// CHANGE CHECKOUT DETAILS PAYLOAD
export const changeFullDetails = (paymentType, cardNumber) => ({
  billingDetails: {
    nameAndPhone: nameAndPhone(),
    address: address(),
  },
  deliveryDetails: {
    nameAndPhone: nameAndPhone(),
    address: address(),
  },
  creditCard: {
    expiryYear: '2020',
    expiryMonth: '07',
    type: paymentType,
    cardNumber,
  },
})
