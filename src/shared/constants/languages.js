const englishLanguageOption = {
  value: 'English',
  label: 'English',
  isoCode: 'en',
}
const frenchLanguageOption = {
  value: 'French',
  label: 'French',
  isoCode: 'fr',
}
const germanLanguageOption = {
  value: 'German',
  label: 'German',
  isoCode: 'de',
}

export const allLanguages = [
  englishLanguageOption,
  frenchLanguageOption,
  germanLanguageOption,
]
export const englishOnlyOption = [englishLanguageOption]
export const englishAndGermanOptions = [
  englishLanguageOption,
  germanLanguageOption,
]

// NOTE: despite being EU countries we only offer English language for Ireland
// and Latvia, and so they are not included in the default language mapping:
export const defaultLanguages = {
  Andorra: 'English',
  Austria: 'German',
  Belgium: 'English',
  Estonia: 'English',
  Finland: 'English',
  France: 'French',
  Germany: 'German',
  Greece: 'English',
  'Holy See': 'English',
  Italy: 'English',
  Liechtenstein: 'German',
  Luxembourg: 'English',
  Monaco: 'French',
  Montenegro: 'English',
  Netherlands: 'English',
  Portugal: 'English',
  'San Marino': 'English',
  Slovakia: 'English',
  Spain: 'English',
  Switzerland: 'English',
}

export const languageOptions = {
  ts: allLanguages,
  tm: allLanguages,
  ms: englishOnlyOption,
  dp: englishAndGermanOptions,
  br: englishOnlyOption,
  ev: englishOnlyOption,
  wl: englishOnlyOption,
}

export const euCountries = [
  'Andorra',
  'Austria',
  'Belgium',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Holy See',
  'Ireland',
  'Italy',
  'Latvia',
  'Liechtenstein',
  'Luxembourg',
  'Monaco',
  'Montenegro',
  'Netherlands',
  'Portugal',
  'San Marino',
  'Slovakia',
  'Spain',
  'Switzerland',
]
