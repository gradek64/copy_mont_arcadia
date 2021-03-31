import React from 'react'

import extractRouteParams from '../extract-route-params'

describe('Extract Route Params', () => {
  const component = () => <div />
  const routeProps = {
    cacheable: false,
    path: '/**/**/category/**(/**):param',
  }

  it('should pull out supplied route params from the props and pass to the component', () => {
    const decoratedComponent = extractRouteParams(['cacheable', 'path'])(
      component
    )({ route: routeProps })
    const { cacheable, path } = decoratedComponent.props
    expect(cacheable).toBe(false)
    expect(path).toBe('/**/**/category/**(/**):param')
  })

  it('should handle non-existent route params', () => {
    const decoratedComponent = extractRouteParams(['cacheable', 'path'])(
      component
    )({
      route: {
        path: '/**/**/category/**(/**):param',
      },
    })
    const { cacheable, path } = decoratedComponent.props
    expect(cacheable).toBeUndefined()
    expect(path).toBe('/**/**/category/**(/**):param')
  })

  it('should handle non-existent route prop', () => {
    const decoratedComponent = extractRouteParams(['cacheable', 'path'])(
      component
    )({})
    const { cacheable } = decoratedComponent.props
    expect(cacheable).toBeUndefined()
  })

  it('should remove `route` from component‘s props', () => {
    const decoratedComponent = extractRouteParams(['cacheable', 'path'])(
      component
    )({ route: routeProps })
    const { route } = decoratedComponent.props
    expect(route).toBeUndefined()
  })

  it('should added `WrappedComponent` property', () => {
    const Foo = () => {}
    expect(extractRouteParams(['path'])(Foo).WrappedComponent).toBe(Foo)
  })
})
