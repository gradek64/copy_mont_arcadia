import { mount } from 'enzyme'
import React, { Component as mockComponent } from 'react'
import QuizAnswer from '../../../src/shared/components/common/QuizAnswer/QuizAnswer'

const props = {
  isVisible: true,
  image: '/',
  name: 'Quiz Answer',
  description: 'Answer description',
  link: '/',
  listTitle: 'List items',
  listItems: ['item1', 'item2'],
  shopText: 'Shop',
  retryText: 'Retry',
  clearQuiz: jest.fn(),
}

jest.mock(
  'src/shared/components/common/Image/Image',
  () =>
    class MockedImage extends mockComponent {
      render() {
        return (
          <img className="QuizAnswer-image" src={this.props.image} alt="" />
        )
      }
    }
)

const { WrappedComponent } = QuizAnswer

test('<QuizAnswer /> exists', () => {
  const component = mount(<WrappedComponent {...props} />)

  const node = component.find('.QuizAnswer')
  expect(node).toBeTruthy()

  expect(node.find('.QuizAnswer-image').hostNodes().length).toBe(1)
  expect(node.find('.QuizAnswer-name').length).toBe(1)
  expect(node.find('.QuizAnswer-description').length).toBe(1)
  component.unmount()
})

test('<QuizAnswer /> should be visible', () => {
  const component = mount(<WrappedComponent {...props} />)
  expect(component.find('.QuizAnswer.is-shown')).toBeTruthy()
  component.unmount()
})

test('<QuizAnswer /> should render list', () => {
  const component = mount(<WrappedComponent {...props} />)
  expect(component.find('.QuizAnswer-listTitle').length).toBe(1)
  expect(component.find('.QuizAnswer-listItem').length).toBe(2)
  component.unmount()
})

test('<QuizAnswer /> should render buttons', () => {
  const component = mount(<WrappedComponent {...props} />)
  expect(component.find('.QuizAnswer-button').hostNodes().length).toBe(1)
  expect(component.find('.QuizAnswer-retryButton').hostNodes().length).toBe(1)
  component.unmount()
})

test('<QuizAnswer /> retry should call clearQuiz', () => {
  const component = mount(<WrappedComponent {...props} />)
  const retry = component.find('.QuizAnswer-retryButton').first()

  retry.simulate('click')
  expect(props.clearQuiz).toHaveBeenCalled()

  component.unmount()
})
