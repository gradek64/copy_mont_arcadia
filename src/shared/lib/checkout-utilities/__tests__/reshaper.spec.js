import { selectedDeliveryLocationSafe } from '../reshaper'
import errorOrderSummary from './mocks/errorOrderSummary.json'
import parcelShopOrderSummary from './mocks/orderSummaryParcelShop.json'
import deliveryMethodNoLocationSelected from './mocks/deliveryLocationsNoSelected.json'
import deliveryMethodWithOptions from './mocks/deliveryLocationWithOptions.json'

describe('getSelectedDeliveryLocation', () => {
  it('send to selectedDeliveryLocationSafe orderSummary with NO location selected', () => {
    expect(
      selectedDeliveryLocationSafe(errorOrderSummary.deliveryLocations)
    ).toEqual({
      cost: 0,
      deliveryMethod: 'PARCELSHOP',
      deliveryType: 'PARCELSHOP',
      label: '',
      shipModeId: 0,
    })
  })

  it('send to selectedDeliveryLocationSafe a parcelShop OrderSummary', () => {
    expect(
      selectedDeliveryLocationSafe(parcelShopOrderSummary.deliveryLocations)
    ).toEqual({
      deliveryType: 'STORE_EXPRESS',
      shipModeId: 45020,
      cost: '3.00',
      label: 'Collect From Store Express',
      deliveryMethod: 'STORE',
      additionalDescription: 'Collection date Saturday 15 September 2018',
    })
  })

  it('should return basic options if no locations is selected from deliveryMethods', () => {
    expect(
      selectedDeliveryLocationSafe(
        deliveryMethodNoLocationSelected.deliveryLocations
      )
    ).toEqual({
      deliveryType: '',
      shipModeId: 0,
      cost: 0,
      label: '',
    })
  })

  it('should return basic options if locations is selected but not deliveryMethods', () => {
    const noDeliveryMethod = deliveryMethodNoLocationSelected.deliveryLocations
    noDeliveryMethod[0].selected = true
    expect(selectedDeliveryLocationSafe(noDeliveryMethod)).toEqual({
      cost: 0,
      deliveryMethod: 'HOME',
      deliveryType: 'HOME',
      label: '',
      shipModeId: 0,
    })
  })

  it('should return all the option selected for expess delivery', () => {
    expect(
      selectedDeliveryLocationSafe(deliveryMethodWithOptions.deliveryLocations)
    ).toEqual({
      additionalDescription: '',
      cost: '6.00',
      dateText: '15 Sep',
      dayText: 'Sat',
      deliveryMethod: 'HOME',
      deliveryType: 'HOME_EXPRESS',
      label: 'Next or Named Day Delivery',
      nominatedDate: '2018-09-15',
      shipModeId: 28007,
    })
  })

  it('should return basic options if deliveryOptions are all false (defensive js)', () => {
    const noDeliveryLocation = deliveryMethodWithOptions.deliveryLocations
    noDeliveryLocation[0].deliveryMethods[1].deliveryOptions[0].selected = false
    expect(selectedDeliveryLocationSafe(noDeliveryLocation)).toEqual({
      deliveryType: '',
      shipModeId: 0,
      cost: 0,
      label: '',
    })
  })
})
