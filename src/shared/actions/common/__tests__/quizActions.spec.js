import * as actions from '../quizActions'
import { mockStoreCreator } from '../../../../../test/unit/helpers/get-redux-mock-store'

describe('Quiz Actions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('updatePoints', () => {
    it('should call `UPDATE_POINTS` with points', () => {
      const points = 5
      expect(actions.updatePoints(points)).toEqual({
        type: 'UPDATE_POINTS',
        points,
      })
    })
  })
  describe('clearPoints', () => {
    it('should call `CLEAR_POINTS`', () => {
      expect(actions.clearPoints()).toEqual({
        type: 'CLEAR_POINTS',
      })
    })
  })
  describe('nextPage', () => {
    it('should call `NEXT_QUIZ_PAGE`', () => {
      expect(actions.nextPage()).toEqual({
        type: 'NEXT_QUIZ_PAGE',
      })
    })
  })
  describe('setPage', () => {
    it('should call `SET_QUIZ_PAGE` with page', () => {
      const page = 2
      expect(actions.setPage(page)).toEqual({
        type: 'SET_QUIZ_PAGE',
        page,
      })
    })
  })
  describe('selectAnswer', () => {
    const initialState = {
      quiz: {
        points: 3,
        page: 1,
      },
    }
    it('should call `UPDATE_POINTS` with points and `NEXT_QUIZ_PAGE` by default', () => {
      const store = mockStoreCreator(initialState)
      store.dispatch(actions.selectAnswer(7))
      const actionsCalled = store.getActions()
      expect(actionsCalled[0]).toEqual({ points: 7, type: 'UPDATE_POINTS' })
      expect(actionsCalled[1]).toEqual({ type: 'NEXT_QUIZ_PAGE' })
    })
    it('should call `UPDATE_POINTS` with points and with `SET_QUIZ_PAGE` page number if skipped', () => {
      const store = mockStoreCreator(initialState)
      store.dispatch(actions.selectAnswer(7, true, false, 3))
      const actionsCalled = store.getActions()
      expect(actionsCalled[0]).toEqual({ points: 7, type: 'UPDATE_POINTS' })
      expect(actionsCalled[1]).toEqual({ page: 3, type: 'SET_QUIZ_PAGE' })
    })
    it('should call `UPDATE_POINTS` with points and with `SET_QUIZ_PAGE` page number if lastPage', () => {
      const store = mockStoreCreator(initialState)
      store.dispatch(actions.selectAnswer(7, false, true, 3))
      const actionsCalled = store.getActions()
      expect(actionsCalled[0]).toEqual({ points: 7, type: 'UPDATE_POINTS' })
      expect(actionsCalled[1]).toEqual({ page: 3, type: 'SET_QUIZ_PAGE' })
    })
  })
  describe('clearQuiz', () => {
    const initialState = {
      quiz: {
        points: 3,
        page: 1,
      },
    }
    it('should set page and points to 0', () => {
      const store = mockStoreCreator(initialState)
      store.dispatch(actions.clearQuiz())
      const actionsCalled = store.getActions()
      expect(actionsCalled[0]).toEqual({ page: 0, type: 'SET_QUIZ_PAGE' })
      expect(actionsCalled[1]).toEqual({ type: 'CLEAR_POINTS' })
    })
  })
})
