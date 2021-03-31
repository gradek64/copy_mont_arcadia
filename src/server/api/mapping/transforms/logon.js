import { path } from 'ramda'

const addressFragment = ({
  address1,
  address2,
  city,
  state,
  country,
  postcode,
  zipCode,
} = {}) => ({
  address1: address1 || '',
  address2: address2 || '',
  city: city || '',
  state: state || '',
  country: country || '',
  postcode: postcode || zipCode || '',
})

const nameAndPhoneFragment = ({ lastName, telephone, title, firstName }) => ({
  lastName: lastName || '',
  telephone: telephone || '',
  title: title || '',
  firstName: firstName || '',
})

const detailsFragment = ({
  nameAndPhone = {},
  address = {},
  addressDetailsId,
} = {}) => ({
  addressDetailsId: Number(addressDetailsId) || addressDetailsId || -1,
  nameAndPhone: nameAndPhoneFragment(nameAndPhone),
  address: addressFragment(address),
})

const creditCardFragment = ({
  cardNumberHash,
  cardNumberStar,
  expiryMonth,
  expiryYear,
  type,
}) => ({
  type: type || '',
  cardNumberHash: cardNumberHash || '',
  cardNumberStar: cardNumberStar || '',
  expiryMonth: expiryMonth || '',
  expiryYear: expiryYear || '',
})

// only checking for first line and postcode as it's the minimum address
const hasAddress = ({ address = {} }) =>
  !!(address.address1 && address.postcode)

const extraLogonProperties = (creditCard, deliveryDetails, billingDetails) => ({
  hasCardNumberHash: !!creditCard.cardNumberHash,
  hasPayPal: creditCard.type === 'PYPAL',
  hasDeliveryDetails: hasAddress(deliveryDetails),
  hasBillingDetails: hasAddress(billingDetails),
})

const logonTransform = (LogonForm, isLogon) => {
  const account = path(['Account', 0], LogonForm) || {}
  const nameAndPhone = nameAndPhoneFragment(
    path(['billingDetails', 'nameAndPhone'], account) ||
      path(['deliveryDetails', 'nameAndPhone'], account) ||
      {}
  )
  const creditCard = creditCardFragment(account.creditCard || {})
  const deliveryDetails = detailsFragment(account.deliveryDetails || {})
  const billingDetails = detailsFragment(account.billingDetails || {})
  const extraProperties = isLogon
    ? extraLogonProperties(creditCard, deliveryDetails, billingDetails)
    : {}
  const {
    userId,
    userToken,
    isDDPUser,
    isDDPRenewable,
    ddpStartDate,
    ddpEndDate,
    wasDDPUser,
    ddpCurrentOrderCount,
    ddpPreviousOrderCount,
    ddpCurrentSavings,
    ddpPreviousSaving,
    ddpStandardPrice,
    ddpExpressDeliveryPrice,
    expId1,
    expId2,
    success,
  } = LogonForm
  return {
    exists: true,
    email:
      path(['billingDetails', 'email'], account) ||
      path(['omnitureItems', 's.eVar7'], LogonForm) ||
      LogonForm.email ||
      '',
    title: nameAndPhone.title || LogonForm.title || '',
    firstName: nameAndPhone.firstName || LogonForm.firstName || '',
    lastName: nameAndPhone.lastName || LogonForm.lastName || '',
    userTrackingId:
      parseInt(
        account.userTrackingId ||
          path(['omnitureItems', 's.eVar6'], LogonForm) ||
          '0',
        10
      ) || '',
    subscriptionId: parseInt(LogonForm.subscriptionId || '0', 10) || '',
    basketItemCount: parseInt(LogonForm.basketItemsCount || '0', 10),
    creditCard,
    deliveryDetails,
    billingDetails,
    version: '1.6',
    userId,
    userToken,
    isDDPUser,
    isDDPRenewable,
    ddpStartDate,
    ddpEndDate,
    wasDDPUser,
    ddpCurrentOrderCount,
    ddpPreviousOrderCount,
    ddpCurrentSaving: ddpCurrentSavings,
    ddpPreviousSaving,
    ddpStandardPrice,
    ddpExpressDeliveryPrice,
    expId1: expId1 || '',
    expId2: expId2 || '',
    success,
    ...extraProperties,
  }
}

export {
  addressFragment,
  nameAndPhoneFragment,
  detailsFragment,
  creditCardFragment,
  extraLogonProperties,
}

export default logonTransform
