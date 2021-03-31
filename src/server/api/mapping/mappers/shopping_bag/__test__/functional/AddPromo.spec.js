import AddPromo from '../../AddPromo'

import wcsResponseDiscounts from 'test/apiResponses/promotions/checkout/wcs-OrderDiscounts.json'
import wcsResponseOrderDiscounts from 'test/apiResponses/promotions/checkout/wcs-discounts.json'
import wcsResponseWithDiscountsAndOrderDiscounts from 'test/apiResponses/promotions/checkout/wcs-discounts-and-orderDiscounts.json'
import hapiResponse from 'test/apiResponses/promotions/checkout/hapi.json'

describe('#AddPromo wcs -> hapi response mapping', () => {
  it('maps as expected WCS response where the promotions data is inside the "OrderDiscounts" property', () => {
    const addPromo = new AddPromo()
    expect(addPromo.mapResponseBody(wcsResponseOrderDiscounts)).toEqual(
      hapiResponse
    )
  })
  it('maps as expected WCS response where the promotions data is inside the "discounts" property', () => {
    const addPromo = new AddPromo()
    expect(addPromo.mapResponseBody(wcsResponseDiscounts)).toEqual(hapiResponse)
  })
  it('maps as expected WCS response giving precedence to the "discounts" property when both "discounts" and "OrderDiscounts" are provided in the WCS response', () => {
    const addPromo = new AddPromo()
    expect(
      addPromo.mapResponseBody(wcsResponseWithDiscountsAndOrderDiscounts)
    ).toEqual(hapiResponse)
  })
})
