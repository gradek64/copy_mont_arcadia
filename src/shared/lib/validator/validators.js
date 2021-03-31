import { curry, isNil, isEmpty } from 'ramda'
import emojiRegex from 'emoji-regex'
import topLevelDomainList from 'tlds'
import { maxLengthName, specialChars } from '../../constants/forms'
import { passwordCriteriaErrorCheck } from '../password-criteria-indicator-utils'

export const email = (obj, key, l) => {
  const value = obj[key]

  const emailRegularExpression = new RegExp(
    `^[A-Z0-9._%-]+@[A-Z0-9.-]+\\.(${topLevelDomainList.join('|')})$`,
    'gim'
  )

  if (!value) {
    return l`An email address is required.`
  }
  if (!emailRegularExpression.test(value)) {
    return l`Please enter a valid email address.`
  }

  return null
}

export const required = (obj, key, l) =>
  isEmpty(obj[key]) || isNil(obj[key]) || /^\s+$/.test(obj[key])
    ? l`This field is required`
    : undefined
export const requiredCurried = curry((msg, obj, key, l) =>
  required(obj, key, () => l(msg))
)

export function country(objTest, key, l) {
  return objTest.country === 'default'
    ? l`Please select your country`
    : undefined
}

export function productSize(objTest, key, l) {
  return !(objTest[key] && objTest[key].size)
    ? l`Please select your size to continue`
    : undefined
}

export const passwordV1 = (obj, key, l) => {
  const value = obj[key]

  if (passwordCriteriaErrorCheck(value)) {
    return l`Check password criteria.`
  }
}

export const password = (obj, key, l) => {
  const value = obj[key]

  if (!value) {
    return l`A password is required.`
  }

  if (value.length < 6) {
    return l`Please enter a password of at least 6 characters`
  }

  if (value.length > 20) {
    return l`Please enter a password less than 20 characters`
  }

  // Contains at least one number and one letter
  if (!(/\d/.test(value) && /[A-Za-z]/.test(value))) {
    return l`Please enter a password that is at least 6 characters long and includes a number`
  }
}

export const isSameAs = curry((msg, compareToKey, obj, key) => {
  if (!obj[key] || obj[key] !== obj[compareToKey]) {
    return msg
  }
})

export const isNotSameAs = curry((msg, compareToKey, obj, key) => {
  if (!obj[key] || obj[key] === obj[compareToKey]) {
    return msg
  }
})

export const isEqualTo = curry((msg, compareTo, obj, key) => {
  if (!obj[key] || obj[key] !== compareTo) {
    return msg
  }
})

export const ukPhoneNumber = (obj, key, l) => {
  const value = obj[key] ? obj[key].replace(/ /g, '') : null
  if (!value) return ''
  if (!value.match(/^0\d{9,10}$/)) {
    return l`Please enter a valid phone number`
  }
}

export const usPhoneNumber = (obj, key, l) => {
  const value = obj[key] ? obj[key].replace(/ /g, '') : null
  if (!value) return ''
  const containsInvalidCharaters = /[^0-9() .-]/.test(value)
  const tooManyAdjacentSymbols =
    /[().-]{2}/.test(value) || /[ .-]{2}/.test(value)
  const numberOfDigits = value.replace(/\D/g, '').length
  return containsInvalidCharaters ||
    tooManyAdjacentSymbols ||
    numberOfDigits !== 10
    ? l`Please enter a valid phone number`
    : undefined
}

export const cvvValidation = (obj, key, l) =>
  /^\d*$/.test(obj[key]) ? undefined : l`Only digits allowed`

export const numbersOnly = (obj, key, l) =>
  /^\d*$/.test(obj[key].replace(/ /g, '')) ? undefined : l`Only digits allowed`

export const promotionCode = curry((obj, key, l) => {
  if (obj[key].length > 20) {
    return l`The promotion code you have entered has not been recognised. Please confirm the code and try again.`
  }
})

export const smsMobileNumber = (obj, key, l) => {
  if (!obj[key]) return '' // Only validate if value supplied
  return /^07[0-9]{3}\s*[0-9]{6}$/.test(obj[key])
    ? undefined
    : l`Please enter a valid UK phone number`
}

export const cardExpiry = curry((errorMessage, today, card) => {
  const isValidMonth = /^(0[1-9]|1[0-2])$/.test(card.expiryMonth)
  const isValidYear = /^([0-9]{4})$/.test(card.expiryYear)

  if (isValidMonth && isValidYear) {
    const expiryDate = new Date(`${card.expiryYear}/${card.expiryMonth}/01`)

    return new Date(`${today.getFullYear()}/${today.getMonth() + 1}/01`) >
      expiryDate
      ? errorMessage
      : null
  }

  return errorMessage
})

export const regexValidate = curry(
  (errorMessage, regex, obj, key, l) =>
    new RegExp(regex).test(obj[key]) ? null : l(errorMessage)
)

export const hasLength = curry(
  (msg, length, obj, key, l) =>
    obj[key].toString().length !== length ? l(msg) : null
)

export const maxLength = curry((msg, length, obj, key, l) => {
  return obj[key].toString().length > length ? l(msg) : null
})

export const maxLength60Characters = maxLength(
  `Maximum characters is ${maxLengthName}`,
  maxLengthName
)

export const validateSpecialChars = regexValidate(
  'Please remove special characters',
  specialChars
)

export const noEmoji = (obj, key, l) => {
  const emoji = emojiRegex()
  return emoji.test(obj[key])
    ? l`Please remove all emoji characters`
    : undefined
}

export const countryValidate = curry((countries, obj, key, l) => {
  return countries && key && obj && key in obj && !countries.includes(obj[key])
    ? l('Please enter a valid country')
    : undefined
})
