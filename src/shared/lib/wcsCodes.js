// Sometimes WCS returns us java.lang. exceptions and we want to ignore all "technical errors" and have it be replaced with a generic error

export const WCS_ERRORS = {
  OUT_OF_STOCK: '_API_CANT_RESOLVE_FFMCENTER.2',
  SAME_PASSWORD_RESET: '.2260',
}

export const WCS_PENDING_PAYMENT_STATUS_CODE = 'P'

export const sanitizeWCSJavaErrors = (error) => {
  const genericError =
    'Unfortunately we could not process your payment. An error may have occurred with your provider or you may have chosen to cancel the payment. No money has been taken from your card and the transaction has been cancelled. If you would like to continue your purchase please try again.'

  if (error && (error.includes('java.') || error.includes('com.'))) {
    return genericError
  }

  return error
}
