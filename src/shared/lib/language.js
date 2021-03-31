import {
  allLanguages,
  languageOptions,
  defaultLanguages,
} from '../constants/languages'

export function getLanguageCodeByName(name) {
  const match = allLanguages.find((o) => o.value === name)
  return match ? match.isoCode : undefined
}

export const getBrandLanguageOptions = (brandCode) => languageOptions[brandCode]

export const isMultiLanguageShippingCountry = (country) =>
  !!defaultLanguages[country]

export const getDefaultLanguageByShippingCountry = (brandCode, country) => {
  const defaultLang = defaultLanguages[country]
  if (defaultLang) {
    const isSupportedByBrand = languageOptions[brandCode].some(
      (option) => option.value === defaultLang
    )
    if (isSupportedByBrand) return defaultLang
  }
  return 'English'
}
