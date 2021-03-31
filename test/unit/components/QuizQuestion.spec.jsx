import { mount } from 'enzyme'
import React from 'react'
import QuizQuestion from '../../../src/shared/components/common/QuizQuestion/QuizQuestion'

const props = {
  isVisible: true,
  title: 'Quiz Question',
  description: 'Question description',
  options: [
    {
      text: 'Answer 1',
      points: 20,
    },
    {
      text: 'Answer 2',
      points: 10,
    },
  ],
  selectAnswer: jest.fn(),
}

const { WrappedComponent } = QuizQuestion

test('<QuizQuestion /> exists', () => {
  const component = mount(<WrappedComponent {...props} />)

  const node = component.find('.QuizQuestion')
  expect(node).toBeTruthy()

  expect(node.find('.QuizQuestion-title').length).toBe(1)
  expect(node.find('.QuizQuestion-description').length).toBe(1)
  component.unmount()
})

test('<QuizQuestion /> should be visible', () => {
  const component = mount(<WrappedComponent {...props} />)
  expect(component.find('.QuizQuestion.is-shown')).toBeTruthy()
  component.unmount()
})

test('<QuizQuestion /> should render question options', () => {
  const component = mount(<WrappedComponent {...props} />)
  expect(component.find('.QuizQuestion-option').hostNodes().length).toBe(2)
  component.unmount()
})

test('<QuizQuestion /> option should call selectAnswer', () => {
  const component = mount(<WrappedComponent {...props} />)
  const option = component.find('.QuizQuestion-option').first()

  option.simulate('click')
  expect(props.selectAnswer).toHaveBeenCalled()

  component.unmount()
})
