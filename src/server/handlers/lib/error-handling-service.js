import * as logger from '../../lib/logger'

export default function errorHandler(request) {
  const { url } = request
  return request
    .catch((error) => {
      logger.error('error-handling unknown', { ...error, url })
      throw error
    })
    .then((result) => {
      if (!result || !result.body) return result

      // check whether the successful result returns an error in the body
      if (
        !result.body.success &&
        result.body.statusCode >= 400 &&
        result.body.statusCode < 600
      ) {
        const {
          originalMessage,
          validationErrors,
          message,
          statusCode,
        } = result.body
        const msg =
          originalMessage === 'Validation error'
            ? validationErrors[0].message
            : message
        const error = { statusCode, message: msg, type: 'form' }
        logger.error('error-handling', { ...error, url })
        throw error
      }

      return result
    })
}
