import transform from '../siteOptions'
import {
  creditCardOptions,
  expiryMonths,
  USStates,
} from '../../constants/siteOptions'
import wcs from '../../../../../../test/apiResponses/site-options/wcs.json'
import hapiMonty from '../../../../../../test/apiResponses/site-options/hapiMonty.json'
import { getExpiryYears } from '../../utils/genericUtils'

describe('siteOptions transform function', () => {
  const expiryYears = getExpiryYears(12)
  const baseOptions = {
    creditCardOptions,
    expiryMonths,
    expiryYears,
    USStates,
  }

  it('maps siteOptions constants and expiry years', () => {
    expect(transform({})).toEqual(baseOptions)
  })

  it('maps extra options', () => {
    expect(transform({ option: 'new' })).toEqual({
      ...baseOptions,
      option: 'new',
    })
  })

  it('does not map ddp property if invalid', () => {
    expect(transform({ ddp: null })).toEqual(baseOptions)
  })

  it('maps ddp and transforms fragments', () => {
    expect(transform(wcs)).toEqual({
      ...hapiMonty,
      expiryYears,
    })
  })
})
