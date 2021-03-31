import superagent from 'superagent'
import Boom from 'boom'
import { path } from 'ramda'
import { getSiteConfig } from '../config/index'

const mapResponseBody = (response) => {
  const link = path(['data', 0, 'definition'], response)
  // There is an edge case where the error below could be generated.
  // After registration if we quickly click on the notification option (as soon as the overlay disappear) the link is undefined.
  // We send the memberId as expected but for some unknown reasons exponea does not return the link
  if (!link) throw Boom.badData('EXPONEA LINK NOT AVAILABLE')

  return link
}

export default (req, reply) => {
  const url = 'https://api.mktg.arcadiagroup.co.uk/managed-tags/show'

  const {
    info: { hostname },
    payload: { memberId },
  } = req

  const brand = getSiteConfig(hostname)

  const exponeaPayload = {
    company_id: brand.company_id,
    current_url: brand.current_url,
    customer_ids: {
      hash_member_id: memberId,
    },
  }

  return superagent
    .post(url)
    .send(exponeaPayload)
    .then(({ body }) => {
      reply({ link: mapResponseBody(body) })
    })
    .catch(reply)
}
