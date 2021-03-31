import * as analyticsConstants from '../analytics-constants'

describe('ANALYTICS_ACTION', () => {
  it('should be the correct set of action type strings', () => {
    expect(analyticsConstants.ANALYTICS_ACTION).toMatchSnapshot()
  })
})

describe('GTM_EVENT', () => {
  it('should be the correct set of values', () => {
    expect(analyticsConstants.GTM_EVENT).toMatchSnapshot()
  })
})

describe('GTM_TRIGGER', () => {
  it('should be the correct set of values', () => {
    expect(analyticsConstants.GTM_TRIGGER).toMatchSnapshot()
  })
})
