import Boom from 'boom'
import Mapper from '../../Mapper'
import { klarnaCookies } from './cookies/index'
import { extractCookieValue } from '../../../utils'

export default class KlarnaSession extends Mapper {
  mapEndpoint() {
    this.destinationEndpoint = '/webapp/wcs/stores/servlet/KlarnaAjaxView'
  }

  mapRequestParameters() {
    this.cookieValues = {
      sessionId: extractCookieValue('klarnaSessionId', this.headers.cookie),
      clientToken: extractCookieValue('klarnaClientToken', this.headers.cookie),
    }

    this.method = 'get'
    this.query = {
      apiMethod: 'payments',
      orderId: this.payload.orderId,
      requestType:
        this.cookieValues.sessionId && this.cookieValues.clientToken
          ? 'update_session'
          : 'create_session',
    }
    this.payload = {}
  }

  mapResponseBody(body = {}) {
    const { sessionId, clientToken, payment_method_categories } = body
    return {
      sessionId,
      clientToken,
      paymentMethodCategories: payment_method_categories,
    }
  }

  mapResponseError(body = {}) {
    throw body.error ? Boom.badData(body.error) : body
  }

  mapResponse(res) {
    const { sessionId, clientToken } = this.cookieValues
    if (res.body && res.body.error) return this.mapResponseError(res.body)

    // Creating a session: sessionId and clientToken are saved in client cookies
    if (!sessionId || !clientToken) {
      return {
        jessionid: res.jessionid,
        body: this.mapResponseBody(res.body),
        setCookies: klarnaCookies(res.body),
      }
    }

    // Updating a session: sessionId and clientToken are passed to the request in cookies and returned in the response body
    return {
      jessionid: res.jessionid,
      body: this.mapResponseBody({ ...res.body, sessionId, clientToken }),
    }
  }
}

export const klarnaSessionSpec = {
  summary: 'Create or update a Klarna session on WCS',
  parameters: [
    {
      name: 'payload',
      in: 'body',
      required: true,
      schema: {
        type: 'object',
        properties: {
          orderId: {
            type: 'integer',
            example: 12345678,
          },
        },
      },
    },
  ],
  responses: {
    200: {
      description:
        'Response from creating or updating a session. When creating a session, only the sessionToken and clientId will be returned.',
      schema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            example: '2854fc6b-eda1-51a4-81d9-6108e77830d9',
          },
          clientToken: {
            type: 'string',
            example:
              'eyJhbGciOiJub25lIn0.ewogICJzZXNzaW9uX2lkIiA6ICIyODU0ZmM2Yi1lZGExLTUxYTQtODFkOS02MTA4ZTc3ODMwZDkiLAogICJiYXNlX3VybCIgOiAiaHR0cHM6Ly9jcmVkaXQtZXUucGxheWdyb3VuZC5rbGFybmEuY29tIiwKICAiZGVzaWduIiA6ICJhcmNhZGlhLXRvcHNob3AiLAogICJsYW5ndWFnZSIgOiAiZW4iLAogICJwdXJjaGFzZV9jb3VudHJ5IiA6ICJHQiIsCiAgImFuYWx5dGljc19wcm9wZXJ0eV9pZCIgOiAiVUEtMzYwNTMxMzctMTEiLAogICJ0cmFjZV9mbG93IiA6IGZhbHNlLAogICJlbnZpcm9ubWVudCIgOiAicGxheWdyb3VuZCIsCiAgIm1lcmNoYW50X25hbWUiIDogIks1MDA0MDEiLAogICJzZXNzaW9uX3R5cGUiIDogIkNSRURJVCIsCiAgImNsaWVudF9ldmVudF9iYXNlX3VybCIgOiAiaHR0cHM6Ly9ldnQucGxheWdyb3VuZC5rbGFybmEuY29tIgp9.',
          },
          paymentMethodCategories: {
            type: 'string',
            example: 'pay_later,pay_over_time',
          },
        },
      },
    },
  },
}
