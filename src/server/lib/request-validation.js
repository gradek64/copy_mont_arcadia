import url from 'url'
import Boom from 'boom'
import inspector from 'schema-inspector'
import schema from './request-schema'

inspector.Sanitization.extend({
  santizedURLPath: (schema, candidate) => url.parse(candidate).path,
})

const getSchema = (method, path) => schema[method] && schema[method][path]

export const validate = (request, reply) => {
  const { method, path: routePath } = request.route

  const schema = getSchema(method.toUpperCase(), routePath)

  delete request.query['']

  // TODO remove once implemented for all routes
  if (!schema) {
    return reply.continue()
  }

  if (method.toLowerCase() === 'get') {
    inspector.sanitize(
      {
        type: 'object',
        strict: true,
        properties: schema,
      },
      request.query
    )
    request.payload = null
    return reply.continue()
  }
  inspector.sanitize(schema, request.payload)
  const validation = inspector.validate(schema, request.payload)
  if (!validation.valid) {
    return reply(
      Boom.badData(
        validation.error
          .map((error) => `${error.property.split('.')[1]} ${error.message}`)
          .join('\n')
      )
    )
  }
  reply.continue()
}
