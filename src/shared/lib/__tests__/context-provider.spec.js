import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'

import ContextProvider from '../context-provider'

class TestConsumer extends React.Component {
  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  render() {
    return (
      <p>
        {this.context.l('cmon its a steal')}: {this.context.p('10')}
      </p>
    )
  }
}

const TestComponent = (props) => (
  <ContextProvider {...props}>
    <TestConsumer />
  </ContextProvider>
)

const noop = () => {}

describe('ContextProvider', () => {
  beforeEach(jest.clearAllMocks)

  it('should pass down the localise function as `l`', () => {
    const lSpy = jest.fn()
    expect(lSpy).not.toHaveBeenCalled()
    mount(<TestComponent localise={lSpy} formatPrice={noop} />)
    expect(lSpy).toHaveBeenCalled()
    expect(lSpy).toHaveBeenCalledWith('cmon its a steal')
  })

  it('should pass down the formatPrice function as `p`', () => {
    const pSpy = jest.fn()
    expect(pSpy).not.toHaveBeenCalled()
    mount(<TestComponent localise={noop} formatPrice={pSpy} />)
    expect(pSpy).toHaveBeenCalled()
    expect(pSpy).toHaveBeenCalledWith('10')
  })
})
