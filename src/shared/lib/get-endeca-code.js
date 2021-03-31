import { union } from 'ramda'

function getTwoFilteredRefinements(refinements, filter) {
  let subset
  refinements.find(({ refinementOptions }) => {
    subset = refinementOptions.filter(filter)
    return subset.length > 1
  })
  return subset
}

const ENDECA_REGEX = /\/([^/?]*)(\?|$)/
function getTwoEndecaCodesFromFilters(filters) {
  return filters.slice(0, 2).map(({ seoUrl }) => {
    if (seoUrl) {
      const code = seoUrl.match(ENDECA_REGEX)
      return code && code.length > 1 && code[1]
    }
    return undefined
  })
}

const ENDECA_DELIMETER = 'Z'
// Avert your eyes and leave your sense of coding morality at the door.
// This method reverse engineers the endeca code we need from the refinements currently applied.
export function getEndecaCodeFromRefinements(refinements) {
  if (!refinements) return ''

  // Find two unselected filters from the same label
  const unselectedFilters = getTwoFilteredRefinements(
    refinements,
    ({ selectedFlag }) => !selectedFlag
  )

  // If you haven't succeeded, try find two selected filters
  const selectedFilters = unselectedFilters
    ? null
    : getTwoFilteredRefinements(refinements, ({ selectedFlag }) => selectedFlag)

  // Can't do it without one or the other.
  if (!unselectedFilters && !selectedFilters) {
    return ''
  }

  // Get just the endecaCodes from the seoUrls
  const [codeOne, codeTwo] = getTwoEndecaCodesFromFilters(
    unselectedFilters || selectedFilters
  )

  // Split the codes by the magic endeca letter
  const reference = codeOne && codeOne.split(ENDECA_DELIMETER)
  const target = codeTwo && codeTwo.split(ENDECA_DELIMETER)

  // If we have two unselected filters - use deductive logic to construct the new code
  // Preference for unselected, as order is easier to maintain
  if (unselectedFilters) {
    return (
      target &&
      target.filter((sub) => reference.includes(sub)).join(ENDECA_DELIMETER)
    )
  }

  // Selected will work, but if the order is wrong likely to hit an uncommonly hit page - so less likely to be cached
  return union(reference, target).join(ENDECA_DELIMETER)
}

// Test a url for an endeca code and extract it
const ENEDCA_CODE_REGEX = /\/(N-[^/]*)$/
export function getEndecaCodeFromUrl(url) {
  const match = url && url.match(ENEDCA_CODE_REGEX)
  return match && match.length > 1 && match[1]
}
