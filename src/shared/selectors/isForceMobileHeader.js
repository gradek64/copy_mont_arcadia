import { contains } from 'ramda'

const inScopeLanguages = ['fr', 'de']

const inScopeBrandsByLanguage = {
  de: ['ts'],
  fr: ['ts', 'tm'],
}

export default ({
  language,
  isPortrait = false,
  isTablet = false,
  brandCode,
}) => {
  return (
    contains(language, inScopeLanguages) &&
    contains(brandCode, inScopeBrandsByLanguage[language]) &&
    isPortrait &&
    isTablet
  )
}
