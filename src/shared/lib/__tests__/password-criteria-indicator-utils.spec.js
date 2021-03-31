import {
  passwordCriteriaErrorCollector,
  lowerThanMinCharacters,
  greaterThanMaxCharacters,
  withOutNumbers,
  withOutLowerCaseLetter,
  withOutUpperCaseLetter,
  passwordCriteriaErrorCheck,
} from '../password-criteria-indicator-utils'

describe('passwordCriteriaErrorCollector', () => {
  describe('when password contains less than 8 characters', () => {
    it('should return an array that contains `8-20 characters` label', () => {
      const errors = passwordCriteriaErrorCollector('abcdefg')
      expect(errors).toContain('8-20 characters')
    })
  })

  describe('when password contains more than 20 characters', () => {
    it('should return an array that contains `8-20 characters` label', () => {
      const errors = passwordCriteriaErrorCollector('abcdefg1234eol7!2£56^')
      expect(errors).toContain('8-20 characters')
    })
  })

  describe('when password does not contain at least one number', () => {
    it('should return an array that contains `A number` label', () => {
      const errors = passwordCriteriaErrorCollector('abcdefg')
      expect(errors).toContain('A number')
    })
  })

  describe('when password does not contain at least one upper case letter', () => {
    it('should return an array that contains `An upper case letter` label', () => {
      const errors = passwordCriteriaErrorCollector('abcdefg')
      expect(errors).toContain('An upper case letter')
    })
  })

  describe('when password does not contain at least one lower case letter', () => {
    it('should return an array that contains `A lower case letter` label', () => {
      const errors = passwordCriteriaErrorCollector('ABCDEFG')
      expect(errors).toContain('A lower case letter')
    })
  })

  describe('when password meets the correct criteria', () => {
    it('should return an empty array', () => {
      const errors = passwordCriteriaErrorCollector('abcd1W%4')
      expect(errors).toEqual([])
    })
  })
})

describe('lowerThanMinCharacters', () => {
  it('should return true when less than 8 characters', () => {
    expect(lowerThanMinCharacters('abcdefg')).toBe(true)
  })

  it('should return false when 8 or more than 8 characters', () => {
    expect(lowerThanMinCharacters('abcdefgdf')).toBe(false)
  })
})

describe('greaterThanMaxCharacters', () => {
  it('should return true when more than 20 characters', () => {
    expect(greaterThanMaxCharacters('abcdefg45fg&*y5dfgtga')).toBe(true)
  })

  it('should return false when less than 20 or 20 characters', () => {
    expect(greaterThanMaxCharacters('abcdefg45fg&*y5dfgt')).toBe(false)
  })
})

describe('withOutNumbers', () => {
  it('should return true when no numbers', () => {
    expect(withOutNumbers('abcdefg')).toBe(true)
  })

  it('should return false when at least a number', () => {
    expect(withOutNumbers('abcdef1')).toBe(false)
  })
})

describe('withOutLowerCaseLetter', () => {
  it('should return true when no lower case letters', () => {
    expect(withOutLowerCaseLetter('ABCDEFG1')).toBe(true)
  })

  it('should return false when at least a number', () => {
    expect(withOutLowerCaseLetter('abcdefg1')).toBe(false)
  })
})

describe('withOutUpperCaseLetter', () => {
  it('should return true when no upper case letters', () => {
    expect(withOutUpperCaseLetter('abcdefg')).toBe(true)
  })

  it('should return false when at leaset one upper case letter', () => {
    expect(withOutUpperCaseLetter('abcdefA1')).toBe(false)
  })
})

describe('passwordCriteriaErrorCheck', () => {
  it('should return false when no errors', () => {
    expect(passwordCriteriaErrorCheck('Password1')).toBe(false)
  })

  it('should return true when there are arrors', () => {
    expect(passwordCriteriaErrorCheck('password1')).toBe(true)
  })
})
