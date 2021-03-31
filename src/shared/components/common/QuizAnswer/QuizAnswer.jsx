import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Button from '../../common/Button/Button'
import Image from '../../common/Image/Image'
import * as QuizActions from '../../../actions/common/quizActions'

@connect(
  () => ({}),
  { ...QuizActions }
)
class QuizAnswer extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    listTitle: PropTypes.string,
    listItems: PropTypes.array,
    link: PropTypes.string,
    shopText: PropTypes.string,
    retryText: PropTypes.string,
    clearQuiz: PropTypes.func,
  }

  render() {
    const {
      isVisible,
      image,
      name,
      description,
      listTitle,
      listItems,
      link,
      shopText,
      retryText,
      clearQuiz,
    } = this.props

    return (
      <div className={`QuizAnswer ${isVisible ? 'is-shown' : ''}`}>
        {image && <Image className="QuizAnswer-image" src={image} />}
        <header className="QuizAnswer-name">{name}</header>
        <p className="QuizAnswer-description">{description}</p>

        <header className="QuizAnswer-listTitle">{listTitle}</header>
        {listItems && (
          <ul className="QuizAnswer-list">
            {listItems.map((item, i) => (
              <li
                key={`Item${i}`} // eslint-disable-line react/no-array-index-key
                className="QuizAnswer-listItem"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="QuizAnswer-buttonContainer">
          <Link
            to={link}
            className="QuizAnswer-button Button Button--halfWidth"
          >
            {shopText}
          </Link>
          <Button
            className="QuizAnswer-retryButton Button--halfWidth"
            clickHandler={clearQuiz}
          >
            {retryText}
          </Button>
        </div>
      </div>
    )
  }
}

export default QuizAnswer
