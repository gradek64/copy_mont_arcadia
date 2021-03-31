import sanitizeHtml from 'sanitize-html'
import inspector from 'schema-inspector'
import boom from 'boom'
import schema from './schema'
import { heEncode, heDecode } from '../../../shared/lib/html-entities'

const sanitizedHTMLProps = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'h1',
    'h2',
    'tfoot',
    'section',
    'article',
    'aside',
    'footer',
    'header',
    'nav',
  ]),
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src', 'alt'],
    '*': ['style'],
  },
}

//
// Cleans all the characters that are outside the Unicode set Basic Latin + Latin1.
// We use this to clear spcial characters that could harm the behaviour of our application like \u2028
// that gets returned in the Terms And Conditions response that causes the impossibility to initiate the
// Store. Another option is to just remove \u2028 by using "text.replace(/[\u2028]/g, '')" but it would
// be less defensive.
//
const cleanFromSpecialCharacter = (text) => {
  return text.replace(/[^\x20-\xFF]/g, '')
}

inspector.Sanitization.extend({
  sanitizedHTML: (schema, candidate) => {
    return cleanFromSpecialCharacter(
      sanitizeHtml(candidate, sanitizedHTMLProps)
    )
  },
  sanitizedDecodedHTML: (schema, candidate) => {
    return cleanFromSpecialCharacter(
      heEncode(sanitizeHtml(heDecode(candidate), sanitizedHTMLProps))
    )
  },
})

const getSchema = (method, path) =>
  schema[method] &&
  schema[method][Object.keys(schema[method]).find((regex) => path.match(regex))]

export default (method, path, query) => (response) => {
  const schema = getSchema(method.toUpperCase(), path)
  if (schema) {
    inspector.sanitize(schema, response.body)
    const validation = inspector.validate(schema, response.body)
    if (!validation.valid) {
      throw boom.create(
        522,
        `Invalid response from ${method.toUpperCase()} ${path}${query ||
          ''}:\n${validation.format()}`
      )
    }
  }
  return response
}

export const gatewayWithSchema = (schema, response, method, path, query) => {
  inspector.sanitize(schema, response.body)
  const validation = inspector.validate(schema, response.body)
  if (!validation.valid) {
    throw boom.create(
      522,
      `Invalid response from ${method.toUpperCase()} ${path}${query ||
        ''}:\n${validation.format()}`
    )
  }
  return response
}
