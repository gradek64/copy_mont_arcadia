import { sanitizeWCSJavaErrors } from '../wcsCodes'

const replaced =
  'Unfortunately we could not process your payment. An error may have occurred with your provider or you may have chosen to cancel the payment. No money has been taken from your card and the transaction has been cancelled. If you would like to continue your purchase please try again.'

describe('sanitizeWCSJavaErrors', () => {
  it('masks java errors', () => {
    expect(sanitizeWCSJavaErrors('java.')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('java.lang')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('.java.lang')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('.java.')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('.java')).toEqual('.java')

    expect(sanitizeWCSJavaErrors('com.')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('com.lang')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('.com.lang')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('.com.')).toEqual(replaced)
    expect(sanitizeWCSJavaErrors('.com')).toEqual('.com')

    expect(sanitizeWCSJavaErrors()).toEqual(undefined)
    expect(sanitizeWCSJavaErrors(null)).toEqual(null)
    expect(sanitizeWCSJavaErrors(false)).toEqual(false)
  })
})
