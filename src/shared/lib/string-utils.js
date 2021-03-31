// TODO Capitalisation should be done with CSS, current bug in Chrome prevents it
// https://bugs.chromium.org/p/chromium/issues/detail?id=31349

import { map, split, join, compose } from 'ramda'

export const capitalize = (word) =>
  typeof word === 'string' && word.length > 0
    ? word[0].toUpperCase().concat(word.slice(1).toLowerCase())
    : ''

export const titleCase = compose(
  join(' '),
  map(capitalize),
  split(' ')
)

export const camelCaseify = (string) => {
  return (
    string &&
    string
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]/g, ' ')
      .replace(/\s+(\w)/g, (match, firstLetter) => firstLetter.toUpperCase())
      .trim()
  )
}

export const trimFromFileExtension = (string, extension) => {
  if (typeof string === 'string' && string.length > 0 && extension) {
    const extensionPosition = string.indexOf(`.${extension}`)
    return extensionPosition > -1
      ? string.substring(0, extensionPosition)
      : string
  }

  return string
}

export const removeSpacing = (string) => {
  if (typeof string === 'string' && string.length > 0) {
    return string.replace(/\s/g, '')
  }
  return string
}

export const trimStringEnds = (string) => {
  if (typeof string === 'string' && string.length) {
    return string.trim()
  }

  return string
}

export const lastFourCharsOf = (value) => value.slice(-4)

export const floatToPriceString = (price) => {
  try {
    const parsed = parseFloat(price)
    return isFinite(parsed) ? parsed.toFixed(2) : null
  } catch (error) {
    return null
  }
}
