import {
  getEnhancedNoSearchHelmetTitle,
  getEnhancedNoSearchRecommendationsHeader,
  getEnhancedNoSearchParagraphText,
  getEnhancedNoSearchInputPlaceholder,
  getEnhancedNoSearchSearchLabel,
  getEnhancedNoSearchHeader,
} from '../NoSearchResults.string-helpers'

const lMockFunction = jest.fn((text) => text)

describe('No Search Results String Helpers', () => {
  describe('when calling getEnhancedNoSearchSearchLabel', () => {
    it('should return the correct string for brand wl', () => {
      const actual = getEnhancedNoSearchSearchLabel('wl')
      expect(actual).toEqual(
        'Try using fewer words and make sure all words are spelled correctly.'
      )
    })
    it('should return undefined if brand supplied is non existent', () => {
      const actual = getEnhancedNoSearchSearchLabel('uu')
      expect(actual).toEqual(undefined)
    })
    it('should return undefined if no brand supplied', () => {
      const actual = getEnhancedNoSearchSearchLabel()
      expect(actual).toEqual(undefined)
    })
  })

  describe('when calling getEnhancedNoSearchInputPlaceholder', () => {
    it('should return the correct string for brand dp', () => {
      const actual = getEnhancedNoSearchInputPlaceholder('dp')
      expect(actual).toEqual('Search again?')
    })
    it('should return the correct string for brand ev', () => {
      const actual = getEnhancedNoSearchInputPlaceholder('ev')
      expect(actual).toEqual('Search again?')
    })
    it('should return undefined if brand supplied is non existent', () => {
      const actual = getEnhancedNoSearchInputPlaceholder('uu')
      expect(actual).toEqual(undefined)
    })
    it('should return undefined if no brand supplied', () => {
      const actual = getEnhancedNoSearchInputPlaceholder()
      expect(actual).toEqual(undefined)
    })
  })

  describe('when calling getEnhancedNoSearchParagraphText', () => {
    it('should return the correct string for brand ts', () => {
      const actual = getEnhancedNoSearchParagraphText('ts')
      expect(actual).toEqual(
        'Try using fewer words and make sure all words are spelled correctly.'
      )
    })
    it('should return the correct string for brand wl', () => {
      const actual = getEnhancedNoSearchParagraphText('wl')
      expect(actual).toEqual(
        'Unfortunately there were no results matching your request'
      )
    })
    it('should return undefined if brand supplied is non existent', () => {
      const actual = getEnhancedNoSearchParagraphText('uu')
      expect(actual).toEqual(undefined)
    })
    it('should return undefined if no brand supplied', () => {
      const actual = getEnhancedNoSearchParagraphText()
      expect(actual).toEqual(undefined)
    })
  })

  describe('when calling getEnhancedNoSearchRecommendationsHeader', () => {
    it('should return the correct string for brand dp', () => {
      const actual = getEnhancedNoSearchRecommendationsHeader('dp')
      expect(actual).toEqual('Open to persuasion? Try these...')
    })
    it('should return undefined if brand supplied is non existent', () => {
      const actual = getEnhancedNoSearchRecommendationsHeader('uu')
      expect(actual).toEqual(undefined)
    })
    it('should return undefined if no brand supplied', () => {
      const actual = getEnhancedNoSearchRecommendationsHeader()
      expect(actual).toEqual(undefined)
    })
  })

  describe('when calling getEnhancedNoSearchHelmetTitle', () => {
    it('should return the correct string for brand dp', () => {
      const actual = getEnhancedNoSearchHelmetTitle('dp')
      expect(actual).toEqual('Sorry your search didn’t match any products.')
    })
    it('should return default string if brand supplied is non existent', () => {
      const actual = getEnhancedNoSearchHelmetTitle('uu')
      expect(actual).toEqual('Your search did not return any results')
    })
    it('should return default string if no brand supplied', () => {
      const actual = getEnhancedNoSearchHelmetTitle()
      expect(actual).toEqual('Your search did not return any results')
    })
  })

  describe('when calling getEnhancedNoSearchHeader', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('the l function should be called with the correct parameters for dp', () => {
      const searchedTerm = 'hteadsa'

      const actual = getEnhancedNoSearchHeader(
        lMockFunction,
        'dp',
        searchedTerm
      )

      expect(lMockFunction).toHaveBeenCalledWith(
        ["Hmm... We couldn't find any results for '", "'"],
        searchedTerm
      )
      expect(actual).toEqual(["Hmm... We couldn't find any results for '", "'"])
    })
    it('the l function should be called with the correct parameters for wl', () => {
      const searchedTerm = 'hteadsa'

      const actual = getEnhancedNoSearchHeader(
        lMockFunction,
        'wl',
        searchedTerm
      )

      expect(lMockFunction).toHaveBeenCalledWith(
        ['YOU SEARCHED FOR... "', '"'],
        searchedTerm
      )
      expect(actual).toEqual(['YOU SEARCHED FOR... "', '"'])
    })
    it('the l function should be called with the correct parameters for ev', () => {
      const actual = getEnhancedNoSearchHeader(lMockFunction, 'ev')

      expect(lMockFunction).toHaveBeenCalledWith([
        `We're sorry, We couldn't find any matches for your search.`,
      ])
      expect(actual).toEqual([
        `We're sorry, We couldn't find any matches for your search.`,
      ])
    })
    it('should return a deafult string is not a brand', () => {
      const searchedTerm = 'hteadsa'
      const actual = getEnhancedNoSearchHeader(lMockFunction, '', searchedTerm)

      expect(actual).toEqual('YOUR SEARCH DID NOT RETURN ANY RESULTS')
    })
  })
})
