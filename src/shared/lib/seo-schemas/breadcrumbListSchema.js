// http://schema.org/BreadcrumbList

import listItemSchema from './listItemSchema'

export default function breadcrumbListSchema(breadcrumbs) {
  return {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
      .map(({ label, url }) => {
        return {
          id: url,
          name: label,
        }
      })
      .map(listItemSchema),
  }
}
