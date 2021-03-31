import React from 'react'
import { mount } from 'enzyme'

import Form from '../Form'

describe('Form', () => {
  it('renders an html form', () => {
    const wrapper = mount(<Form />)

    expect(wrapper.find('form')).toHaveLength(1)
  })

  it('turns off native validation by default', () => {
    const wrapper = mount(<Form />)
    const noValidateProp = wrapper.find('form').prop('noValidate')

    expect(noValidateProp).toBe(true)
  })

  it('allows native validation to be turned back on', () => {
    const wrapper = mount(<Form noValidate={false} />)
    const noValidateProp = wrapper.find('form').prop('noValidate')

    expect(noValidateProp).toBe(false)
  })

  it('calls onSubmit prop on form submit', () => {
    const onSubmitHandler = jest.fn()
    const wrapper = mount(<Form onSubmit={onSubmitHandler} />)

    const onSubmit = wrapper.find('form').prop('onSubmit')

    onSubmit()
    expect(onSubmitHandler).toHaveBeenCalled()
  })

  it('passes on classnames to the html form', () => {
    const className = 'some dummy classes'
    const wrapper = mount(<Form className={className} />)

    const classes = wrapper.find('form').prop('className')

    expect(classes).toBe(className)
  })

  it('renders children', () => {
    const className = 'some dummy classes'
    const wrapper = mount(
      <Form className={className}>
        <input type="submit" id="dummyInput" />
      </Form>
    )

    expect(wrapper.find('#dummyInput')).toHaveLength(1)
  })
})
