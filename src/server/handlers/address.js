import superagent from 'superagent'
import Boom from 'boom'

const parseAddress = ({
  addressLine1,
  addressLine2,
  townCity,
  country,
  postcode,
  state,
}) => ({
  address1: addressLine1,
  address2: addressLine2,
  city: townCity,
  country,
  postcode,
  state,
})

const parseAddressList = ({ picklistList }) => picklistList

const parseResponse = (response) => {
  if (!response.text) {
    throw Boom.badData('Invalid Address')
  }

  const address = JSON.parse(response.text)
  if (address.error) {
    throw Boom.badData(address.error)
  }
  return address
}

export const list = (req, reply) => {
  superagent
    .get(process.env.API_FIND_ADDRESS)
    .query({
      method: 'search',
      country: req.query.country,
      postcode: req.query.postcode,
      address: req.query.address,
    })
    .then(parseResponse)
    .then(parseAddressList)
    .then(reply)
    .catch(reply)
}

export const getByMoniker = (req, reply) => {
  superagent
    .get(process.env.API_FIND_ADDRESS)
    .query({
      method: 'address',
      country: req.query.country,
      moniker: req.params.moniker,
    })
    .then(parseResponse)
    .then(parseAddress)
    .then(reply)
    .catch(reply)
}
