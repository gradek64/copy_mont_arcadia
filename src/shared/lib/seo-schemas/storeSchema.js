// https://schema.org/ClothingStore
import addressSchema from './addressSchema'

function openingHoursSchema(openingHours) {
  return Object.keys(openingHours)
    .map((key) => {
      const hours = openingHours[key]
      const day = key[0].toUpperCase() + key[1]
      return hours ? `${day} ${hours}` : undefined
    })
    .filter((dayOpeningHours) => !!dayOpeningHours)
    .join(',')
}

export default function storeSchema({
  name,
  openingHours,
  telephoneNumber,
  address,
}) {
  return {
    '@context': 'http://schema.org',
    '@type': 'ClothingStore',
    name,
    openingHours: openingHoursSchema(openingHours),
    telephone: telephoneNumber,
    address: addressSchema({
      addressLocality: address.city,
      postalCode: address.postcode,
      streetAddress: [address.line1, address.line2]
        .filter((line) => line)
        .join(', '),
    }),
  }
}
