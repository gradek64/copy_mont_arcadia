import debugLib from 'debug'

const SENSITIVE_INFO_KEYS = [
  'cardNumber',
  'shipping_address1',
  'shipping_address2',
  'shipping_zipCode',
  'password',
  'address1',
  'postcode',
  'address2',
  'name',
  'foreName',
  'firstName',
  'lastName',
  'surName',
  'surname',
  'telephone',
  'passwordConfirm',
  'email',
  'Email_address',
  'emailAddress',
  'cardCvv',
  'origLogonId',
  'logonPassword',
  'create_logonId',
  'logonPasswordVerify',
  'smsAlerts',
  'smsMobileNumber',
  'shipping_firstName',
  'shipping_lastName',
  'shipping_phone1',
  'shipping_email1',
  'carrier_mobile',
  'saved_firstName',
  'saved_lastName',
  'saved_addressLine1',
  'saved_addressLine2',
  'saved_postcode',
  'saved_telephone',
  'billing_firstName',
  'billing_lastName',
  'billing_email1',
  'billing_phone1',
  'billing_address1',
  'billing_address2',
  'billing_zipCode',
  'tmpLogonId',
  'logonId',
  'tempEmail1',
  'nickName',
  'address',
  'cardSecurityNumber',
  'cardNumberStar',
  'cardBrand',
  'cardNumber',
  'zipcode',
  'zipCode',
  'pin',
  'giftCardNumber',
  'oldPassword',
  'newPassword',
  'newPasswordConfirm',
  'houseNumber',
  'county',
  'city',
  'cvv',
  'deliveryInstructions',
  'email1',
  'username',
  'addressName',
  'address3',
  'address4',
  'address5',
  's.eVar7',
  's.zip',
  'qubitConfirmationURL',
  'eVar7',
  'logonPasswordOld',
]

const printStrings = () => {
  return (
    process.env.LOGGING_LEVEL_FORMAT &&
    process.env.LOGGING_LEVEL_FORMAT.toUpperCase() === 'STRING'
  )
}

const debugColors = {
  error: 1, // red
  info: 2, // green
  debug: 3, // yellow
  trace: 4,
}

const getColor = (namespace) => {
  if (!debugColors[namespace]) {
    debugColors[namespace] = ((Object.keys(debugColors).length % 5) + 3) % 7 // 3-6 or 0
  }
  return debugColors[namespace]
}

const isObject = (x) => {
  return x === Object(x)
}

const hashSensitiveFields = (object) => {
  return Object.keys(object).reduce((acc, item) => {
    acc[item] = SENSITIVE_INFO_KEYS.includes(item)
      ? '###HIDDEN###'
      : object[item]
    if (isObject(object[item])) acc[item] = hashSensitiveFields(object[item])
    return acc
  }, {})
}

export const maskObject = (object) => {
  if (object) {
    if (!isObject(object)) {
      object = { message: object }
    }
    try {
      const objToMask = isObject(object) ? object : JSON.parse(object)
      return hashSensitiveFields(objToMask)
    } catch (e) {
      return object
    }
  }
  return object
}

export const printLog = (namespace, message, jsonObject) => {
  const title = jsonObject ? message : ''
  const body = jsonObject || message || ''

  const namespacedDebug = debugLib(`monty:${title}`)

  namespacedDebug.color = getColor(namespace)
  namespacedDebug(
    printStrings() ? JSON.stringify(maskObject(body)) : maskObject(body)
  )
}
