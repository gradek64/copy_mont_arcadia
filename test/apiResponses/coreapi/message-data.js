import {
  errorResponseWithWcsCodeShema,
  errorResponseStandardCodeShema,
} from './common.schema'

import { PROMOTION_CODE } from './utilis/shoppingBag'

// My Account Messages Logon Messages - /api/account/logon

export const INVALID_ACCOUNT_MSG = errorResponseWithWcsCodeShema(
  'We do not recognise this email or password, please try again.',
  '2030',
  401,
  'Unauthorized'
)

export const LOCKED_ACCOUNT_MSG = errorResponseWithWcsCodeShema(
  'Due to unsuccessful password attempts, you will be unable to logon.  Please contact Customer Services to unlock your account.',
  '2110',
  423,
  'Locked'
)

export const ACCOUNT_WAIT_MSG = errorResponseWithWcsCodeShema(
  'Please wait 30 seconds before attempting to log in again.',
  '2301',
  403,
  'Forbidden'
)

// Giftcard error messages - /api/checkout/gift-card

export const GIFTCARD_DECLINED_MESSAGE = errorResponseWithWcsCodeShema(
  'Sorry, the gift card has been declined. Please check gift card number and pin and try again.',
  'INVALID_CARD_NUMBER',
  406,
  'Not Acceptable'
)

export const INVALID_CURRENCY_MESSAGE = errorResponseWithWcsCodeShema(
  'Sorry, gift card cannot be redeemed as the currency is incorrect, please visit correct website.',
  'PPTGC_ERR_RES_BALANCE_CURRENCY_NOT_ACCEPTED',
  422,
  'Unprocessable Entity'
)

export const GIFTCARD_DUPLICATE_CARD_MESSAGE = errorResponseWithWcsCodeShema(
  'You have already used this gift card on your current order, please add a different card.',
  'PPTGC_ERR_REQ_DUPLICATE_CARD',
  409,
  'Conflict'
)

export const ZERO_BALANCE_CARD_MESSAGE = errorResponseWithWcsCodeShema(
  'Sorry the balance on your gift card is zero, please top-up the card or use a different one and try again.',
  'PPTGC_ERR_RES_ZERO_BALANCE',
  409,
  'Conflict'
)

export const INVALID_GIFTCARD_NUMBER_MESSAGE = errorResponseWithWcsCodeShema(
  'Sorry, you have entered an invalid gift card number.',
  'PPTGC_ERR_INVALID_NUMBER',
  406,
  'Not Acceptable'
)

export const INVALID_PIN_NUMBER_MESSAGE = errorResponseWithWcsCodeShema(
  'Sorry, you have entered an invalid pin number.',
  'PPTGC_ERR_INVALID_PIN',
  406,
  'Not Acceptable'
)

// Register Account Messages - POST /api/account/register

const genericValidationMessage = /Passwords must be at least \{6\} characters in length, and include \{1\} digit\(s\) and \{1\} letter\(s\). Please try again./

export const EXISTING_EMAIL = errorResponseWithWcsCodeShema(
  'Sorry you are unable to register with this email address. Please use a different email address and try again.',
  '2030',
  409,
  'Conflict'
)

export const EMPTY_EMAIL = errorResponseWithWcsCodeShema(
  'Please enter your email address.',
  'ERROR_INVALID_LOGONID',
  406,
  'Not Acceptable'
)

export const EMPTY_PASSWORD = errorResponseWithWcsCodeShema(
  'Please enter a password.',
  '2050',
  406,
  'Not Acceptable'
)

export const MISSMATCH_PASSWORD = errorResponseWithWcsCodeShema(
  'The password you have entered in the Verify Password box does not match your password. Please try again.',
  '2080',
  406,
  'Not Acceptable'
)

export const SHORT_PASSWORD = errorResponseWithWcsCodeShema(
  genericValidationMessage,
  '2200',
  406,
  'Not Acceptable'
)

export const SAME_CHARS_PASSWORD = errorResponseWithWcsCodeShema(
  /A character in your password occurs more consecutively than the allowed limit of \{3\}. Please try again./,
  '2210',
  406,
  'Not Acceptable'
)

export const ALL_NUMERIC_PASSWORD = errorResponseWithWcsCodeShema(
  genericValidationMessage,
  '2230',
  406,
  'Not Acceptable'
)

export const CHARS_LIMIT_PASSWORD = errorResponseWithWcsCodeShema(
  /A character in your password occurs more than the allowed limit of \{4\}. Please try again./,
  '2220',
  406,
  'Not Acceptable'
)

export const CONFIRM_PASSWORD = errorResponseStandardCodeShema(
  'Please confirm your password.'
)

export const ALL_CHARS_PASSWORD = errorResponseStandardCodeShema(
  genericValidationMessage
)

// Resend forgotten password - POST /account/forgetpassword

export const RESEND_PASSWORD =
  'If you have entered an email address that we recognise, you should receive a password reset email shortly. Any problems getting your email?'

// Reset password Messages - POST /account/reset_password_link

export const ACCOUNT_LOCKED = errorResponseWithWcsCodeShema(
  'Due to unsuccessful password attempts, your account is locked.  Please contact Customer Services to unlock your account.',
  2110,
  423,
  'Locked'
)

export const PASSWORD_RESET_FAILURE = errorResponseStandardCodeShema(
  'This password reset link is no longer valid. If you still need to reset your password, request another reset below.The link will expire in one hour, and can be used only once, so please check your email in the next few minutes.'
)

export const PASSWORD_RESET_SUCCESS =
  'If you have entered an email address that we recognise, you should receive a password reset email shortly. Any problems getting your email?'

// Order Summary Messages - PUT /checkout/order-summary

export const STORE_NO_LONGER_SUPPORTS_CFS = errorResponseWithWcsCodeShema(
  'Unfortunately this delivery option is no longer available for this store. Please choose another option or select an alternative store.',
  '_ERR_DELIVERY_STORE_INVALID',
  409,
  'Conflict'
)

// Order Completion Payment failure - POST /api/order

export const INVALID_CARD_NUMBER = errorResponseWithWcsCodeShema(
  'The card number is invalid.',
  '_ERR_PAY_CARD_NUMBER_INVALID',
  406,
  'Not Acceptable'
)

export const GENERIC_PAYMENT_FAILURE = errorResponseStandardCodeShema(
  'We were unable to process your card details. Please check and try again. If the problem persists please phone customer support.'
)

// ADP-165 the message schema was updated to match the current (incorrect) response until this ticket is resolved
export const INVALID_DATA_TYPE = errorResponseStandardCodeShema(
  /Authorization cancel or settlement or refund request for order \{0\} failed. Please check with WorldPay./,
  422,
  'Unprocessable Entity'
)

export const INVALID_EXPIRY_DATE = errorResponseStandardCodeShema(
  /The card expiry date \(year: 1970, month: 12\) is invalid./,
  '_DBG_API_DO_PAYMENT_BAD_XDATE',
  200
)

export const INVALID_POSTCODE = errorResponseWithWcsCodeShema(
  'Please enter a valid postcode in the Postcode box.',
  '_ERR_CMD_INVALID_PARAM.5140',
  406,
  'Not Acceptable'
)

export const INVALID_ADDRESS_FIRST_LINE = errorResponseWithWcsCodeShema(
  'Please enter a street name in the Street address box.',
  '_ERR_CMD_INVALID_PARAM.5080',
  406,
  'Not Acceptable'
)

// This is a store api response. We replace the error below with
// 'We are unable to find your address at the moment. Please enter your address manually.',
// if the statusCode is 503 or 422
export const INVALID_DELIVERY_ADDRESS_POSTCODE_AND_COUNTRY = errorResponseStandardCodeShema(
  `Error running 'doSearch'`
)

export const INVALID_PHONE_NUMBER = errorResponseWithWcsCodeShema(
  'Please ensure that your telephone number begins with a zero, contains 10 ' +
    'or more digits and is entered without spaces.',
  '_ERR_CMD_INVALID_PARAM.ERROR_CODE_INVALID_PHONE_NUMBER',
  406,
  'Not Acceptable'
)

export const INVALID_BLANK_CITY = errorResponseWithWcsCodeShema(
  'Please enter a town name in the Town box',
  '_ERR_CMD_INVALID_PARAM.5100',
  406,
  'Not Acceptable'
)

export const INVALID_ADDRESS_CHARACTERS = errorResponseWithWcsCodeShema(
  'Sorry, we are currently unable to accept accented characters in your address details. ' +
    'Please replace these characters with their equivalent e.g. é should be entered as e .',
  '_ERR_CMD_INVALID_PARAM.ERROR_INVALID_ACCENTED_CODE',
  406,
  'Not Acceptable'
)

// Promotion Code errors POST / /shopping_bag/addPromotionCode

export const CODE_ALREADY_REDEEMED = errorResponseWithWcsCodeShema(
  'The promotion can no longer be redeemed because the limit of 1 per customer has been reached.',
  'ERR_PROMOTION_PER_SHOPPER_LIMIT_EXCEEDED.-1800',
  409,
  'Conflict'
)

export const CODE_ALREADY_APPLIED = errorResponseWithWcsCodeShema(
  `This promotion ${PROMOTION_CODE}  has already been applied to this order`,
  '_ERR_PROMOTION_PER_SHOPPER_LIMIT_EXCEEDED',
  409,
  'Conflict'
)

export const CODE_INVALID = errorResponseWithWcsCodeShema(
  'The promotion code you have entered has not been recognised. Please confirm the code and try again.',
  'ERR_PROMOTION_CODE_INVALID.-1200',
  406,
  'Not Acceptable'
)

export const EMPTY_CARD_NUMBER = errorResponseWithWcsCodeShema(
  'Sorry, an error has occurred, please try again.',
  'PPTGC_ERR_REQ_INVALID_ACTION',
  502,
  'Bad Gateway'
)

// Add Delivery address errors - POST /order_summary/delivery_address

export const INVALID_PHONE_NO = errorResponseWithWcsCodeShema(
  'Please ensure that your telephone number begins with a zero, contains 10 or more digits and is entered without spaces.',
  '_ERR_CMD_INVALID_PARAM.ERROR_CODE_INVALID_PHONE_NUMBER',
  406,
  'Not Acceptable'
)

export const INVALID_STATE = errorResponseWithWcsCodeShema(
  'Please enter a valid state.',
  '_ERR_CMD_INVALID_PARAM.ERROR_INVALID_STATE',
  406,
  'Not Acceptable'
)

export const INVALID_LAST_NAME = errorResponseWithWcsCodeShema(
  'Please enter a name in the Last name box.',
  '_ERR_CMD_INVALID_PARAM.5060',
  406,
  'Not Acceptable'
)
