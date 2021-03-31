import NotifyMe from '../NotifyMe'

jest.mock('../../Mapper')

describe('NotifyMe', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    it('sets destinationEndpoint', () => {
      const notifyMe = new NotifyMe()
      expect(notifyMe.destinationEndpoint).toBeUndefined()
      notifyMe.mapEndpoint()
      expect(notifyMe.destinationEndpoint).toBe(
        `/webapp/wcs/stores/servlet/ArcadiaNotifyMeEnrollment`
      )
    })
  })
  describe('mapRequestParameters', () => {
    it('sets payload', () => {
      const inputQuery = {
        email: 'test@email.com',
        firstName: 'myFirstName',
        productId: 27926022,
        sku: 602017001081265,
        size: 4,
        surname: 'myLastName',
      }
      const expectedPayload = {
        catalogId: 33057,
        catentry_id: inputQuery.productId,
        foreName: inputQuery.firstName,
        Email_address: inputQuery.email,
        langId: '-1',
        partnumber: inputQuery.sku,
        size: inputQuery.size,
        storeId: 12556,
        surName: inputQuery.surname,
      }
      const notifyMe = new NotifyMe()
      notifyMe.storeConfig = {
        catalogId: 33057,
        langId: '-1',
        siteId: 12556,
      }
      notifyMe.query = inputQuery

      expect(notifyMe.payload).toBeUndefined()
      notifyMe.mapRequestParameters()
      expect(notifyMe.payload).toEqual(expectedPayload)
    })

    it('set method', () => {
      const notifyMe = new NotifyMe()
      notifyMe.storeConfig = {
        catalogId: 33057,
        langId: '-1',
        siteId: 12556,
      }
      notifyMe.query = {
        email: 'test@email.com',
        firstName: 'myFirstName',
        productId: 27926022,
        sku: 602017001081265,
        size: 4,
        surname: 'myLastName',
      }

      expect(notifyMe.method).toBeUndefined()
      notifyMe.mapRequestParameters()
      expect(notifyMe.method).toEqual('post')
    })
  })
})
