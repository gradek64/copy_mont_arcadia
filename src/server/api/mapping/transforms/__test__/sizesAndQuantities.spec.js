import transform, { sizeFragment } from '../sizesAndQuantities'
import { path } from 'ramda'
import wcsChangeDetailsDisplayAjaxView from '../../../../../../test/apiResponses/shopping-bag/get-size-and-quantity/wcs.json'
import montySizesAndQuantities from '../../../../../../test/apiResponses/shopping-bag/get-size-and-quantity/monty.json'

describe('sizesAndQuantities transform', () => {
  describe('sizeFragment', () => {
    it('should correctly transform a size object from WCS to a format expected by Monty', () => {
      expect(
        sizeFragment(path(['options', 0], wcsChangeDetailsDisplayAjaxView))
      ).toEqual(path(['items', 0], montySizesAndQuantities))
    })

    it('should return a default size object if values are not found', () => {
      expect(sizeFragment({})).toEqual({
        size: '',
        quantity: 0,
        unitPrice: '0.00',
        catEntryId: 0,
        selected: false,
        wasPrice: '',
        wasWasPrice: '',
      })
    })
  })

  describe('sizesAndQuantities transform', () => {
    it('should convert the result from WCS into a format expected by Monty', () => {
      expect(transform(wcsChangeDetailsDisplayAjaxView)).toEqual(
        montySizesAndQuantities
      )
    })

    it('should return a default response if values are not found', () => {
      expect(transform({})).toEqual({
        items: [],
        version: '1.7',
      })
    })
  })
})
