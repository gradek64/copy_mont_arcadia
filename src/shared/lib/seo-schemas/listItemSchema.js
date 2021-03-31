// http://schema.org/ListItem

export default function listItemSchema({ id, name }, position) {
  return {
    '@context': 'http://schema.org',
    '@type': 'ListItem',
    position,
    item: {
      '@id': id,
      name,
    },
  }
}
