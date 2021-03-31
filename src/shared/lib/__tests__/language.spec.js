import {
  getLanguageCodeByName,
  getBrandLanguageOptions,
  isMultiLanguageShippingCountry,
  getDefaultLanguageByShippingCountry,
} from '../language'

describe(getLanguageCodeByName.name, () => {
  it('should return the iso code of the language that bears the specified name', () => {
    expect(getLanguageCodeByName('English')).toBe('en')
  })

  it('should return undefined if no language was found', () => {
    expect(getLanguageCodeByName('FuzzleBot')).toBeUndefined()
  })
})

describe('getBrandLanguageOptions', () => {
  const createOption = (lang, isoCode) => ({
    label: lang,
    value: lang,
    isoCode,
  })

  it('should return the correct options for burton', () => {
    expect(getBrandLanguageOptions('br')).toEqual([
      createOption('English', 'en'),
    ])
  })

  it('should return the correct options for dorothy perkins', () => {
    expect(getBrandLanguageOptions('dp')).toEqual([
      createOption('English', 'en'),
      createOption('German', 'de'),
    ])
  })

  it('should return the correct options for evans', () => {
    expect(getBrandLanguageOptions('ev')).toEqual([
      createOption('English', 'en'),
    ])
  })

  it('should return the correct options for miss selfridge', () => {
    expect(getBrandLanguageOptions('ms')).toEqual([
      createOption('English', 'en'),
    ])
  })

  it('should return the correct options for topman', () => {
    expect(getBrandLanguageOptions('tm')).toEqual([
      createOption('English', 'en'),
      createOption('French', 'fr'),
      createOption('German', 'de'),
    ])
  })

  it('should return the correct options for topshop', () => {
    expect(getBrandLanguageOptions('ts')).toEqual([
      createOption('English', 'en'),
      createOption('French', 'fr'),
      createOption('German', 'de'),
    ])
  })

  it('should return the correct options for miss selfridge', () => {
    expect(getBrandLanguageOptions('wl')).toEqual([
      createOption('English', 'en'),
    ])
  })
})

describe('isMultiLanguageShippingCountry', () => {
  it('should return true for Andorra', () => {
    expect(isMultiLanguageShippingCountry('Andorra')).toBe(true)
  })

  it('should return true for Greenland', () => {
    expect(isMultiLanguageShippingCountry('Greenland')).toBe(false)
  })

  it('should return false for Netherlands', () => {
    expect(isMultiLanguageShippingCountry('Netherlands')).toBe(true)
  })

  it('should return false for Switzerland', () => {
    expect(isMultiLanguageShippingCountry('Switzerland')).toBe(true)
  })

  it('should return false for Ireland', () => {
    expect(isMultiLanguageShippingCountry('Ireland')).toBe(false)
  })

  it('should return false for Latvia', () => {
    expect(isMultiLanguageShippingCountry('Latvia')).toBe(false)
  })
})

describe('getDefaultLanguageByShippingCountry', () => {
  it('should return `English` if the country has English as its default language', () => {
    expect(getDefaultLanguageByShippingCountry('wl', 'Andorra')).toBe('English')
  })

  it('should return `English` when the country is not in the default language mapping', () => {
    expect(getDefaultLanguageByShippingCountry('ts', 'Antarctica')).toBe(
      'English'
    )
  })

  it('should return `English` if the country is Germany but the brand does not have a German language option', () => {
    expect(getDefaultLanguageByShippingCountry('ms', 'Germany')).toBe('English')
    expect(getDefaultLanguageByShippingCountry('ev', 'Germany')).toBe('English')
  })

  it('should return `French` if the country is France and the brand has a French langugage option', () => {
    expect(getDefaultLanguageByShippingCountry('tm', 'France')).toBe('French')
  })

  it('should return `English` if the country is France and the brand does not have a French langugage option', () => {
    expect(getDefaultLanguageByShippingCountry('dp', 'France')).toBe('English')
  })

  it('should return `German` if the country is Liechtenstein and the brand has a German langugage option', () => {
    expect(getDefaultLanguageByShippingCountry('tm', 'Liechtenstein')).toBe(
      'German'
    )
  })

  it('should return `French` if the country is Monaco and the brand has a French langugage option', () => {
    expect(getDefaultLanguageByShippingCountry('ts', 'Monaco')).toBe('French')
  })
})
