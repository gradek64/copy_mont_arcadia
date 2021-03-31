// https://schema.org/PropertyValue

const propertyValueSchema = ({ property, value }) => ({
  '@context': 'http://schema.org',
  '@type': 'PropertyValue',
  propertyID: property,
  value,
})

export default propertyValueSchema
