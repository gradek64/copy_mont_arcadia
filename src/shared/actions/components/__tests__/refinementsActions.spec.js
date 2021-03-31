import { browserHistory } from 'react-router'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import * as refinementsActions from '../refinementsActions'
import * as routingSelectors from '../../../selectors/routingSelectors'
import * as refinementsSelectors from '../../../selectors/refinementsSelectors'

jest.mock('../../../selectors/routingSelectors')
jest.mock('../../../selectors/refinementsSelectors')

describe('Refinements Actions', () => {
  const seoUrl =
    '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl'

  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('toggleRefinements', () => {
    it('should dispatch `OPEN_REFINEMENTS` if is shown', () => {
      const dispatchMock = jest.fn()
      const action = refinementsActions.toggleRefinements(true)
      action(dispatchMock)
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'OPEN_REFINEMENTS',
      })
    })

    it('should dispatch `CLOSE_REFINEMENTS` if not shown', () => {
      const dispatchMock = jest.fn()
      const action = refinementsActions.toggleRefinements(false)
      action(dispatchMock)
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'CLOSE_REFINEMENTS',
      })
    })
  })
  it('removeOptionRange()', () => {
    expect(refinementsActions.removeOptionRange('price')).toEqual({
      type: 'REMOVE_OPTION_RANGE',
      refinement: 'price',
    })
  })
  it('updateOptionRange()', () => {
    expect(refinementsActions.updateOptionRange('price', [10, 15])).toEqual({
      type: 'UPDATE_OPTION_RANGE',
      refinement: 'price',
      option: [10, 15],
    })
  })
  it('clearRefinements()', () => {
    expect(refinementsActions.clearRefinements()).toEqual({
      type: 'CLEAR_REFINEMENT_OPTIONS',
    })
  })
  it('setSeoRefinements()', () => {
    expect(refinementsActions.setSeoRefinements('refinements')).toEqual({
      type: 'SET_SEO_REFINEMENTS',
      refinements: 'refinements',
      activeRefinements: [],
    })
  })
  describe('applyRefinements()', () => {
    const fakeState = Object.freeze({ foo: 'bar' })

    const mockDispatch = jest.fn()
    const mockGetState = () => fakeState

    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(browserHistory, 'push').mockImplementation(() => {})
    })

    it('should dispatch an APPLY_REFINEMENTS action', () => {
      refinementsSelectors.getRefinementOptions.mockReturnValue({
        appliedOptions: {},
        selectedOptions: {},
      })

      const action = refinementsActions.applyRefinements('/foo')
      action(mockDispatch, mockGetState)

      expect(mockDispatch).toHaveBeenCalledTimes(1)
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'APPLY_REFINEMENTS',
        seoUrl: '/foo',
      })
    })

    it('should strip the query string from the SEO path', () => {
      routingSelectors.getRoutePath.mockReturnValue('/some/old/path')

      const action = refinementsActions.applyRefinements(
        '/something/that/looks/ok?foo=bar'
      )
      action(mockDispatch, mockGetState)

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'APPLY_REFINEMENTS',
        seoUrl: '/something/that/looks/ok',
      })

      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: '/something/that/looks/ok',
      })
    })

    describe('with a valid SEO path', () => {
      const seoPath = '/something/that/looks/ok'

      it('should push the new path into browserHistory', () => {
        routingSelectors.getRoutePath.mockReturnValue('/some/old/path')

        const action = refinementsActions.applyRefinements(seoPath)
        action(mockDispatch, mockGetState)

        expect(routingSelectors.getRoutePath).toHaveBeenCalledWith(fakeState)
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith({
          pathname: seoPath,
        })
      })

      it(`should not update browserHistory when the path hasn't changed`, () => {
        routingSelectors.getRoutePath.mockReturnValue(seoPath)

        const action = refinementsActions.applyRefinements(seoPath)
        action(mockDispatch, mockGetState)

        expect(browserHistory.push).not.toHaveBeenCalled()
      })
    })

    const invalidSeoPaths = ['/N-invalid', undefined]

    invalidSeoPaths.forEach((invalidSeoPath) => {
      describe(`with an invalid SEO path [${invalidSeoPath}]`, () => {
        const pathname = '/some/path/name'

        describe('when the refinements have changed', () => {
          beforeEach(() => {
            refinementsSelectors.getRefinementOptions.mockReturnValue({
              appliedOptions: {
                fish: ['legs'],
              },
              selectedOptions: {
                fish: ['legs', 'feet'],
                frog: ['hair'],
              },
            })
          })

          it('should push the new refinements query string into browserHistory', () => {
            routingSelectors.getLocation.mockReturnValue({
              pathname,
              query: { refinements: 'old refinements param' },
            })

            const action = refinementsActions.applyRefinements(invalidSeoPath)
            action(mockDispatch, mockGetState)

            expect(
              refinementsSelectors.getRefinementOptions
            ).toHaveBeenCalledWith(fakeState)
            expect(browserHistory.push).toHaveBeenCalledTimes(1)
            expect(browserHistory.push).toHaveBeenCalledWith({
              pathname,
              query: {
                refinements: 'fish:legs,fish:feet,frog:hair',
              },
            })
          })

          it('should revert to the first page', () => {
            routingSelectors.getLocation.mockReturnValue({
              pathname,
              query: {
                currentPage: 123,
              },
            })

            const action = refinementsActions.applyRefinements(invalidSeoPath)
            action(mockDispatch, mockGetState)

            expect(browserHistory.push).toHaveBeenCalledWith({
              pathname,
              query: {
                refinements: 'fish:legs,fish:feet,frog:hair',
              },
            })
          })

          it('should remove the refinements query param if refinements are empty', () => {
            refinementsSelectors.getRefinementOptions.mockReturnValue({
              appliedOptions: {
                fish: ['legs'],
              },
              selectedOptions: {},
            })
            routingSelectors.getLocation.mockReturnValue({
              pathname,
              query: {
                refinements: 'old refinements param',
              },
            })

            const action = refinementsActions.applyRefinements(invalidSeoPath)
            action(mockDispatch, mockGetState)

            expect(browserHistory.push).toHaveBeenCalledWith({
              pathname,
              query: {},
            })
          })
        })

        it(`should not update browserHistory when the refinements haven't changed`, () => {
          refinementsSelectors.getRefinementOptions.mockReturnValue({
            appliedOptions: { fish: ['legs'] },
            selectedOptions: { fish: ['legs'] },
          })
          routingSelectors.getLocation.mockReturnValue({
            pathname,
            query: {},
          })

          const action = refinementsActions.applyRefinements(invalidSeoPath)
          action(mockDispatch, mockGetState)

          expect(browserHistory.push).not.toHaveBeenCalled()
        })
      })
    })
  })
  describe('cacheSeoUrl()', () => {
    it('dispatches a CACHE_SEOURL action', () => {
      expect(refinementsActions.cacheSeoUrl(seoUrl)).toEqual({
        type: 'CACHE_SEOURL',
        seoUrl,
      })
    })
  })
  describe('clearSeoUrl()', () => {
    it('dispatches a CLEAR_SEOURL action', () => {
      expect(refinementsActions.clearSeoUrl()).toEqual({
        type: 'CLEAR_SEOURL',
      })
    })
  })
  describe('loadingRefinements()', () => {
    it('dispatches a LOADING_REFINEMENTS action', () => {
      const isLoading = true

      expect(refinementsActions.loadingRefinements(isLoading)).toEqual({
        type: 'LOADING_REFINEMENTS',
        isLoading,
      })
    })
  })
  describe('updateRefinements()', () => {
    it('dispatches updateProductsRefinements and cacheSeoUrl with expected action', async () => {
      const mockDispatch = jest.fn(() => Promise.resolve({}))
      const action = refinementsActions.updateRefinements(seoUrl)
      await action(mockDispatch)

      expect(mockDispatch).toHaveBeenCalledTimes(2)
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CACHE_SEOURL',
        seoUrl,
      })
    })
  })
  describe('resetRefinements()', () => {
    it('dispatches updateProductsRefinements and clearSeoUrl with expected action', async () => {
      const dummyState = {
        products: { location: { pathname: '/spider/verse' } },
      }
      const mockDispatch = jest.fn(() => Promise.resolve({}))
      const mockGetState = () => dummyState
      const action = refinementsActions.resetRefinements()
      await action(mockDispatch, mockGetState)

      expect(mockDispatch).toHaveBeenCalledTimes(2)
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR_SEOURL' })
    })
  })
  describe('applyRefinementsMobile()', () => {
    const dummyState = Object.freeze({ refinementsV2: { seoUrlCache: seoUrl } })

    const mockDispatch = jest.fn()
    const mockGetState = () => dummyState
    jest.spyOn(browserHistory, 'push').mockImplementation(() => {})

    beforeEach(() => jest.clearAllMocks())
    it('should push the cached seoUrl into browserHistory and clear cached url afterwards', () => {
      const action = refinementsActions.applyRefinementsMobile()
      action(mockDispatch, mockGetState)

      expect(browserHistory.push).toHaveBeenCalledTimes(1)
      expect(browserHistory.push).toHaveBeenLastCalledWith(seoUrl)
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CLEAR_SEOURL',
      })
    })

    it('should not push anything into browserHistory if cached seoUrl is null', () => {
      const action = refinementsActions.applyRefinementsMobile()
      action(mockDispatch, () =>
        Object.freeze({ refinementsV2: { seoUrlCache: null } })
      )

      expect(browserHistory.push).toHaveBeenCalledTimes(0)
    })
  })
})
describe('Refinements Actions and Reducers', () => {
  describe('removeOptionRange', () => {
    it('should remove proper entry from selectedOptions', () => {
      const store = configureMockStore({
        refinements: {
          selectedOptions: {
            price: [10, 40],
            size: [4, 6, 8],
          },
        },
      })
      store.dispatch(refinementsActions.removeOptionRange('price'))
      expect(store.getState().refinements.selectedOptions).toEqual({
        size: [4, 6, 8],
      })
    })
  })
})
