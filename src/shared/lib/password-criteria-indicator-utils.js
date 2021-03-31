import {
  PASSWORD_CRITERIA_INDICATOR_LABELS,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '../constants/passwordCriteriaIndicator'

export const lowerThanMinCharacters = (value) =>
  value.length < PASSWORD_MIN_LENGTH

export const greaterThanMaxCharacters = (value) =>
  value.length > PASSWORD_MAX_LENGTH

export const withOutLowerCaseLetter = (value) => !/[a-z]/.test(value)

export const withOutUpperCaseLetter = (value) => !/[A-Z]/.test(value)

export const withOutNumbers = (value) => !/\d/.test(value)

/**
 * Utility function to collect missed password criteria errors.
 * @param {password} string To be valid needs to be between 8 to 20 characters, contain at least 1 lower and 1 upper case letter and at least 1 number.
 * @returns {array} Of the criteria error labels or empty if no errors are found.
 */
export const passwordCriteriaErrorCollector = (password = '') => {
  const currentErrors = []

  if (lowerThanMinCharacters(password) || greaterThanMaxCharacters(password)) {
    currentErrors.push(PASSWORD_CRITERIA_INDICATOR_LABELS.MIN_MAX_CHARACTERS)
  }

  if (withOutNumbers(password)) {
    currentErrors.push(PASSWORD_CRITERIA_INDICATOR_LABELS.NUMBER)
  }

  if (withOutLowerCaseLetter(password)) {
    currentErrors.push(PASSWORD_CRITERIA_INDICATOR_LABELS.LOWER_CASE)
  }

  if (withOutUpperCaseLetter(password)) {
    currentErrors.push(PASSWORD_CRITERIA_INDICATOR_LABELS.UPPER_CASE)
  }

  return currentErrors
}

export const passwordCriteriaErrorCheck = (password) =>
  !password || passwordCriteriaErrorCollector(password).length > 0
