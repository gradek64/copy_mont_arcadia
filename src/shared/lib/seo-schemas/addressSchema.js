// https://schema.org/PostalAddress
import { pickBy, identity } from 'ramda'

export default function addressSchema({
  addressLocality,
  postalCode,
  streetAddress,
}) {
  return pickBy(identity, {
    '@type': 'PostalAddress',
    addressLocality,
    postalCode,
    streetAddress,
  })
}
