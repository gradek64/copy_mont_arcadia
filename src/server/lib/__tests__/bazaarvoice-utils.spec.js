import * as bazaarvoiceUtils from '../bazaarvoice-utils'

describe('bazaarvoice-utils', () => {
  it('pads the number with 1 leading 0', () => {
    expect(bazaarvoiceUtils.pad(1, 2)).toEqual('01')
    expect(bazaarvoiceUtils.pad(1, 3)).toEqual('001')
  })

  it('gets simple date', () => {
    expect(bazaarvoiceUtils.getSimpleDate(new Date(2016, 4, 24))).toEqual(
      '20160524'
    )
  })

  it('url encodes object', () => {
    expect(
      bazaarvoiceUtils.urlEncode({ date: '20160524', userId: '123' })
    ).toEqual('date=20160524&userId=123')
  })

  it('encodes user id', () => {
    expect(bazaarvoiceUtils.encodeUserId(123, new Date(2016, 4, 26))).toEqual(
      '7aaa4a3c97536e6343d89eb185d8ea86646174653d3230313630353236267573657269643d313233'
    )
  })
})
