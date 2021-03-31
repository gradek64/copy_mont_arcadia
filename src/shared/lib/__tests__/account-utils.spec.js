import { passwordMatchesPrevious } from '../account-utils'
import { WCS_ERRORS } from '../../../shared/lib/wcsCodes'

describe('passwordMatchesPrevious', () => {
  it('should return true if errorCode is the `SAME_PASSWORD_RESET`', () => {
    const errorCode = WCS_ERRORS.SAME_PASSWORD_RESET
    expect(passwordMatchesPrevious(errorCode)).toBe(true)
  })

  it('should return false if errorCode is not the `SAME_PASSWORD_RESET`', () => {
    const errorCode = 'errorCode123'
    expect(passwordMatchesPrevious(errorCode)).toBe(false)
  })
})
