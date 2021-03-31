import { WCS_ERRORS } from '../../shared/lib/wcsCodes'

/**
 * Utility function responsible to specifically map same password message by checking the errorCode
 * It returns a boolean value
 * @param errorCode
 */
export const passwordMatchesPrevious = (errorCode) =>
  errorCode === WCS_ERRORS.SAME_PASSWORD_RESET
