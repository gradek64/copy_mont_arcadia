import { numberTypePattern, stringTypePattern } from './utilis'

// api error response with additional WCS error code
export const errorResponseWithWcsCodeShema = (
  message,
  wcsErrorCode,
  status = 422,
  error = 'Unprocessable Entity'
) => ({
  title: 'Error Response Schema with WCS Error Code',
  type: 'object',
  required: ['statusCode', 'error', 'message', 'wcsErrorCode'],
  properties: {
    statusCode: numberTypePattern(status, status),
    error: stringTypePattern(error),
    message: stringTypePattern(message),
    wcsErrorCode: stringTypePattern(wcsErrorCode),
  },
})

// standard api error response
export const errorResponseStandardCodeShema = (
  message,
  status = 422,
  error = 'Unprocessable Entity'
) => ({
  title: 'Error Response Schema with WCS Error Code',
  type: 'object',
  required: ['statusCode', 'error', 'message'],
  properties: {
    statusCode: numberTypePattern(status, status),
    error: stringTypePattern(error),
    message: stringTypePattern(message),
  },
})
