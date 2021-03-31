import { normaliseRelativeUrl } from '../../../../shared/lib/url-utils'

const subCategoryCategoryFragment = (categories) => {
  if (!Array.isArray(categories)) {
    return categories
  }

  return categories.map((category) => {
    if (!category || typeof category !== 'object') {
      return category
    }

    const { url, redirectionUrl } = category

    const normalisedUrl = normaliseRelativeUrl(url)
    const normalisedRedirectUrl = normaliseRelativeUrl(redirectionUrl)

    return {
      ...category,
      redirectionUrl: normalisedRedirectUrl,
      url: normalisedUrl,
    }
  })
}

const subCategoryFragment = (subcategory) => {
  if (!subcategory || typeof subcategory !== 'object') {
    return subcategory
  }

  return Object.keys(subcategory).reduce(
    (result, key) => ({
      ...result,
      [key]: subCategoryCategoryFragment(subcategory[key]),
    }),
    {}
  )
}

const columnsFragment = (columns) => {
  if (!Array.isArray(columns)) {
    return columns
  }

  return columns.map((column) => {
    if (!columns || typeof column !== 'object') {
      return column
    }

    return {
      ...column,
      subcategories: !Array.isArray(column.subcategories)
        ? column.subcategories
        : column.subcategories.map(subCategoryFragment),
    }
  })
}

const categoryFragment = (category) => {
  const { columns, redirectionUrl, url } = category
  const normalisedUrl = normaliseRelativeUrl(url)
  const normalisedRedirectUrl = normaliseRelativeUrl(redirectionUrl)

  return {
    ...category,
    columns: columnsFragment(columns),
    url: normalisedUrl,
    redirectionUrl: normalisedRedirectUrl,
  }
}

export default function transform(data) {
  if (!data || typeof data !== 'object') {
    return data
  }

  const { categories } = data

  return {
    ...data,
    categories: !Array.isArray(categories)
      ? categories
      : categories.map(categoryFragment),
  }
}
