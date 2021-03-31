import EmailBackInStock from '../EmailBackInStock'

jest.mock('../../../Mapper')

describe('EmailBackInStock', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    it('sets destinationEndpoint', () => {
      const emailBackStock = new EmailBackInStock()
      expect(emailBackStock.destinationEndpoint).toBeUndefined()
      emailBackStock.mapEndpoint()
      expect(emailBackStock.destinationEndpoint).toBe(
        `/webapp/wcs/stores/servlet/EmailWhenInStockCmd`
      )
    })
  })
  describe('mapRequestParameters', () => {
    it('sets payload', () => {
      const inputPayload = {
        email: 'test@email.com',
        firstName: 'myFirstName',
        productId: 27926022,
        sku: 602017001081265,
        size: 4,
        surname: 'myLastName',
      }
      const expectedPayload = {
        catalogId: 33057,
        catentry_id: inputPayload.productId,
        foreName: inputPayload.firstName,
        Email_address: inputPayload.email,
        langId: '-1',
        partnumber: inputPayload.sku,
        size: inputPayload.size,
        storeId: 12556,
        surName: inputPayload.surname,
      }
      const emailBackStock = new EmailBackInStock()
      emailBackStock.storeConfig = {
        catalogId: 33057,
        langId: '-1',
        siteId: 12556,
      }
      emailBackStock.payload = inputPayload

      expect(emailBackStock.payload).toEqual(inputPayload)
      emailBackStock.mapRequestParameters()
      expect(emailBackStock.payload).toEqual(expectedPayload)
    })
  })
})
