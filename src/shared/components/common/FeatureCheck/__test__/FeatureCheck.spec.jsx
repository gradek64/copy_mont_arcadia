import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import React from 'react'
import FeatureCheck, { withFeatureCheck } from '../FeatureCheck'
import configureMockStore from '../../../../../../test/unit/lib/configure-mock-store'

const mountOptions = (enabled) => ({
  context: {
    store: configureMockStore({
      features: { status: { TESTING_FLAG: enabled } },
    }),
  },
})

describe('<FeatureCheck />', () => {
  const render = () => (
    <FeatureCheck flag="TESTING_FLAG">
      <div className="children" />
    </FeatureCheck>
  )

  it('should render children if flag is enabled', () => {
    const wrapper = mount(render(), mountOptions(true))
    expect(wrapper.find('.children')).toHaveLength(1)
  })

  it('should render children if flag is disabled', () => {
    const wrapper = mount(render(), mountOptions(false))
    expect(wrapper.find('.children')).toHaveLength(0)
  })
})

describe('withFeatureCheck', () => {
  it('should render the given component if flag is enabled', () => {
    const CompA = withFeatureCheck('TESTING_FLAG')(() => 'hello')
    const store = mountOptions(true).context.store

    const wrapper = mount(
      <Provider store={store}>
        <CompA />
      </Provider>
    )

    expect(wrapper.text()).toBe('hello')
  })

  it("shouldn't render the given component if flag is disabled", () => {
    const CompA = withFeatureCheck('TESTING_FLAG')(() => 'hello')
    const store = mountOptions(false).context.store

    const wrapper = mount(
      <Provider store={store}>
        <CompA />
      </Provider>
    )

    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
