import { path, isEmpty, pathOr } from 'ramda'
import { createSelector } from 'reselect'
import { rootProductsSelector } from './productSelectors'
import { isPriceFilter } from '../lib/products-utils'

export const getActiveRefinementsState = (state) =>
  path(['products', 'activeRefinements'], state)

export const getActiveRefinements = createSelector(
  [getActiveRefinementsState],
  (refinements) => {
    if (refinements) {
      // Currently only supported in CoreAPI
      const activeRefinements = {}
      refinements.forEach((refinement) => {
        const propertyName = refinement.propertyName
        const dimensionName = refinement.dimensionName
        const lowerBound = refinement.lowerBound
        const upperBound = refinement.upperBound
        if (propertyName && propertyName.toUpperCase() === 'NOWPRICE') {
          activeRefinements[propertyName] = {}
          activeRefinements[propertyName].key = propertyName.toUpperCase()
          activeRefinements[propertyName].title = 'Price'
          activeRefinements[propertyName].values = [
            {
              key: `${propertyName}${lowerBound}${upperBound}`.toUpperCase(),
              label: '',
              lowerBound,
              upperBound,
            },
          ]
        } else {
          if (!activeRefinements[dimensionName]) {
            activeRefinements[dimensionName] = {}
            activeRefinements[dimensionName].key = dimensionName.toUpperCase()
            activeRefinements[dimensionName].title =
              refinement.properties.refinement_name
            activeRefinements[dimensionName].values = []
          }
          activeRefinements[dimensionName].values.push({
            key: refinement.properties.SourceId.toUpperCase(),
            label: refinement.label,
            seoUrl: path(['removeAction', 'navigationState'], refinement),
          })
        }
      })
      return Object.keys(activeRefinements).map((key) => {
        return activeRefinements[key]
      })
    }
    return []
  }
)

export const isFilterSelected = (state) => (refinement, value) => {
  const currentFiltersSelected = getActiveRefinements(state)
  let isSelectedValue = false // default
  currentFiltersSelected.forEach((activeRef) => {
    if (activeRef.title.toLowerCase() === refinement && activeRef.values) {
      activeRef.values.forEach((activeValues) => {
        if (activeValues.label === value) {
          isSelectedValue = true
        }
      })
    }
  })

  return isSelectedValue
}

const getSelectedOptions = (state) => {
  return pathOr({}, ['refinements', 'selectedOptions'], state)
}
export const getSelectedRefinements = createSelector(
  [getSelectedOptions],
  (selectedOptions) => {
    return Object.entries(selectedOptions).map(([key, options]) => ({
      key,
      value: options.join(','),
    }))
  }
)

export const getRefinements = createSelector(
  rootProductsSelector,
  ({ refinements = [] }) =>
    refinements.filter((refinement) => refinement && !isEmpty(refinement))
)

export const getAppliedOptions = (state) =>
  pathOr({}, ['refinements', 'appliedOptions'], state)

export const getSeoUrlCache = (state) =>
  pathOr('', ['refinementsV2', 'seoUrlCache'], state)

const getRouteSearch = (state) =>
  pathOr('', ['routing', 'location', 'search'], state)

export const getLowerCaseAppliedOptionsKeys = createSelector(
  getAppliedOptions,
  (appliedOptions) =>
    Object.keys(appliedOptions).map(
      (x) => (typeof x === 'string' ? x.toLowerCase() : x)
    )
)

export const isRefinementsSelected = createSelector(
  getRefinements,
  getSeoUrlCache,
  getRouteSearch,
  (productRefinements, seoUrl, searchParam) => {
    const selectedRefinements = productRefinements.filter((refinement) => {
      return (
        refinement.refinementOptions &&
        refinement.refinementOptions.filter((option) => option.selectedFlag)
          .length > 0
      )
    })

    return (
      selectedRefinements.length > 0 ||
      isPriceFilter(searchParam) ||
      isPriceFilter(seoUrl)
    )
  }
)

export const getRefinementOptions = ({
  refinements: { selectedOptions, appliedOptions },
}) => ({
  selectedOptions,
  appliedOptions,
})

export const getRemoveAllFilters = (state) => {
  return pathOr(
    '',
    ['products', 'removeAllRefinement', 'navigationState'],
    state
  )
}

export const getPreSelectedSize = (state) =>
  pathOr(null, ['refinements', 'preSelectedSize'], state)
