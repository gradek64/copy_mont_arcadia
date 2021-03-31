import React from 'react'
import {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'

import InputError from './InputError'

describe('<InputError />', () => {
  const defaultProps = {
    name: 'input',
    className: 'Input-custom',
    children: <div className="test-class">Test text</div>,
  }

  describe('@renders', () => {
    const renderComponent = buildComponentRender(mountRender, InputError)
    const { wrapper, instance } = renderComponent(defaultProps)

    it('sets attributes and errorText ref', () => {
      expect(wrapper.find('.Input-custom').hostNodes().length).toBe(1)
      expect(
        wrapper
          .find('.Input-custom')
          .hostNodes()
          .text()
      ).toBe('Test text')
      expect(wrapper.find('.test-class').length).toBe(1)
      expect(wrapper.find('#input-error').length).toBe(1)
      expect(instance.errorText).toBeTruthy()
    })

    it('executes focus on the error text element', () => {
      instance.errorText = { focus: jest.fn() }
      instance.componentDidMount()
      expect(instance.errorText.focus).toHaveBeenCalledTimes(1)
    })
  })
})
