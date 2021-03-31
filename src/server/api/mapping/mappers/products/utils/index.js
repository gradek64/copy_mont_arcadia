import { refinementsWithValueOf2 } from '../../../constants/product'

const addCategoryToQuery = (query, category = '') => {
  if (typeof category !== 'string') return query
  if (category.includes(',')) {
    const [parentCategoryId, categoryId] = category.split(',')
    return {
      ...query,
      categoryId: categoryId || '',
      parent_categoryId: parentCategoryId || '',
    }
  }
  return {
    ...query,
    categoryId: category,
  }
}

const getRefinmentValue = (refinementName = '') => {
  return typeof refinementName === 'string' &&
    refinementsWithValueOf2.includes(refinementName.toLowerCase())
    ? 2
    : 1
}

const addRefinementsToQuery = (query, refinements = '[]') => {
  try {
    const refinementArray = JSON.parse(refinements)
    const refinementQuery = (refinementArray || [])
      .map(
        ({ key, value }) =>
          `${key}{${getRefinmentValue(key)}}~[${value.replace(/,/g, '|')}]`
      )
      .join('^')
    return {
      ...query,
      noOfRefinements: refinementArray.length,
      refinements: refinementQuery,
    }
  } catch (err) {
    return query
  }
}

export { addCategoryToQuery, getRefinmentValue, addRefinementsToQuery }
