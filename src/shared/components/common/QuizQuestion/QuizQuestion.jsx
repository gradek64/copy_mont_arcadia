import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '../../common/Button/Button'
import * as QuizActions from '../../../actions/common/quizActions'

@connect(
  () => ({}),
  { ...QuizActions }
)
class QuizQuestion extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    options: PropTypes.array,
    hasSkips: PropTypes.bool,
    isLastQuestion: PropTypes.bool,
    selectAnswer: PropTypes.func,
  }

  render() {
    const {
      isVisible,
      title,
      description,
      options,
      hasSkips,
      isLastQuestion,
      selectAnswer,
    } = this.props

    return (
      <div className={`QuizQuestion ${isVisible ? 'is-shown' : ''}`}>
        <header className="QuizQuestion-title">{title}</header>
        <p className="QuizQuestion-description">{description}</p>
        {options.map((option, i) => (
          <Button
            key={`Option${i}`} // eslint-disable-line react/no-array-index-key
            className="QuizQuestion-option"
            clickHandler={() =>
              selectAnswer(
                option.points,
                hasSkips,
                isLastQuestion,
                option.nextIndex
              )
            }
          >
            {option.text}
          </Button>
        ))}
      </div>
    )
  }
}

export default QuizQuestion
