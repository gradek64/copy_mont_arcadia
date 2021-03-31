import { UPDATE_LOCATION } from 'react-router-redux'

import refinementsReducer from '../refinementsReducer'

describe('Refinements Reducer', () => {
  describe('UPDATE_LOCATION_SERVER', () => {
    it('should update refinements', () => {
      const action = {
        type: 'UPDATE_LOCATION_SERVER',
        location: {
          query: {
            refinements: 'colour:black',
          },
        },
      }
      const { selectedOptions } = refinementsReducer({}, action)
      expect(selectedOptions).toEqual({ colour: ['black'] })
    })
  })

  describe(UPDATE_LOCATION, () => {
    it('should update refinements', () => {
      const action = {
        type: UPDATE_LOCATION,
        payload: {
          query: {
            refinements: 'colour:black',
          },
        },
      }
      const { selectedOptions } = refinementsReducer({}, action)
      expect(selectedOptions).toEqual({ colour: ['black'] })
    })

    it('should clear refinements if no refinements query', () => {
      const state = {
        selectedOptions: {
          colour: ['black', 'red'],
        },
      }
      const action = {
        type: UPDATE_LOCATION,
        payload: {},
      }
      const { selectedOptions } = refinementsReducer(state, action)
      expect(selectedOptions).toEqual({})
    })

    it('should NOT clear the refinement applyed if query is sort', () => {
      const state = {
        selectedOptions: {
          colour: ['black', 'red'],
        },
      }
      const action = {
        type: UPDATE_LOCATION,
        payload: { query: { sort: 'best' } },
      }
      const { selectedOptions } = refinementsReducer(state, action)
      expect(selectedOptions).toEqual({ colour: ['black', 'red'] })
    })

    it('should NOT clear the refinement applied if query is paging', () => {
      const state = {
        selectedOptions: {
          colour: ['black', 'red'],
        },
      }
      const action = {
        type: UPDATE_LOCATION,
        payload: { query: { currentPage: '3' } },
      }
      const { selectedOptions } = refinementsReducer(state, action)
      expect(selectedOptions).toEqual({ colour: ['black', 'red'] })
    })
  })
  describe('REMOVE_OPTION_RANGE', () => {
    it('should remove price entry from selectedOptions', () => {
      const selectedOptions = {
        price: [10, 15],
        size: [4, 6],
      }
      expect(
        refinementsReducer(
          { selectedOptions },
          {
            type: 'REMOVE_OPTION_RANGE',
            refinement: 'price',
          }
        )
      ).toEqual({ selectedOptions: { size: [4, 6] } })
    })
  })
  describe('UPDATE_OPTION_RANGE', () => {
    it('should replace refinements', () => {
      const selectedOptions = {
        pricing: [3, 10],
      }
      expect(
        refinementsReducer(
          { selectedOptions },
          {
            type: 'UPDATE_OPTION_RANGE',
            refinement: 'pricing',
            option: [20, 30],
          }
        )
      ).toEqual({ selectedOptions: { pricing: [20, 30] } })
    })
  })
  describe('CLEAR_REFINEMENT_OPTIONS', () => {
    it('should clear refinements', () => {
      const selectedOptions = {
        pricing: [3, 10],
      }
      expect(
        refinementsReducer(
          { selectedOptions },
          {
            type: 'CLEAR_REFINEMENT_OPTIONS',
          }
        )
      ).toEqual({
        selectedOptions: {},
        previousOptions: null,
      })
    })
  })
  describe('APPLY_REFINEMENTS', () => {
    it('should apply selected refinements', () => {
      const selectedOptions = {
        pricing: [3, 10],
      }
      expect(
        refinementsReducer(
          { selectedOptions },
          {
            type: 'APPLY_REFINEMENTS',
            seoUrl: 'AAAA',
          }
        )
      ).toEqual({
        selectedOptions,
        appliedOptions: selectedOptions,
        seoUrl: 'AAAA',
      })
    })
  })
  describe('CLOSE_REFINEMENTS', () => {
    it('should close refinements', () => {
      const appliedOptions = {
        pricing: [3, 10],
      }
      expect(
        refinementsReducer(
          { appliedOptions },
          {
            type: 'CLOSE_REFINEMENTS',
          }
        )
      ).toEqual({
        selectedOptions: appliedOptions,
        appliedOptions,
        isShown: false,
      })
    })
  })
  describe('OPEN_REFINEMENTS', () => {
    it('should open refinements', () => {
      const selectedOptions = {
        pricing: [3, 10],
      }
      expect(
        refinementsReducer(
          { selectedOptions },
          {
            type: 'OPEN_REFINEMENTS',
          }
        )
      ).toEqual({
        selectedOptions,
        appliedOptions: selectedOptions,
        isShown: true,
      })
    })
  })
  describe('SET_SEO_REFINEMENTS', () => {
    it('should modify refinements', () => {
      const refinements = [
        {
          label: 'Size',
          refinementOptions: [
            {
              selectedFlag: true,
              value: 2,
            },
          ],
        },
      ]
      expect(
        refinementsReducer(
          {},
          {
            type: 'SET_SEO_REFINEMENTS',
            refinements,
          }
        )
      ).toEqual({
        preSelectedSize: 2,
        selectedOptions: {
          size: [2],
        },
      })
    })
    it('should not set preSelectedSize if size is not present', () => {
      const refinements = [
        {
          label: 'Fit',
          refinementOptions: [
            {
              selectedFlag: true,
              value: 'Loose',
            },
          ],
        },
      ]
      expect(
        refinementsReducer(
          {},
          {
            type: 'SET_SEO_REFINEMENTS',
            refinements,
          }
        )
      ).toEqual({
        preSelectedSize: null,
        selectedOptions: {
          fit: ['Loose'],
        },
      })
    })
    it('should set preSelectedSize first size in the array (the smallest size)', () => {
      const refinements = [
        {
          label: 'Size',
          refinementOptions: [
            {
              selectedFlag: true,
              value: 2,
            },
            {
              selectedFlag: true,
              value: 4,
            },
            {
              selectedFlag: true,
              value: 20,
            },
          ],
        },
      ]

      expect(
        refinementsReducer(
          {},
          {
            type: 'SET_SEO_REFINEMENTS',
            refinements,
          }
        )
      ).toEqual({
        preSelectedSize: 2,
        selectedOptions: {
          size: [2, 4, 20],
        },
      })
    })
    it('should set preSelectedSize first shoe size in the array (the smallest size)', () => {
      const refinements = [
        {
          label: 'Shoe Size',
          refinementOptions: [
            {
              selectedFlag: true,
              value: 5,
            },
            {
              selectedFlag: true,
              value: 6,
            },
            {
              selectedFlag: true,
              value: 20,
            },
          ],
        },
      ]

      expect(
        refinementsReducer(
          {},
          {
            type: 'SET_SEO_REFINEMENTS',
            refinements,
          }
        )
      ).toEqual({
        preSelectedSize: 5,
        selectedOptions: {
          'shoe size': [5, 6, 20],
        },
      })
    })
    it('should prioritize size refinement over shoe size when deciding the value to set in preSelectedSize', () => {
      const refinements = [
        {
          label: 'Shoe Size',
          refinementOptions: [
            {
              selectedFlag: true,
              value: 6,
            },
          ],
        },
        {
          label: 'Size',
          refinementOptions: [
            {
              selectedFlag: true,
              value: 10,
            },
          ],
        },
      ]

      expect(
        refinementsReducer(
          {},
          {
            type: 'SET_SEO_REFINEMENTS',
            refinements,
          }
        )
      ).toEqual({
        preSelectedSize: 10,
        selectedOptions: {
          size: [10],
          'shoe size': [6],
        },
      })
    })
    it('should return empty selectedOptions if no label', () => {
      const refinements = [
        {
          refinementOptions: [
            {
              selectedFlag: true,
              value: 2,
            },
          ],
        },
      ]
      expect(
        refinementsReducer(
          {},
          {
            type: 'SET_SEO_REFINEMENTS',
            refinements,
          }
        )
      ).toEqual({
        preSelectedSize: null,
        selectedOptions: {},
      })
    })
    it('should return empty selectedOptions if no refinementOptions', () => {
      const refinements = [
        {
          label: 'Size',
          refinementOptions: [],
        },
      ]
      expect(
        refinementsReducer(
          {},
          {
            type: 'SET_SEO_REFINEMENTS',
            refinements,
          }
        )
      ).toEqual({
        preSelectedSize: null,
        selectedOptions: {},
      })
    })
  })
})
