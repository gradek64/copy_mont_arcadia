import testComponentHelper from 'test/unit/helpers/test-component'

import Quiz from '../Quiz'
import QuizQuestion from '../../../common/QuizQuestion/QuizQuestion'
import QuizAnswer from '../../../common/QuizAnswer/QuizAnswer'

import data from './quiz-data'

const initialProps = {
  setPage: jest.fn(),
  data: { markup: JSON.stringify(data) },
}

describe('<Quiz />', () => {
  const renderComponent = testComponentHelper(Quiz.WrappedComponent)

  beforeEach(() => jest.resetAllMocks())

  describe('@renders', () => {
    it('with defaults', () => {
      const { wrapper } = renderComponent({ ...initialProps })
      expect(wrapper.find('.Quiz-header')).toHaveLength(1)
      expect(wrapper.find('.Quiz-description')).toHaveLength(1)
      expect(wrapper.find('.Quiz-container')).toHaveLength(1)
    })

    it('with quiz questions & answers', () => {
      const { wrapper } = renderComponent({ ...initialProps })
      expect(wrapper.find(QuizQuestion)).toHaveLength(4)
      expect(wrapper.find(QuizAnswer)).toHaveLength(4)
    })

    it('with same number of quicklinks as answers', () => {
      const { wrapper } = renderComponent({ ...initialProps })
      expect(wrapper.find('.Quiz-quickButton').length).toBe(
        wrapper.find(QuizAnswer).length
      )
    })
  })

  describe('@events', () => {
    it('quicklinks should call setPage', () => {
      const { wrapper } = renderComponent({ ...initialProps })

      wrapper
        .find('.Quiz-quickButton')
        .first()
        .prop('clickHandler')()

      expect(initialProps.setPage).toHaveBeenCalledTimes(1)
      expect(initialProps.setPage).toHaveBeenCalledWith(4)
    })
  })
})
