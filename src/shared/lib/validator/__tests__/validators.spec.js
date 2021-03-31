import { mockLocalise } from 'test/unit/helpers/test-component'
import {
  productSize,
  noEmoji,
  email,
  password,
  isSameAs,
  isNotSameAs,
  isEqualTo,
  promotionCode,
  smsMobileNumber,
  required,
  ukPhoneNumber,
  usPhoneNumber,
  countryValidate,
  cvvValidation,
  maxLength,
  regexValidate,
  cardExpiry,
  passwordV1,
} from '../validators'
import topLevelDomainList from 'tlds'
import { maxLengthName, specialChars } from '../../../constants/forms'

describe('validators', () => {
  describe('`email`', () => {
    it('returns error in case of email argument as empty string', () => {
      expect(email({ email: '' }, 'email', jest.fn(mockLocalise))).toBe(
        'An email address is required.'
      )
    })
    it('returns error in case of email argument as "abc"', () => {
      expect(email({ email: 'abc' }, 'email', jest.fn(mockLocalise))).toBe(
        'Please enter a valid email address.'
      )
    })
    it('returns error in case of email argument as "abc@abc"', () => {
      expect(email({ email: 'abc@abc' }, 'email', jest.fn(mockLocalise))).toBe(
        'Please enter a valid email address.'
      )
    })
    it('returns error in case of email argument as "abc@abc.abcde"', () => {
      expect(
        email({ email: 'abc@abc.abcde' }, 'email', jest.fn(mockLocalise))
      ).toBe('Please enter a valid email address.')
    })
    it('returns error in case of email argument as "abc@abc.a"', () => {
      expect(
        email({ email: 'abc@abc.a' }, 'email', jest.fn(mockLocalise))
      ).toBe('Please enter a valid email address.')
    })
    it('returns error in case of email argument as "ab+c@abc.com"', () => {
      expect(
        email({ email: 'ab+c@abc.com' }, 'email', jest.fn(mockLocalise))
      ).toBe('Please enter a valid email address.')
    })

    it('returns no error in case of email argument as "123@abc.com"', () => {
      expect(
        email({ email: '123@abc.com' }, 'email', jest.fn(mockLocalise))
      ).toBe(null)
    })
    it('returns no error in case of email argument as "abc@abc.com"', () => {
      expect(
        email({ email: 'abc@abc.com' }, 'email', jest.fn(mockLocalise))
      ).toBe(null)
    })
    it('returns no error in case of email argument as "abc@abc.co.uk"', () => {
      expect(
        email({ email: 'abc@abc.co.uk' }, 'email', jest.fn(mockLocalise))
      ).toBe(null)
    })
    it('returns no error in case of email argument as "123abc@123abc.com"', () => {
      expect(
        email({ email: '123abc@123abc.com' }, 'email', jest.fn(mockLocalise))
      ).toBe(null)
    })

    it('returns no error in case of email argument as email ending in a top level domain', () => {
      topLevelDomainList.forEach((topLevelDomain) => {
        expect(
          email(
            { email: `abc@abc.${topLevelDomain}` },
            'email',
            jest.fn(mockLocalise)
          )
        ).toBe(null)
      })
    })

    it('returns no error in case of email argument as "aBc@abc.cOM"', () => {
      expect(
        email({ email: 'aBc@abc.cOM' }, 'email', jest.fn(mockLocalise))
      ).toBe(null)
    })

    it('returns no error in case of email argument as "123abc@123abc.com.com"', () => {
      expect(
        email(
          { email: '123abc@123abc.com.com' },
          'email',
          jest.fn(mockLocalise)
        )
      ).toBe(null)
    })
  })

  describe('`password`', () => {
    it('password returns error in case of password argument as empty string', () => {
      expect(
        password({ password: '' }, 'password', jest.fn(mockLocalise))
      ).toBe('A password is required.')
    })

    it('password returns error in case of password argument length less than 6 characters', () => {
      expect(
        password({ password: 'abcde' }, 'password', jest.fn(mockLocalise))
      ).toBe('Please enter a password of at least 6 characters')
    })

    it('password returns no error in case of password argument length at least 6 characters and meets complexity requirements', () => {
      expect(
        password({ password: 'abcde1' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: 'ABCDE1' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()
      expect(
        password({ password: '9abcde' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: '9ABCDE' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: '12345a' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: '12345A' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: 'z12345' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: 'Z12345' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: '$.A+0(' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: '$.9+Z(' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: '0---$A' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        password({ password: 'A---$0' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()
    })

    it('password returns error if the password contains no numbers', () => {
      const err =
        'Please enter a password that is at least 6 characters long and includes a number'
      expect(
        password({ password: 'abcdef' }, 'password', jest.fn(mockLocalise))
      ).toBe(err)
    })

    it('password returns error if the password contains no letters', () => {
      const err =
        'Please enter a password that is at least 6 characters long and includes a number'
      expect(
        password({ password: '123456' }, 'password', jest.fn(mockLocalise))
      ).toBe(err)
    })

    it('password returns error if the password contains more than 20 chars', () => {
      const err = 'Please enter a password less than 20 characters'
      expect(
        password(
          { password: '123456789012345678901' },
          'password',
          jest.fn(mockLocalise)
        )
      ).toBe(err)
    })
  })

  describe('`passwordV1`', () => {
    const error = 'Check password criteria.'

    it('should return error if password is an empty string', () => {
      expect(
        passwordV1({ password: '' }, 'password', jest.fn(mockLocalise))
      ).toBe(error)
    })

    it('should return error if password length is less than 8 characters', () => {
      expect(
        passwordV1({ password: 'Passwor' }, 'password', jest.fn(mockLocalise))
      ).toBe(error)
    })

    it('should return error if password length is more than 20 characters', () => {
      expect(
        passwordV1(
          { password: 'Password1234567890Pas' },
          'password',
          jest.fn(mockLocalise)
        )
      ).toBe(error)
    })

    it('should return error if the password contains no numbers', () => {
      expect(
        passwordV1({ password: 'Password' }, 'password', jest.fn(mockLocalise))
      ).toBe(error)
    })

    it('should return error if the password contains no lower case letters', () => {
      expect(
        passwordV1({ password: 'PASSWORD1' }, 'password', jest.fn(mockLocalise))
      ).toBe(error)
    })

    it('should return error if the password contains no upper case letters', () => {
      expect(
        passwordV1({ password: 'password1' }, 'password', jest.fn(mockLocalise))
      ).toBe(error)
    })

    it('should not return error if the password meets the requirements', () => {
      expect(
        passwordV1({ password: 'Password1' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()

      expect(
        passwordV1(
          { password: 'Password1!' },
          'password',
          jest.fn(mockLocalise)
        )
      ).toBeUndefined()

      expect(
        passwordV1({ password: '@£$%&aB1' }, 'password', jest.fn(mockLocalise))
      ).toBeUndefined()
    })
  })

  describe('`isSameAs`', () => {
    it('isSameAs returns error in case of non identical arguments', () => {
      const err = 'Please ensure that both passwords match'
      expect(
        isSameAs(
          err,
          'b',
          {
            a: '123',
            b: '234',
          },
          'a'
        )
      ).toBe(err)
    })
    it('isSameAs returns no error in case of identical arguments', () => {
      expect(isSameAs('err', 'b', { a: '123', b: '123' }, 'a')).toBe(undefined)
    })
    it('isSameAs is curried', () => {
      const err = 'Please ensure that both passwords match'
      const data = { a: '123', b: '234' }
      expect(isSameAs(err, 'b', data, 'a')).toBe(isSameAs(err)('b')(data)('a'))
    })
  })

  describe('`isSameAs`', () => {
    it('IsNotSameAs returns nothing if the properties are different', () => {
      const err = 'Password cannot be your email'
      expect(
        isNotSameAs(
          err,
          'b',
          {
            a: '123',
            b: '234',
          },
          'a'
        )
      ).toBe(undefined)
    })

    it('IsNotSameAs returns nothing if the properties are different', () => {
      const err = 'Password cannot be your email'
      expect(
        isNotSameAs(
          err,
          'b',
          {
            a: '123',
            b: '123',
          },
          'a'
        )
      ).toBe(err)
    })

    it('isNotSameAs is curried', () => {
      const err = 'Password cannot be your email'
      const data = { a: '123', b: '134' }
      expect(isNotSameAs(err, 'b', data, 'a')).toBe(
        isNotSameAs(err)('b')(data)('a')
      )
    })
  })

  describe('`isEqualTo`', () => {
    it('isEqualTo returns error if the property is not equal to the value', () => {
      const err = 'Password cannot be your email'
      expect(isEqualTo(err, 321, { a: 123 }, 'a')).toBe(err)
    })

    it('isEqualTo returns undefined if the property is equal to the value', () => {
      const err = 'error message'
      expect(isEqualTo(err, 123, { a: 123 }, 'a')).toBe(undefined)
    })

    it('isEqualTo is curried', () => {
      const err = 'error message'
      expect(isEqualTo(err, 123, { a: 123 }, 'a')).toBe(
        isEqualTo(err)(123)({ a: 123 })('a')
      )
    })
  })

  describe('`promotionCode`', () => {
    it('promotionCode returns an error for input longer than 20 chars', () => {
      const err =
        'The promotion code you have entered has not been recognised. Please confirm the code and try again.'
      expect(
        promotionCode(
          { promotionCode: '123456789012345678901' },
          'promotionCode',
          jest.fn(mockLocalise)
        )
      ).toBe(err)
    })

    it('promotionCode returns undefined for input under 20 chars', () => {
      expect(
        promotionCode(
          { promotionCode: '12345678901234567890' },
          'promotionCode',
          jest.fn(mockLocalise)
        )
      ).toBe(undefined)
    })
  })

  describe('`smsMobileNumber`', () => {
    it('validation for the delivery instructions mobile number tests for a valid UK number with a leading zero', () => {
      expect(
        smsMobileNumber(
          { smsMobileNumber: '07773457453' },
          'smsMobileNumber',
          jest.fn(mockLocalise)
        )
      ).toBe(undefined)
      expect(
        smsMobileNumber(
          { smsMobileNumber: '7773457453' },
          'smsMobileNumber',
          jest.fn(mockLocalise)
        )
      ).toBe('Please enter a valid UK phone number')
    })

    it('smsMobileNumber checks for a valid UK phone number + 0 at beginning', () => {
      expect(
        smsMobileNumber({ a: '7773456453' }, 'a', jest.fn(mockLocalise))
      ).toBe('Please enter a valid UK phone number')
      expect(
        smsMobileNumber({ a: '07773456453' }, 'a', jest.fn(mockLocalise))
      ).toBe(undefined)
    })

    it('smsMobileNumber returns empty string if no value is supplied (not required)', () => {
      expect(smsMobileNumber({ a: null }, 'a', jest.fn(mockLocalise))).toBe('')
    })
  })

  describe('cardExpiry', () => {
    it('should return an error message if the card expiry month is not set', () => {
      const card = {
        expiryMonth: '',
        expiryYear: '2020',
        errorMessage: 'Please select a valid expiry date',
      }
      expect(
        cardExpiry(`Please select a valid expiry date`, new Date(), card)
      ).toBe('Please select a valid expiry date')
    })

    it('should return an error message if the card expiry year is not set', () => {
      const card = {
        expiryMonth: '12',
        expiryYear: '',
        errorMessage: 'Please select a valid expiry date',
      }
      expect(
        cardExpiry(`Please select a valid expiry date`, new Date(), card)
      ).toBe('Please select a valid expiry date')
    })

    it('should return an error if the card has expired', () => {
      const card = {
        expiryMonth: '01',
        expiryYear: '2019',
        errorMessage: 'Please select a valid expiry date',
      }
      expect(
        cardExpiry(`Please select a valid expiry date`, new Date(), card)
      ).toBe('Please select a valid expiry date')
    })

    it('should return null if the card has not expired', () => {
      const card = {
        expiryMonth: '01',
        expiryYear: '2050',
        errorMessage: 'Please select a valid expiry date',
      }
      expect(
        cardExpiry(`Please select a valid expiry date`, new Date(), card)
      ).toBe(null)
    })
  })

  describe('`required`', () => {
    const requireError = 'This field is required'
    it('required returns error in case of argument as empty string', () => {
      expect(required({ a: '' }, 'a', jest.fn(mockLocalise))).toBe(requireError)
    })

    it('required returns NO ERROR if we pass 0 like a number', () => {
      expect(required({ numb: 0 }, 'numb', jest.fn(mockLocalise))).toBe(
        undefined
      )
    })

    it('required return NO error if we pass 0 like a string', () => {
      expect(required({ numbStr: '0' }, 'numbStr', jest.fn(mockLocalise))).toBe(
        undefined
      )
    })

    it('required returns ERROR if given null', () => {
      expect(required({ a: null }, 'a', jest.fn(mockLocalise))).toBe(
        requireError
      )
    })
  })

  describe('`ukPhoneNumber`', () => {
    const validNumberError = 'Please enter a valid phone number'

    it('ukPhoneNumber accepts UK valid numbers (10 digits long)', () => {
      expect(
        ukPhoneNumber({ a: '077 3333 444' }, 'a', jest.fn(mockLocalise))
      ).toBe(undefined)
    })

    it('ukPhoneNumber accepts UK valid numbers (11 digits long)', () => {
      expect(
        ukPhoneNumber({ a: ' 077 3333 4444 ' }, 'a', jest.fn(mockLocalise))
      ).toBe(undefined)
    })

    it('ukPhoneNumber return Error for non UK valid numbers (too short)', () => {
      expect(
        ukPhoneNumber({ a: '077 333891' }, 'a', jest.fn(mockLocalise))
      ).toBe(validNumberError)
    })

    it('ukPhoneNumber return Error for non UK valid numbers (too long)', () => {
      expect(
        ukPhoneNumber({ a: '077 3338 91123' }, 'a', jest.fn(mockLocalise))
      ).toBe(validNumberError)
    })

    it('ukPhoneNumber return Error for non UK valid numbers (not start with 0)', () => {
      expect(
        ukPhoneNumber({ a: '377 3333 444' }, 'a', jest.fn(mockLocalise))
      ).toBe(validNumberError)
    })

    it('ukPhoneNumber returns empty string if no value is given (not required)', () => {
      expect(ukPhoneNumber({ a: null }, 'a', jest.fn(mockLocalise))).toBe('')
    })
  })

  describe('`usPhoneNumber`', () => {
    const validNumberError = 'Please enter a valid phone number'

    it('usPhoneNumber accepts US valid numbers', () => {
      expect(
        usPhoneNumber({ a: '202-555-0117' }, 'a', jest.fn(mockLocalise))
      ).toBe(undefined)
    })

    it('usPhoneNumber return Error for non US valid numbers', () => {
      expect(usPhoneNumber({ a: '202-555' }, 'a', jest.fn(mockLocalise))).toBe(
        validNumberError
      )
    })

    it('usPhoneNumber returns empty string if no value is given (not required)', () => {
      expect(usPhoneNumber({ a: null }, 'a', jest.fn(mockLocalise))).toBe('')
    })
  })

  describe('`noEmoji`', () => {
    it('should error when passed an emoji', () => {
      expect(noEmoji({ wave: '✋' }, 'wave', jest.fn(mockLocalise))).toBe(
        'Please remove all emoji characters'
      )
    })

    it('should return undefined when no emoji is present', () => {
      expect(
        noEmoji({ test: 'test' }, 'test', jest.fn(mockLocalise))
      ).toBeUndefined()
    })
  })

  describe('`productSize`', () => {
    it('should have an error when object is undefined', () => {
      expect(
        productSize(
          { productSize: undefined },
          'productSize',
          jest.fn(mockLocalise)
        )
      ).toBe('Please select your size to continue')
    })

    it('should have an error when object has no size property', () => {
      expect(
        productSize({ productSize: {} }, 'productSize', jest.fn(mockLocalise))
      ).toBe('Please select your size to continue')
    })

    it('should not have an error when the object has a size property', () => {
      expect(
        productSize(
          { productSize: { size: 3 } },
          'productSize',
          jest.fn(mockLocalise)
        )
      ).toBe(undefined)
    })
  })

  describe('`countryValidate`', () => {
    it('countryValidate returns error if the property value is not in the countries array', () => {
      const countries = ['United Kingdom', 'Spain']
      expect(
        countryValidate(
          countries,
          { country: 'Italy' },
          'country',
          jest.fn(mockLocalise)
        )
      ).toBe('Please enter a valid country')
    })

    it('countryValidate returns undefined if the property is equal to the value', () => {
      const countries = ['United Kingdom', 'Spain']
      expect(
        countryValidate(
          countries,
          { country: 'Spain' },
          'country',
          jest.fn(mockLocalise)
        )
      ).toBe(undefined)
    })

    it('countryValidate is curried', () => {
      const countries = ['United Kingdom', 'Spain']
      expect(
        countryValidate(countries, { a: 123 }, 'a', jest.fn(mockLocalise))
      ).toEqual(
        countryValidate(countries)({ a: 123 })('a')(jest.fn(mockLocalise))
      )
    })
  })

  describe('cvvValidation', () => {
    const cardDetails = {
      cardNumber: 4111111111111111,
      cvv: '123',
      expiryMonth: '02',
      expiryYear: '2019',
      paymentType: 'VISA',
    }
    it('passes as long as only 3 digits are passed', () => {
      const generateCardDetails = (cvv) => ({
        ...cardDetails,
        cvv,
      })
      expect(
        cvvValidation(generateCardDetails('123'), 'cvv', jest.fn(mockLocalise))
      ).toBe(undefined)
      expect(
        cvvValidation(generateCardDetails('3214'), 'cvv', jest.fn(mockLocalise))
      ).toBe(undefined)
      expect(
        cvvValidation(generateCardDetails('12'), 'cvv', jest.fn(mockLocalise))
      ).toBe(undefined)
    })
    it('fails if user inputs 3 digit number and spaces', () => {
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: '123 ',
        expiryMonth: '02',
        expiryYear: '2019',
        paymentType: 'VISA',
      }
      expect(cvvValidation(cardDetails, 'cvv', jest.fn(mockLocalise))).toBe(
        'Only digits allowed'
      )
    })
    it('fails if user inputs letters', () => {
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: 't123test',
        expiryMonth: '02',
        expiryYear: '2019',
        paymentType: 'VISA',
      }
      expect(cvvValidation(cardDetails, 'cvv', jest.fn(mockLocalise))).toBe(
        'Only digits allowed'
      )
    })
    it('fails if user inputs symbols', () => {
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: '12!',
        expiryMonth: '02',
        expiryYear: '2019',
        paymentType: 'VISA',
      }
      expect(cvvValidation(cardDetails, 'cvv', jest.fn(mockLocalise))).toBe(
        'Only digits allowed'
      )
    })
    it('fails if user inputs only spaces', () => {
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: '   ',
        expiryMonth: '02',
        expiryYear: '2019',
        paymentType: 'VISA',
      }
      expect(cvvValidation(cardDetails, 'cvv', jest.fn(mockLocalise))).toBe(
        'Only digits allowed'
      )
    })
  })

  describe('cardExpiry', () => {
    it('returns an error message if the month is invalid', () => {
      const errorMessageMock = 'errorMessageMock'
      const today = new Date(`2019/09/01`)
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: '   ',
        expiryMonth: '13',
        expiryYear: '2019',
        paymentType: 'VISA',
      }
      expect(cardExpiry(errorMessageMock, today, cardDetails)).toBe(
        errorMessageMock
      )
    })

    it('returns an error message if the year is invalid', () => {
      const errorMessageMock = 'errorMessageMock'
      const today = new Date(`2019/09/01`)
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: '   ',
        expiryMonth: '12',
        expiryYear: '22',
        paymentType: 'VISA',
      }

      expect(cardExpiry(errorMessageMock, today, cardDetails)).toBe(
        errorMessageMock
      )
    })

    it('returns an error message if the card is expired', () => {
      const errorMessageMock = 'errorMessageMock'
      const today = new Date(`2019/09/01`)
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: '   ',
        expiryMonth: '12',
        expiryYear: '2018',
        paymentType: 'VISA',
      }

      expect(cardExpiry(errorMessageMock, today, cardDetails)).toBe(
        errorMessageMock
      )
    })

    it('return null if the expire date is valid', () => {
      const errorMessageMock = 'errorMessageMock'
      const today = new Date(`2019/09/01`)
      const cardDetails = {
        cardNumber: 4111111111111111,
        cvv: '   ',
        expiryMonth: '12',
        expiryYear: '2023',
        paymentType: 'VISA',
      }

      expect(cardExpiry(errorMessageMock, today, cardDetails)).toBe(null)
    })
  })

  describe('maxLength', () => {
    it('Should return message if object length is greater than 60', () => {
      const inputFieldLastName =
        'Long surname that is over 60 characters and we are testing the logic of the function'

      expect(
        maxLength(
          'Max Characters is 60',
          maxLengthName,
          { lastName: inputFieldLastName },
          'lastName',
          jest.fn(mockLocalise)
        )
      ).toBe('Max Characters is 60')
    })

    it('Should return null if object is less then 60', () => {
      expect(
        maxLength(
          'Max Characters is 60',
          maxLengthName,
          { lastName: '' },
          'lastName',
          jest.fn(mockLocalise)
        )
      ).toBe(null)
    })
  })

  describe('special characters validation', () => {
    it('should return null if the string contains no special characters', () => {
      const noSpecial = 'i have no special characters'
      expect(
        regexValidate(
          'Please remove special characters',
          specialChars,
          { lastName: noSpecial },
          'lastName',
          jest.fn(mockLocalise)
        )
      ).toBe(null)
    })
    it('should return an error message if the string contains special characters', () => {
      const special = 'i have no spec��ial characters'
      expect(
        regexValidate(
          'Please remove special characters',
          specialChars,
          { lastName: special },
          'lastName',
          jest.fn(mockLocalise)
        )
      ).toBe('Please remove special characters')
    })
  })
})
