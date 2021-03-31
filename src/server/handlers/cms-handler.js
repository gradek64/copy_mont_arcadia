import superagent from '../../shared/lib/superagent'
import Boom from 'boom'
import { readFile } from 'fs'
import { join } from 'path'
import { path } from 'ramda'
import { parseCmsForm, parseFormData } from './lib/cms-service'

export function getCmsFormHandler(req, reply) {
  const formName = req.params.formName
  // TODO Remove mock data
  if (process.env.MOCK_CMS_FORM_HANDLER === 'true') {
    return readFile(join(__dirname, '/mocks/cms-form.json'), (err, data) => {
      if (err) {
        reply(Boom.wrap(err))
      } else {
        const formData = parseCmsForm(JSON.parse(data.toString('utf-8'))[0])
        reply({ ...formData, formName }).code(200)
      }
    })
  }
  superagent
    .get(
      'http://ecmcv3.arcadiagroup.ltd.uk/cms/topshop_uk/repository/pages/json/json-0000116720/json-0000116720.json'
    )
    .end((err, { text }) => {
      if (err) {
        reply(Boom.wrap(err))
      } else {
        const result = parseCmsForm(JSON.parse(text)[0])
        reply({ ...result, formName }).code(200)
      }
    })
}

/*
 * The following function has been implemented to handle correctly the submit of CMS forms and in particular the
 * scenario observed for 'Sign Up To Style Notes' form, where to complete the submit process the Server expects
 * the request to contain the cookie 'usergeo=GB' (in case of uk).
 * To achieve this we need to avoid following redirects (by default superagent follows to 5 redirects) since we
 * need to add to the subsequent requests the cookie/s contained in the set-cookie headers of the 302 responses
 * that we get. In particular the cookie 'usergeo=GB' is returned in the headers of the first redirection response.
 */
export async function recursivelyFollowRedirectsAndSetCookies(
  reply,
  formMethod,
  formData,
  action,
  encType,
  cookies = [],
  totalRedirections = 0
) {
  if (!action) return reply(Boom.wrap(new Error('Empty location')))

  // We follow at most 5 redirections which is the default number of redirections followed by superagent.
  if (totalRedirections > 4)
    return reply(
      Boom.wrap(new Error('Maximum number of redirections exceeded'))
    )

  try {
    const response = await superagent[formMethod](`${action}?geoip=noredirect`) // Force no-redirect for Akamai geoip
      .set('Content-Type', encType)
      .set(
        'User-Agent',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
      )
      .set('Cookie', cookies)
      .send(formData)
      // Avoiding default following redirection
      .redirects(0)
    reply().code(response.status)
  } catch (err) {
    if (err.status === 302) {
      // Redirect response: we proceed to add to the cookies used til now those received in this response headers.
      const newCookies = path(['response', 'headers', 'set-cookie'], err)
        ? cookies.concat(err.response.headers['set-cookie'])
        : cookies
      const redirectDestination = path(['response', 'headers', 'location'], err)
        ? err.response.headers.location
        : ''
      // Following the redirection. Use 'exports', to make it spyable in a recusive test.
      return exports.recursivelyFollowRedirectsAndSetCookies(
        reply,
        formMethod,
        formData,
        redirectDestination,
        encType,
        newCookies,
        totalRedirections + 1
      )
    }

    reply(Boom.wrap(err))
  }
}

export function montyCmsFormSubmitHandler(req, reply) {
  const { action, method, formData, encType } = req.payload

  // Following the redirection. Use 'exports', to make it spyable in a recusive test.
  return exports.recursivelyFollowRedirectsAndSetCookies(
    reply,
    method,
    formData,
    action,
    encType
  )
}

export async function cmsFormSubmitHandler(req, reply) {
  if (process.env.MOCK_CMS_FORM_HANDLER === 'true')
    return reply({ success: true }).code(200)
  const cmsForm = req.payload.cmsForm

  const {
    hiddenFields,
    formAttributes: { action, method, encType },
  } = req.payload.cmsContent
  const formData = parseFormData(cmsForm, hiddenFields)

  const formMethod = method === 'delete' ? 'del' : method

  return recursivelyFollowRedirectsAndSetCookies(
    reply,
    formMethod,
    formData,
    action,
    encType
  )
}
