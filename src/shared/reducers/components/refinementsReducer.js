import { omit, path } from 'ramda'
import { UPDATE_LOCATION } from 'react-router-redux'
import createReducer from '../../lib/create-reducer'
import { keyValueDecodeURI } from '../../lib/query-helper'

const setRefinementOptions = (state, selectedOptions = {}) => {
  return {
    ...state,
    selectedOptions,
    appliedOptions: selectedOptions,
  }
}

export default createReducer(
  {
    isShown: false,
    selectedOptions: {},
    appliedOptions: {},
    preSelectedSize: null,
  },
  {
    OPEN_REFINEMENTS: (state) => ({
      ...state,
      isShown: true,
      appliedOptions: state.selectedOptions,
    }),
    CLOSE_REFINEMENTS: (state) => ({
      ...state,
      isShown: false,
      selectedOptions: state.appliedOptions,
    }),
    APPLY_REFINEMENTS: (state, { seoUrl = '' }) => ({
      ...state,
      appliedOptions: state.selectedOptions,
      seoUrl,
    }),
    UPDATE_OPTION_RANGE: (state, { refinement, option }) => {
      // Simply when its changed keep the new one
      return {
        ...state,
        selectedOptions: {
          ...state.selectedOptions,
          [refinement]: [...option],
        },
      }
    },
    REMOVE_OPTION_RANGE: (state, { refinement }) => {
      return {
        ...state,
        selectedOptions: omit([refinement], state.selectedOptions),
      }
    },
    CLEAR_REFINEMENT_OPTIONS: (state) => ({
      ...state,
      selectedOptions: {},
      previousOptions: null,
    }),
    SET_SEO_REFINEMENTS: (
      state,
      { refinements = [], activeRefinements = [] }
    ) => {
      const selectedOptions = refinements.reduce(
        (selected, refinement = {}) => {
          const { label, refinementOptions } = refinement
          if (!label || !refinementOptions) return selected

          const selectedValue = refinementOptions
            .filter(({ selectedFlag }) => selectedFlag)
            .map(({ value }) => value)

          return selectedValue.length
            ? { ...selected, [label.toLowerCase()]: selectedValue }
            : selected
        },
        { ...state.selectedOptions }
      )

      activeRefinements.forEach((refinement) => {
        if (refinement.propertyName && refinement.propertyName === 'nowPrice') {
          selectedOptions.price = [refinement.lowerBound, refinement.upperBound]
        }
      })

      const selectSmallestSize = (sizes) =>
        sizes && Array.isArray(sizes) && sizes[0]

      // choose smallest size for pre-selected size
      const selectedRefinementSize =
        selectSmallestSize(selectedOptions.size) ||
        selectSmallestSize(selectedOptions['shoe size']) ||
        null

      return {
        ...state,
        selectedOptions,
        preSelectedSize: selectedRefinementSize,
      }
    },
    UPDATE_LOCATION_SERVER: (
      state,
      {
        location: {
          query: { refinements = {} },
        },
      }
    ) => setRefinementOptions(state, keyValueDecodeURI(refinements)),
    [UPDATE_LOCATION]: (state, location) => {
      // { payload: { query: { refinements } = {} }, query }
      const refinements = path(['payload', 'query', 'refinements'], location)
      const sort = path(['payload', 'query', 'sort'], location)
      const currentPage = path(['payload', 'query', 'currentPage'], location)

      if (refinements) {
        return setRefinementOptions(state, keyValueDecodeURI(refinements))
      } else if (sort || currentPage) {
        return {
          ...state,
        }
      }
      return {
        ...state,
        selectedOptions: {},
        appliedOptions: {},
        previousOptions: null,
      }
    },
  }
)
