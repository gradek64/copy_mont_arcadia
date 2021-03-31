export const compareResponse = (responseProps, schemaProps, title) => {
  const rProps = Object.keys(responseProps)
  const sProps = Object.keys(schemaProps)

  const unexpectedProperties = rProps.filter((item) => !sProps.includes(item))
  if (unexpectedProperties.length) {
    return `Unexpected properties in response: - Schema, ${title} \n${unexpectedProperties.join(
      ', \n'
    )}`
  }
}
