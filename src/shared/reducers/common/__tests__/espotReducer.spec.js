import deepFreeze from 'deep-freeze'
import reducer from '../espotReducer'
import {
  REMOVE_PLP_ESPOTS,
  ABANDONMENT_MODAL_ERROR,
} from '../../../actions/common/espotActions'

describe('Espot reducer', () => {
  describe('SET_ESPOT_DATA', () => {
    it('should set espot content', () => {
      const payload = deepFreeze({
        identifier: 'someESpot',
        responsiveCMSUrl: '/url',
        position: 1,
      })
      const state = reducer(
        {},
        {
          type: 'SET_ESPOT_DATA',
          payload,
        }
      )
      expect(state.cmsData).toEqual({
        [payload.identifier]: {
          responsiveCMSUrl: payload.responsiveCMSUrl,
          position: payload.position,
        },
      })
    })

    it('should update espot content', () => {
      const identifier = 'someId'
      const newResponsiveCMSUrl = '/new-url'
      const position = 1
      const payload = {
        identifier,
        responsiveCMSUrl: newResponsiveCMSUrl,
        position,
      }
      const state = reducer(
        {
          cmsData: {
            [identifier]: '/old-url',
          },
        },
        {
          type: 'SET_ESPOT_DATA',
          payload,
        }
      )
      expect(state.cmsData).toEqual({
        [identifier]: {
          responsiveCMSUrl: newResponsiveCMSUrl,
          position,
        },
      })
    })

    it('should ignore unrelated action', () => {
      const state = reducer(
        {
          content: {
            someESpot: { head: { oldkey: 'oldvalue' }, html: '<span></span>' },
          },
        },
        {
          type: 'WHATEVER',
          payload: {
            identifier: 'someESpot',
            head: { key: 'value' },
            html: '<div></div>',
          },
        }
      )
      expect(state.content).toEqual({
        someESpot: { head: { oldkey: 'oldvalue' }, html: '<span></span>' },
      })
    })
  })

  describe('REMOVE_PLP_ESPOTS', () => {
    const nonPLP1 = {
      responsiveCMSUrl: '/somewhere',
      isPlpEspot: false,
    }
    const nonPLP2 = {
      responsiveCMSUrl: '/somewhere-else',
      isPlpEspot: false,
    }
    const plp1 = {
      responsiveCMSUrl: '/yet-another',
      isPlpEspot: true,
    }
    const plp2 = {
      repsonsiveCMSUrl: '/aksdjhfhs',
      isPlpEspot: true,
    }
    it('should remove all PLP espots', () => {
      const reducedState = reducer(
        {
          cmsData: {
            nonPLP1,
            plp1,
            nonPLP2,
            plp2,
          },
        },
        { type: REMOVE_PLP_ESPOTS }
      )
      expect(reducedState).toEqual({
        cmsData: {
          nonPLP1,
          nonPLP2,
        },
      })
    })
    it('should not mutate state if cmsData does not include PLP espots', () => {
      const state = { cmsData: { nonPLP1, nonPLP2 } }
      const reducedState = reducer(state, { type: REMOVE_PLP_ESPOTS })
      expect(reducedState).toBe(state)
    })
  })

  describe('ABANDONMENT_MODAL_ERROR', () => {
    it('sets the abandonment modal error to true', () => {
      const reducedState = reducer(
        {
          errors: {
            abandonmentModalError: false,
          },
        },
        { type: ABANDONMENT_MODAL_ERROR }
      )

      expect(reducedState).toEqual({ errors: { abandonmentModalError: true } })
    })
  })
})
