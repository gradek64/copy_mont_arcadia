import testReducer from '../quizReducer'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'

describe('Quiz Reducer', () => {
  it('Default values', () => {
    const state = configureMockStore().getState()
    expect(state.quiz.points).toBe(0)
    expect(state.quiz.page).toBe(0)
  })
  describe('UPDATE_POINTS', () => {
    it('should add points to points in state', () => {
      expect(
        testReducer(
          { points: 20 },
          {
            type: 'UPDATE_POINTS',
            points: 4,
          }
        )
      ).toEqual({
        points: 24,
      })
    })
  })
  describe('CLEAR_POINTS', () => {
    it('should set points to 0', () => {
      expect(
        testReducer(
          { points: 20 },
          {
            type: 'CLEAR_POINTS',
          }
        )
      ).toEqual({
        points: 0,
      })
    })
  })
  describe('NEXT_QUIZ_PAGE', () => {
    it('should set next page (index + 1)', () => {
      expect(
        testReducer(
          { page: 6 },
          {
            type: 'NEXT_QUIZ_PAGE',
          }
        )
      ).toEqual({
        page: 7,
      })
    })
  })
  describe('SET_QUIZ_PAGE', () => {
    it('should set page', () => {
      expect(
        testReducer(
          { page: 6 },
          {
            type: 'SET_QUIZ_PAGE',
            page: 1,
          }
        )
      ).toEqual({
        page: 1,
      })
    })
  })
})
