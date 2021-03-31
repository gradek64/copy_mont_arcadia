# Very important information regarding the `dataLayer`

The `dataLayer` depends on one of our packages called `@ag-digital/analytics-datalayer`. Unfortunately this package is riddled with issues.  For one it exports a singleton, and whilst it also exports a "factory" function in the form of the `extendArray` function internally all created instances end up sharing the same object maps.  Therefore you will get issues if you try to create a new instance and register an adapter that was previously registered to a different schema.

Therefore we are forced to just treat the `dataLayer` as a singleton.

In order to minimise the impact on tests the suggestion is to mock any imports of `dataLayer` and then assert that the mock was called with the expected values.  An example of this is below:

```javascript
import doTracking from '../myTrackingCode'

jest.mock('../../dataLayer', () => ({
  push: jest.fn()
}))

describe('myTrackingCode', () => {
  let dataLayerMock

  beforeEach(() => {
    jest.clearAllMocks()
    dataLayerMock = require('../../dataLayer')
  })

  it('tracking records the expected data', () => {
    myTrackingCode()

    expect(dataLayerMock.push).toHaveBeenCalledTimes(1)
    const actualDataLayerPushArgs = dataLayerMock.push.mock.calls[0]
    expect(actualDataLayerPushArgs).toEqual([
      {
        pageCategory: 'foo'
      },
      'fooSchema',
      'pageView'
    ])
  })
})
```

_Please note_ that this is just a _temporary_ solution. The best solution would be for us to refactor the `@ag-digital/analytics-datalayer` to export a proper factory function that we could depend upon in order to create independent instances. Until then, we deal with the above.
