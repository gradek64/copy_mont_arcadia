import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '../../common/Button/Button'
import QuizQuestion from '../../common/QuizQuestion/QuizQuestion'
import QuizAnswer from '../../common/QuizAnswer/QuizAnswer'
import * as QuizActions from '../../../actions/common/quizActions'

@connect(
  (state) => ({
    points: state.quiz.points,
    page: state.quiz.page,
  }),
  { ...QuizActions }
)
class Quiz extends Component {
  static propTypes = {
    data: PropTypes.object,
    points: PropTypes.number,
    page: PropTypes.number,
    setPage: PropTypes.func,
  }

  componentDidMount() {
    /* get tallest question & set container to that height */
    const questionsHeight = this.getMaxHeight(
      document.querySelectorAll('.QuizQuestion')
    )

    if (this.quizContainer)
      this.quizContainer.style.minHeight = `${questionsHeight}px`
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { questions = [], answers } = JSON.parse(this.props.data.markup)
    const { page, points } = nextProps

    if (page === -1) {
      answers.forEach((answer, i) => {
        if (points >= answer.points[0] && points <= answer.points[1])
          this.props.setPage(i + questions.length)
      })
    }
  }

  getMaxHeight = (obj) => {
    return Object.keys(obj).reduce((prev, i) => {
      return Math.max(obj[i].scrollHeight + 30, prev)
    }, 0)
  }

  createQuicklinks = (answers, qLength) => {
    const { setPage } = this.props

    return (
      <div className="Quiz-quicklinks">
        {answers.map((answer, i) => (
          <Button
            key={`QuizQuicklink${i}`} // eslint-disable-line react/no-array-index-key
            className="Quiz-quickButton Button--tertiary Button--halfWidth"
            clickHandler={() => setPage(i + qLength)}
          >
            {answer.name}
          </Button>
        ))}
      </div>
    )
  }

  render() {
    const { data, page } = this.props
    const {
      name,
      description,
      callout,
      questions = [],
      answers = [],
      hasQuicklinks,
      hasSkips,
    } = JSON.parse(data.markup)
    const qLength = questions.length

    return (
      <div className="Quiz">
        <div className="Quiz-introduction">
          <header className="Quiz-header">{name}</header>

          {hasQuicklinks && this.createQuicklinks(answers, qLength)}

          <div className="Quiz-description">
            {callout && <span className="Quiz-callout">{callout}</span>}
            <span
              className="Quiz-descriptionText"
              dangerouslySetInnerHTML={{ __html: description }} // eslint-disable-line react/no-danger
            />
          </div>
        </div>

        <div
          className="Quiz-container"
          ref={(div) => {
            this.quizContainer = div
          }}
        >
          {questions.map((question, i) => (
            <QuizQuestion
              key={`QuizQuestion${i}`} // eslint-disable-line react/no-array-index-key
              isVisible={page === i}
              hasSkips={hasSkips}
              isLastQuestion={qLength - 1 === i}
              {...question}
            />
          ))}

          {answers.map((answer, i) => (
            <QuizAnswer
              key={`QuizAnswer${i}`} // eslint-disable-line react/no-array-index-key
              isVisible={page === i + qLength}
              {...answer}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default Quiz
