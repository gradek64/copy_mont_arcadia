const helmetTitles = {
  default: 'Your search did not return any results',
  dp: 'Sorry your search didn’t match any products.',
}

export const getEnhancedNoSearchHelmetTitle = (brandCode) =>
  helmetTitles[brandCode] || helmetTitles.default

export const headerTitle = {
  default: () => 'YOUR SEARCH DID NOT RETURN ANY RESULTS',
  dp: (l, searchedTerm) =>
    l`Hmm... We couldn't find any results for '${searchedTerm}'`,
  wl: (l, searchedTerm) => l`YOU SEARCHED FOR... "${searchedTerm}"`,
  ms: (l, searchedTerm) =>
    l`We could not find any matches for your search "${searchedTerm}"`,
  ev: (l) => l`We're sorry, We couldn't find any matches for your search.`,
}

export const getEnhancedNoSearchHeader = (l, brandCode, searchedTerm) => {
  const headerTitleToRetrieve = headerTitle[brandCode] || headerTitle.default
  return headerTitleToRetrieve(l, searchedTerm)
}

const recommendationsHeaders = {
  dp: 'Open to persuasion? Try these...',
}

export const getEnhancedNoSearchRecommendationsHeader = (brandCode) =>
  recommendationsHeaders[brandCode] || recommendationsHeaders.default

const paragraphText = {
  ts: 'Try using fewer words and make sure all words are spelled correctly.',
  wl: 'Unfortunately there were no results matching your request',
}
export const getEnhancedNoSearchParagraphText = (brandCode) =>
  paragraphText[brandCode] || paragraphText.default

const inputPlaceholders = {
  dp: 'Search again?',
  ev: 'Search again?',
}
export const getEnhancedNoSearchInputPlaceholder = (brandCode) =>
  inputPlaceholders[brandCode] || inputPlaceholders.default

const searchLabels = {
  wl: `Try using fewer words and make sure all words are spelled correctly.`,
}
export const getEnhancedNoSearchSearchLabel = (brandCode) =>
  searchLabels[brandCode] || searchLabels.default
