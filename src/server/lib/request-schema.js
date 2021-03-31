/*
  Sanitisation and validation schema for incoming requests
  Keys must exactly match the route paths in route.js
  TODO all requests should be validated, or rejected
*/

export default {
  /*
    GET request query strings are sanitised according to below schema
    Sanitised only, not validated, so requests will never be rejected
    Can be used to coerce types
  */
  GET: {
    '/api/cms/page/url': {
      url: { type: 'string', $santizedURLPath: true },
    },
  },

  /*
    POST and PUT request payloads are sanitised and validated
    Currently we send invalid requests through to scrAPI and expect that it responds with localised error message
    We therefore can't yet rely on these for user facing messaging
    TODO Will need to set up localisation for the error responses from the validator (can use 'error' property below for custom message, though this is not specific to failure type)
    TODO Could/should also use this to specify value extents (min length, etc)
    Examples below

  POST: {
    '/api/account/register': {
      type: 'object',
      strict: true,
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        passwordConfirm: { type: 'string' },
        subscribe: { type: 'boolean' }
      }
    }
  },

  PUT: {
    '/api/account/changepassword': {
      type: 'object',
      strict: true,
      properties: {
        emailAddress: { type: 'string', required: true },
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
        newPasswordConfirm: { type: 'string' }
      }
    }
  }
  */
}
