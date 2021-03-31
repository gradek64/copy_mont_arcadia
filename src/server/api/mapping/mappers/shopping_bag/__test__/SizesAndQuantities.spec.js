jest.mock('../../../Mapper')
import SizesAndQuantities from '../SizesAndQuantities'

jest.mock('../../../transforms/sizesAndQuantities')
import transform from '../../../transforms/sizesAndQuantities'

const storeConfig = {
  langId: '-1',
  siteId: 12556,
  catalogId: 33507,
}

const montyQuery = {
  catEntryId: 12345678,
}

const wcsParameters = {
  langId: '-1',
  storeId: 12556,
  catalogId: 33507,
  catEntryId: 12345678,
}

const wcsBody = { body: 'wcs body' }
const transformedBody = { body: 'transformed body' }

describe('SizesAndQuantities Mapper', () => {
  describe('mapEndpoint', () => {
    it('should set the endpoint to /webapp/wcs/stores/servlet/ChangeDetailsDisplayAjaxView', () => {
      const sizesAndQuantities = new SizesAndQuantities()
      expect(sizesAndQuantities.destinationEndpoint).toBeUndefined()
      sizesAndQuantities.mapEndpoint()
      expect(sizesAndQuantities.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/ChangeDetailsDisplayAjaxView'
      )
    })
  })

  describe('mapRequestParameters', () => {
    it('should set the query to a format expected by WCS', () => {
      const sizesAndQuantities = new SizesAndQuantities()
      sizesAndQuantities.storeConfig = storeConfig
      sizesAndQuantities.query = montyQuery
      sizesAndQuantities.mapRequestParameters()
      expect(sizesAndQuantities.query).toEqual(wcsParameters)
    })
  })

  describe('mapResponseBody', () => {
    it('should map the response using the sizesAndQuantities transform function', () => {
      const sizesAndQuantities = new SizesAndQuantities()
      transform.mockReturnValue(transformedBody)
      expect(sizesAndQuantities.mapResponseBody(wcsBody)).toEqual(
        transformedBody
      )
      expect(transform).toHaveBeenCalledTimes(1)
      expect(transform).toHaveBeenCalledWith(wcsBody)
    })
  })
})
